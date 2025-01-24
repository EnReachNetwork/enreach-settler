export interface RewardsDistributionRoot {
  merkleRoot: `0x${string}`;
  rewardsCalculationEndEpoch: bigint;
  rewardsCalculationEndTimestamp: bigint;
  activatedAt: bigint;
  disabled: bigint;
}
