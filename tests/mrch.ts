import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Mrch } from "../target/types/mrch";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const provider = anchor.AnchorProvider.env();

async function fundWallet(wallet: anchor.web3.Keypair, sol = 2) {
  const sig = await provider.connection.requestAirdrop(
    wallet.publicKey,
    sol * anchor.web3.LAMPORTS_PER_SOL
  );
  const blockhash = await provider.connection.getLatestBlockhash();
  await provider.connection.confirmTransaction(
    {
      signature: sig,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    },
    "confirmed"
  );
}

describe("mrch", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const owner = anchor.web3.Keypair.generate();

  const program = anchor.workspace.mrch as Program<Mrch>;

  before(async () => {
    await fundWallet(owner);
  });

  it("creates the store!", async () => {
    // Add your test here.
    const seed = new anchor.BN(1);
    const store_name = "Test Store";
    const [storeAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("store"),
        owner.publicKey.toBuffer(),
        seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const tx = await program.methods
      .createStore(seed, store_name)
      .accountsPartial({
        owner: owner.publicKey,
        storeAccount,
        systemProgram: SystemProgram.programId,
      })
      .signers([owner])
      .rpc();
    console.log("your store creation transaction signature", tx);
  });

  it("creates a listing!", async () => {
    const store = owner.publicKey;
    const listing_name = "Test Listing";
    const price = new anchor.BN(10);
    const quantity = new anchor.BN(5);
    const image_uri =
      "https://fastly.picsum.photos/id/611/600/600.jpg?hmac=vYc-htgLQzsJ9EiYYBXUr0Byvb7SmdL0D1BvlzX13n0";
    const store_seed = new anchor.BN(1);
    const listing_seed = new anchor.BN(1);
    const [storeAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("store"),
        owner.publicKey.toBuffer(),
        store_seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const [listingAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("listing"),
        storeAccount.toBuffer(),
        listing_seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const tx = await program.methods
      .createListing(
        store_seed,
        listing_seed,
        listing_name,
        price,
        quantity,
        image_uri
      )
      .accountsPartial({
        owner: owner.publicKey,
        storeAccount,
        listingAccount,
        systemProgram: SystemProgram.programId,
      })
      .signers([owner])
      .rpc();

    console.log("your store listing transaction signature", tx);
  });

  it("allows buyer to purchase!", async () => {
    const buyer = anchor.web3.Keypair.generate();
    await fundWallet(buyer);
    const store_seed = new anchor.BN(1);
    const listing_seed = new anchor.BN(1);
    const escrow_seed = new anchor.BN(1);
    const [storeAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("store"),
        owner.publicKey.toBuffer(),
        store_seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const [listing] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("listing"),
        storeAccount.toBuffer(),
        listing_seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const [escrow] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("escrow"),
        buyer.publicKey.toBuffer(),
        escrow_seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const quantity = new anchor.BN(1);

    const tx = await program.methods
      .makePurchase(store_seed, listing_seed, escrow_seed, quantity)
      .accountsPartial({
        buyer: buyer.publicKey,
        storeOwner: owner.publicKey,
        storeAccount,
        listing,
        escrow,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    console.log("first purchase transaction signature", tx);
  });

  ///
  it("allows another buyer to purchase!", async () => {
    const buyer = anchor.web3.Keypair.generate();
    await fundWallet(buyer);
    const store_seed = new anchor.BN(1);
    const listing_seed = new anchor.BN(1);
    const escrow_seed = new anchor.BN(1);
    const [storeAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("store"),
        owner.publicKey.toBuffer(),
        store_seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const [listing] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("listing"),
        storeAccount.toBuffer(),
        listing_seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const [escrow] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("escrow"),
        buyer.publicKey.toBuffer(),
        escrow_seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const quantity = new anchor.BN(1);

    const tx = await program.methods
      .makePurchase(store_seed, listing_seed, escrow_seed, quantity)
      .accountsPartial({
        buyer: buyer.publicKey,
        storeOwner: owner.publicKey,
        storeAccount,
        listing,
        escrow,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    console.log("second purchase transaction signature", tx);
  });
});
