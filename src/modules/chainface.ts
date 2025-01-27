import { account, publicClient, walletClient } from "../config/chain.js";
import { RewardsDistributorABI } from "../constants/rewards-distributor.js";
import { REWARDS_DISTRIBUTOR_ADDRESS } from "../constants/index.js";
import { RewardsDistributionRoot } from "../types/chain.js";
import { holesky } from "viem/chains";

export const getRewardsDistributionRootCount = async () => {
  const res = await publicClient.readContract({
    abi: RewardsDistributorABI,
    address: REWARDS_DISTRIBUTOR_ADDRESS,
    functionName: "getRewardsDistributionRootCount",
  });

  return res as bigint;
};

export const getRewardsDistributionRoot = async (index: bigint) => {
  const res = await publicClient.readContract({
    abi: RewardsDistributorABI,
    address: REWARDS_DISTRIBUTOR_ADDRESS,
    functionName: "getRewardsDistributionRoot",
    args: [index],
  });

  return res as RewardsDistributionRoot;
};

export const getOnlineEpoch = async () => {
  return publicClient.readContract({
    abi: RewardsDistributorABI,
    address: REWARDS_DISTRIBUTOR_ADDRESS,
    functionName: "currRewardsCalculationEndEpoch",
  });
};

export const submitMerkleRoot = async (epoch: number, root: string) => {
  const hash = await walletClient.writeContract({
    abi: RewardsDistributorABI,
    address: REWARDS_DISTRIBUTOR_ADDRESS,
    functionName: "submitRewardsDistributionRoot",
    args: [root, BigInt(epoch), BigInt(epoch) * 3600n],
    chain: holesky,
    account,
  });
  await publicClient.waitForTransactionReceipt({ hash });
};
