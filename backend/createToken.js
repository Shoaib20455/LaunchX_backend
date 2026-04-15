import { execSync } from "child_process";

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" });
}

async function createLXToken() {
  try {
    console.log("🚀 Creating token...");

    // 1. Create token
    const output = run(
      `spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata --decimals 9`
    );

    console.log(output);

    // بہتر parsing (more stable)
    const match =
      output.match(/Creating token\s+([A-Za-z0-9]+)/) ||
      output.match(/Token:\s*([A-Za-z0-9]+)/);

    const mintAddress = match?.[1];

    if (!mintAddress) {
      throw new Error("Mint address not found in CLI output");
    }

    console.log("Mint Address:", mintAddress);

    // 2. Create creator ATA (important)
    run(`spl-token create-account ${mintAddress}`);
    console.log("ATA created");

    // 3. Mint tokens
    run(`spl-token mint ${mintAddress} 4200000000`);
    console.log("Tokens minted");

    // 4. Initialize metadata
    run(
      `spl-token initialize-metadata ${mintAddress} "LaunchX Coin" "LX" "https://ipfs.io/ipfs/bafybeiddfwlkrqqrmzgqhvilf4ldpuk2tw47gbe65vhpkq3q4bcxopj2km"`
    );
    console.log("Metadata set");

    // 5. Disable mint authority
    run(`spl-token authorize ${mintAddress} mint --disable`);
    console.log("Mint authority disabled");

    console.log("✅ Token created successfully:", mintAddress);

    return mintAddress;
  } catch (err) {
    console.error("❌ Error:", err.message);
    throw err;
  }
}

createLXToken();