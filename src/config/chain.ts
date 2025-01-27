import {
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
  WalletClient,
} from "viem";
import { holesky } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { ENV } from "./env.js";

export const publicClient: PublicClient = createPublicClient({
  chain: holesky,
  transport: http(),
});

export const account = privateKeyToAccount(ENV.PRIVATE_KEY as `0x${string}`);
export const walletClient: WalletClient = createWalletClient({
  account,
  chain: holesky,
  transport: http(),
});
