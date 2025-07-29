import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Mrch } from "../target/types/mrch";
import { PublicKey, SystemProgram } from "@solana/web3.js";

describe("mrch", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const owner = anchor.web3.Keypair.generate();

  const program = anchor.workspace.mrch as Program<Mrch>;

  before(async () => {
    const signature = await provider.connection.requestAirdrop(
      owner.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    const blockhash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction(
      {
        signature: signature,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight,
      },
      "confirmed"
    );
  });

  it("creates the store!", async () => {
    // Add your test here.
    const seed = new anchor.BN(1);
    const name = "Test Store";
    const [storeAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("store"),
        owner.publicKey.toBuffer(),
        seed.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );
    const tx = await program.methods
      .createStore(seed, name)
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
    const name = "Test Store";
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
      .createListing(store_seed, listing_seed, name, price, quantity, image_uri)
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
});
