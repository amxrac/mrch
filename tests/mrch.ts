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
    const name = "New Store";
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
});
