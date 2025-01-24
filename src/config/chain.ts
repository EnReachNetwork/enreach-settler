import { createPublicClient, createWalletClient, http } from "viem";
import { holesky } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { ENV } from "./env.js";

export const publicClient = createPublicClient({
  chain: holesky,
  transport: http(),
});

const account = privateKeyToAccount(ENV.PRIVATE_KEY as `0x${string}`);
export const walletClient = createWalletClient({
  account,
  chain: holesky,
  transport: http(),
});
