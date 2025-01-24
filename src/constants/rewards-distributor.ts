export const RewardsDistributorABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_protocol",
        type: "address",
      },
      {
        internalType: "address",
        name: "_settings",
        type: "address",
      },
      {
        internalType: "address",
        name: "_rewardsToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "rootIndex",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardsClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "rootIndex",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
    ],
    name: "RewardsDistributionRootDisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "rootIndex",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
    ],
    name: "RewardsDistributionRootEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "rootIndex",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "rewardsCalculationEndEpoch",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardsCalculationEndTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "activatedAt",
        type: "uint256",
      },
    ],
    name: "RewardsDistributionRootSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "rewarder",
        type: "bool",
      },
    ],
    name: "UpdateRewarder",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "rootIndex",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "accountIndex",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "merkleProof",
        type: "bytes32[]",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "cumulativeClaimedRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currRewardsCalculationEndEpoch",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currRewardsCalculationEndTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "rootIndex",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
    ],
    name: "disableRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "rootIndex",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
    ],
    name: "enableRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRewarder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRewarders",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRewardersCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRewardsDistributionRoot",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "rewardsCalculationEndEpoch",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rewardsCalculationEndTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "activatedAt",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "disabled",
            type: "bool",
          },
        ],
        internalType: "struct IRewardsDistributor.RewardsDistributionRoot",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRewardsDistributionRootCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRewardsDistributionRoots",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "rewardsCalculationEndEpoch",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rewardsCalculationEndTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "activatedAt",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "disabled",
            type: "bool",
          },
        ],
        internalType: "struct IRewardsDistributor.RewardsDistributionRoot[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isRewarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocol",
    outputs: [
      {
        internalType: "contract IEnReachProtocol",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bool",
        name: "rewarder",
        type: "bool",
      },
    ],
    name: "setRewarder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "settings",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "rewardsCalculationEndEpoch",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardsCalculationEndTimestamp",
        type: "uint256",
      },
    ],
    name: "submitRewardsDistributionRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
