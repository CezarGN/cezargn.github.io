import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, keypairIdentity, percentAmount } from '@metaplex-foundation/umi';
import fs from 'fs';
import os from 'os';
import path from 'path';
import bs58 from 'bs58';

// 1. Connect to Devnet
const umi = createUmi('https://api.devnet.solana.com');

const secretKey = new Uint8Array(
  JSON.parse(
    fs.readFileSync(
      path.join(os.homedir(), '.config', 'solana', 'id.json'),
      'utf8'
    )
  )
);
const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
umi.use(keypairIdentity(keypair));

// 3. Register the Token Metadata Program
umi.use(mplTokenMetadata());

// 4. Generate a random Mint Address
const mint = generateSigner(umi);

// 5. Send the transaction
async function mintMyNFT() {
    const tx = await createNft(umi, {
        mint,
        name: "CezarN NFT",
        symbol: "UPBNFT",
        uri: "https://github.com/CezarGN/cezargn.github.io/blob/main/solana-nft-metadata/metadata.json", // Link to off-chain JSON
        sellerFeeBasisPoints: percentAmount(5), // 5% royalties
    }).sendAndConfirm(umi);

    console.log("NFT Mint Address:", mint.publicKey);
}

mintMyNFT();