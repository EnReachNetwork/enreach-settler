#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// src/api/index.ts
import express from "express";

// src/utils/logger.ts
import chalk from "chalk";
var logger = {
  info: (msg) => console.log(chalk.blue(msg)),
  success: (msg) => console.log(chalk.green(msg)),
  warning: (msg) => console.log(chalk.yellow(msg)),
  error: (msg) => console.log(chalk.red(msg))
};

// src/config/chain.ts
import {
  createPublicClient,
  createWalletClient,
  http
} from "viem";
import { holesky } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// src/config/env.ts
import { config } from "dotenv";
import { join } from "path";
import { existsSync } from "fs";
var envPath = join(process.cwd(), ".env");
if (!existsSync(envPath)) {
  logger.error("No .env file found");
} else {
  config();
}
var ENV = {
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  MANAGER_URL: process.env.MANAGER_URL || "ws://localhost",
  MANAGER_PORT: parseInt(process.env.MANAGER_PORT || "6677", 10),
  HEARTBEAT_INTERVAL: parseInt(process.env.HEARTBEAT_INTERVAL || "5000", 10)
};

// src/config/chain.ts
var publicClient = createPublicClient({
  chain: holesky,
  transport: http()
});
var account = privateKeyToAccount(ENV.PRIVATE_KEY);
var walletClient = createWalletClient({
  account,
  chain: holesky,
  transport: http()
});

// src/constants/rewards-distributor.ts
var RewardsDistributorABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_protocol",
        type: "address"
      },
      {
        internalType: "address",
        name: "_settings",
        type: "address"
      },
      {
        internalType: "address",
        name: "_rewardsToken",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "rootIndex",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "RewardsClaimed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "rootIndex",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32"
      }
    ],
    name: "RewardsDistributionRootDisabled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "rootIndex",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32"
      }
    ],
    name: "RewardsDistributionRootEnabled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "rootIndex",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "rewardsCalculationEndEpoch",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardsCalculationEndTimestamp",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "activatedAt",
        type: "uint256"
      }
    ],
    name: "RewardsDistributionRootSubmitted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "rewarder",
        type: "bool"
      }
    ],
    name: "UpdateRewarder",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Withdrawn",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "rootIndex",
        type: "uint256"
      },
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "accountIndex",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        internalType: "bytes32[]",
        name: "merkleProof",
        type: "bytes32[]"
      }
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "cumulativeClaimedRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "currRewardsCalculationEndEpoch",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "currRewardsCalculationEndTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "rootIndex",
        type: "uint32"
      },
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32"
      }
    ],
    name: "disableRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "rootIndex",
        type: "uint32"
      },
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32"
      }
    ],
    name: "enableRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256"
      }
    ],
    name: "getRewarder",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getRewarders",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getRewardersCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256"
      }
    ],
    name: "getRewardsDistributionRoot",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32"
          },
          {
            internalType: "uint256",
            name: "rewardsCalculationEndEpoch",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "rewardsCalculationEndTimestamp",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "activatedAt",
            type: "uint256"
          },
          {
            internalType: "bool",
            name: "disabled",
            type: "bool"
          }
        ],
        internalType: "struct IRewardsDistributor.RewardsDistributionRoot",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getRewardsDistributionRootCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
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
            type: "bytes32"
          },
          {
            internalType: "uint256",
            name: "rewardsCalculationEndEpoch",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "rewardsCalculationEndTimestamp",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "activatedAt",
            type: "uint256"
          },
          {
            internalType: "bool",
            name: "disabled",
            type: "bool"
          }
        ],
        internalType: "struct IRewardsDistributor.RewardsDistributionRoot[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "isRewarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "protocol",
    outputs: [
      {
        internalType: "contract IEnReachProtocol",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "rewardsToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "bool",
        name: "rewarder",
        type: "bool"
      }
    ],
    name: "setRewarder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "settings",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "merkleRoot",
        type: "bytes32"
      },
      {
        internalType: "uint256",
        name: "rewardsCalculationEndEpoch",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "rewardsCalculationEndTimestamp",
        type: "uint256"
      }
    ],
    name: "submitRewardsDistributionRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// src/constants/index.ts
var REWARDS_DISTRIBUTOR_ADDRESS = "0x38a1bB0471817C7E0D14Bdd0Ad34B7A49AedceB5";

// src/modules/chainface.ts
var getRewardsDistributionRootCount = async () => {
  const res = await publicClient.readContract({
    abi: RewardsDistributorABI,
    address: REWARDS_DISTRIBUTOR_ADDRESS,
    functionName: "getRewardsDistributionRootCount"
  });
  return res;
};
var getRewardsDistributionRoot = async (index) => {
  const res = await publicClient.readContract({
    abi: RewardsDistributorABI,
    address: REWARDS_DISTRIBUTOR_ADDRESS,
    functionName: "getRewardsDistributionRoot",
    args: [index]
  });
  return res;
};
var getOnlineEpoch = async () => {
  return publicClient.readContract({
    abi: RewardsDistributorABI,
    address: REWARDS_DISTRIBUTOR_ADDRESS,
    functionName: "currRewardsCalculationEndEpoch"
  });
};
var submitMerkleRoot = async (epoch, root) => {
  const hash = await walletClient.writeContract({
    abi: RewardsDistributorABI,
    address: REWARDS_DISTRIBUTOR_ADDRESS,
    functionName: "submitRewardsDistributionRoot",
    args: [root, BigInt(epoch), BigInt(epoch) * 3600n]
  });
  await publicClient.waitForTransactionReceipt({ hash });
};

// src/db.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();

// src/storage/epoch.ts
var storeWorkloadId = async (id) => {
  await prisma.metadata.upsert({
    where: { key: "workload_id" },
    update: { value: id.toString() },
    create: { key: "workload_id", value: id.toString() }
  });
};
var queryWorkloadId = async () => {
  const metadata = await prisma.metadata.findUnique({
    where: { key: "workload_id" }
  });
  return metadata ? parseInt(metadata.value) : 0;
};
var storeEpochWorkload = async (epoch, data) => {
  await prisma.score.upsert({
    where: { epoch },
    update: { data },
    create: { epoch, data }
  });
};
var queryEpochWorkload = async (epoch) => {
  const score = await prisma.score.findFirst({
    where: { epoch }
  });
  return score && score.data ? JSON.parse(score.data) : [];
};

// src/utils/parse-balance-map.ts
import { ethers as ethers2 } from "ethers";

// src/utils/balance-tree.ts
import { ethers } from "ethers";

// src/utils/merkle-tree.ts
import { bufferToHex, keccak256 } from "ethereumjs-util";
var MerkleTree = class _MerkleTree {
  elements;
  bufferElementPositionIndex;
  layers;
  constructor(elements) {
    this.elements = [...elements];
    this.elements.sort(Buffer.compare);
    this.elements = _MerkleTree.bufDedup(this.elements);
    this.bufferElementPositionIndex = this.elements.reduce((memo, el, index) => {
      memo[bufferToHex(el)] = index;
      return memo;
    }, {});
    this.layers = this.getLayers(this.elements);
  }
  getLayers(elements) {
    if (elements.length === 0) {
      throw new Error("empty tree");
    }
    const layers = [];
    layers.push(elements);
    while (layers[layers.length - 1].length > 1) {
      layers.push(this.getNextLayer(layers[layers.length - 1]));
    }
    return layers;
  }
  getNextLayer(elements) {
    return elements.reduce((layer, el, idx, arr) => {
      if (idx % 2 === 0) {
        layer.push(_MerkleTree.combinedHash(el, arr[idx + 1]));
      }
      return layer;
    }, []);
  }
  static combinedHash(first, second) {
    if (!first) {
      return second;
    }
    if (!second) {
      return first;
    }
    return keccak256(_MerkleTree.sortAndConcat(first, second));
  }
  getRoot() {
    return this.layers[this.layers.length - 1][0];
  }
  getHexRoot() {
    return bufferToHex(this.getRoot());
  }
  getProof(el) {
    let idx = this.bufferElementPositionIndex[bufferToHex(el)];
    if (typeof idx !== "number") {
      throw new Error("Element does not exist in Merkle tree");
    }
    return this.layers.reduce((proof, layer) => {
      const pairElement = _MerkleTree.getPairElement(idx, layer);
      if (pairElement) {
        proof.push(pairElement);
      }
      idx = Math.floor(idx / 2);
      return proof;
    }, []);
  }
  getHexProof(el) {
    const proof = this.getProof(el);
    return _MerkleTree.bufArrToHexArr(proof);
  }
  static getPairElement(idx, layer) {
    const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    if (pairIdx < layer.length) {
      return layer[pairIdx];
    } else {
      return null;
    }
  }
  static bufDedup(elements) {
    return elements.filter((el, idx) => {
      return idx === 0 || !elements[idx - 1].equals(el);
    });
  }
  static bufArrToHexArr(arr) {
    if (arr.some((el) => !Buffer.isBuffer(el))) {
      throw new Error("Array is not an array of buffers");
    }
    return arr.map((el) => "0x" + el.toString("hex"));
  }
  static sortAndConcat(...args) {
    return Buffer.concat([...args].sort(Buffer.compare));
  }
};

// src/utils/balance-tree.ts
var BalanceTree = class _BalanceTree {
  tree;
  constructor(balances) {
    const hasDuplicateAccounts = _BalanceTree.hasDuplicateAccounts(balances);
    if (hasDuplicateAccounts) {
      throw new Error("Duplicate accounts detected");
    }
    this.tree = new MerkleTree(
      balances.map(({ account: account2, amount }, index) => {
        return _BalanceTree.toNode(index, account2, amount);
      })
    );
  }
  static hasDuplicateAccounts(balances) {
    const seen = /* @__PURE__ */ new Set();
    for (const { account: account2 } of balances) {
      if (seen.has(account2)) {
        return true;
      }
      seen.add(account2);
    }
    return false;
  }
  static verifyProof(index, account2, amount, proof, root) {
    let pair = _BalanceTree.toNode(index, account2, amount);
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item);
    }
    return pair.equals(root);
  }
  // keccak256(abi.encode(index, account, amount))
  static toNode(index, account2, amount) {
    return Buffer.from(
      ethers.solidityPackedKeccak256(
        ["uint256", "address", "uint256"],
        [index, account2, amount]
      ).substr(2),
      "hex"
    );
  }
  getHexRoot() {
    return this.tree.getHexRoot();
  }
  // returns the hex bytes32 values of the proof
  getProof(index, account2, amount) {
    return this.tree.getHexProof(_BalanceTree.toNode(index, account2, amount));
  }
};

// src/utils/parse-balance-map.ts
function toHexString(value) {
  const isNegative = value < 0n;
  const hexString = (isNegative ? -value : value).toString(16).toUpperCase();
  return (isNegative ? "-0x" : "0x") + hexString;
}
var { isAddress, getAddress } = ethers2;
function parseBalanceMap(balances) {
  const balancesInNewFormat = Array.isArray(balances) ? balances : Object.keys(balances).map(
    (account2) => ({
      address: account2,
      earnings: `0x${balances[account2].toString(16)}`,
      reasons: ""
    })
  );
  const dataByAddress = balancesInNewFormat.reduce((memo, { address: account2, earnings, reasons }) => {
    if (!isAddress(account2)) {
      throw new Error(`Found invalid address: ${account2}`);
    }
    const parsed = getAddress(account2);
    if (memo[parsed]) throw new Error(`Duplicate address: ${parsed}`);
    const parsedNum = BigInt(earnings);
    if (parsedNum <= 0)
      throw new Error(`Invalid amount for account: ${account2}`);
    const flags = {
      isSOCKS: reasons.includes("socks"),
      isLP: reasons.includes("lp"),
      isUser: reasons.includes("user")
    };
    memo[parsed] = { amount: parsedNum, ...reasons === "" ? {} : { flags } };
    return memo;
  }, {});
  const sortedAddresses = Object.keys(dataByAddress).sort();
  const tree = new BalanceTree(
    sortedAddresses.map((address) => ({
      account: address,
      amount: dataByAddress[address].amount
    }))
  );
  const claims = sortedAddresses.reduce((memo, address, index) => {
    const { amount, flags } = dataByAddress[address];
    memo[address] = {
      index,
      amount: toHexString(amount),
      proof: tree.getProof(index, address, amount),
      ...flags ? { flags } : {}
    };
    return memo;
  }, {});
  const tokenTotal = sortedAddresses.reduce(
    (memo, key) => memo + dataByAddress[key].amount,
    0n
  );
  return {
    merkleRoot: tree.getHexRoot(),
    tokenTotal: toHexString(tokenTotal),
    claims
  };
}

// src/api/claim.ts
var getClaimProof = async (req, res) => {
  try {
    const address = req.params.address;
    logger.info(`Fetching claim proof ${address}`);
    let index = await getRewardsDistributionRootCount();
    let root = void 0;
    let left = 810n;
    let right = index;
    let mid = 0n;
    while (left + 1n < right) {
      mid = (left + right + 1n) / 2n;
      console.log(left, right, mid);
      root = await getRewardsDistributionRoot(mid);
      logger.info(`Checking root ${mid}, ${JSON.stringify(root)}`);
      if (Number(root.activatedAt) < Date.now() / 1e3) {
        left = mid;
      } else {
        right = mid;
      }
    }
    const finalRoot = await getRewardsDistributionRoot(mid);
    logger.success(`Found root ${JSON.stringify(finalRoot)}`);
    if (root) {
      const workload = queryEpochWorkload(
        finalRoot.rewardsCalculationEndEpoch.toString()
      );
      const oldFormat = Object.fromEntries(
        workload.map((item) => [
          item.account,
          BigInt(item.amount).toString(16)
        ])
      );
      const tree = parseBalanceMap(oldFormat);
      res.status(200).json({
        code: 0,
        data: { index: mid, tree }
      });
    } else {
      res.status(200).json({
        code: 10001,
        data: {}
      });
    }
  } catch (e) {
    console.error("Error fetching files:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

// src/api/index.ts
var defaultPort = 8546;
var startAPIServer = (port = defaultPort) => {
  const app = express();
  app.use(express.json());
  app.get("/claim", getClaimProof);
  app.listen(port, () => {
    logger.info(`API server listening on port ${port}`);
  });
};

// src/storage/init.ts
import * as fs from "fs";

// src/constants/path.ts
import path from "node:path";
var PATHS = {
  DATA_DIR: path.join(process.cwd(), "data"),
  EPOCH_DIR: path.join(process.cwd(), "data/epoch"),
  WORKLOAD_ID_INDEX: path.join(process.cwd(), "data/workload.index"),
  LATEST_MERKLE_TREE: path.join(process.cwd(), "data/latest_merkle_tree.json")
};

// src/storage/init.ts
var initStorage = () => {
  if (!fs.existsSync(PATHS.DATA_DIR)) fs.mkdirSync(PATHS.DATA_DIR);
  if (!fs.existsSync(PATHS.EPOCH_DIR)) fs.mkdirSync(PATHS.EPOCH_DIR);
  if (!fs.existsSync(PATHS.WORKLOAD_ID_INDEX))
    fs.writeFileSync(PATHS.WORKLOAD_ID_INDEX, "0");
};

// src/utils/utils.ts
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/actions/workload.ts
var accounts = [
  "0xDEDe0DAA3A63958d7f6544E4AD4C8b1CA66fAFe8",
  "0x0c7FF051D8A472D0023343c536174575D666E15e",
  "0x3704b7461D2Bd7Fbfd5C7ea6B0F2Bd6671F3D3AD",
  "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
  "0x1A005651ee017c8b4f1FBd0DDf7853dC4A185ED1"
];
var getWorkload = async (epoch) => {
  const res = await fetch(
    `http://150.109.123.18:1317/enreach/workload/workload/${epoch}`
  ).then((r) => r.json());
  if (res?.Workload) {
    return {
      ...res?.Workload,
      account: accounts[Number((res?.Workload).epoch) % accounts.length]
    };
  }
  return null;
};

// src/storage/workload.ts
import { parseUnits } from "viem";
async function getNextEpoch(currentEpoch) {
  const nextScore = await prisma.score.findFirst({
    where: {
      epoch: {
        gt: Number(currentEpoch)
      }
    },
    orderBy: {
      epoch: "asc"
    }
  });
  return nextScore ? nextScore.epoch : null;
}
var startWorkloadModule = async (prisma3) => {
  await handleWorkload(prisma3);
  setInterval(handleWorkload, 1e3);
};
async function handleWorkload(prisma3) {
  const id = await queryWorkloadId() + 1;
  logger.info("Handling workload: " + id);
  const res = await getWorkload(id);
  if (!res) return;
  const epoch = parseInt(res.epoch);
  let epochWorkload = await queryEpochWorkload(epoch);
  if (epochWorkload.length > 0) {
    logger.info(`Found existing epoch: ${res.epoch}, workload: ${id}`);
    const idx = epochWorkload.findIndex((item) => item.id === res.minerId);
    if (idx > -1) {
      epochWorkload = epochWorkload.map(
        (item) => res.account === item.account ? { ...item, value: item.amount + parseUnits(res.score, 12) } : item
      );
    } else {
      epochWorkload.push({
        id: res.minerId,
        account: res.account,
        amount: parseUnits(res.score, 12)
      });
    }
  } else {
    logger.info(`Not Found existing epoch: ${res.epoch}, workload: ${id}`);
    const previousEpochWorkload = await queryEpochWorkload(
      Number(res.epoch) - 1
    );
    const idx = previousEpochWorkload.findIndex(
      (item) => item.account === res.account
    );
    if (idx > -1) {
      epochWorkload = previousEpochWorkload.map(
        (item) => res.account === item.account ? { ...item, amount: item.amount + parseUnits(res.score, 12) } : item
      );
    } else {
      previousEpochWorkload.push({
        id: res.minerId,
        account: res.account,
        amount: parseUnits(res.score, 12)
      });
      epochWorkload = [...previousEpochWorkload];
    }
  }
  logger.info("Epoch: " + res.epoch + " Score: " + res.score);
  storeEpochWorkload(epoch, JSON.stringify(epochWorkload));
  storeWorkloadId(id + 1);
}

// src/modules/reward.ts
var startRewardModule = async () => {
  let epoch = await getOnlineEpoch();
  while (true) {
    try {
      const nextEpoch = await getNextEpoch(epoch);
      if (!nextEpoch) {
        await sleep(2e3);
        continue;
      }
      epoch = nextEpoch;
      logger.info(`Submit epoch #${epoch} merkle root`);
      const workload = await queryEpochWorkload(epoch);
      console.log(workload);
      if (workload.length === 0) {
        await sleep(2e3);
        continue;
      }
      const oldFormat = Object.fromEntries(
        workload.map((item) => [
          item.account,
          BigInt(item.amount).toString(16)
        ])
      );
      const tree = parseBalanceMap(oldFormat);
      await submitMerkleRoot(epoch, tree.merkleRoot);
      logger.success(`Merkle root ${epoch} submitted`);
      epoch++;
    } catch (e) {
      logger.error(JSON.stringify(e));
    }
    await sleep(2e3);
  }
};

// src/commands/submit.ts
function registerSubmitCommand(program2) {
  program2.command("submit").description("Register miner to enreach chain").option("-n, --epoch <epoch>", "epoch to submit").action(async (options) => {
    const epoch = options.epoch || "0";
    const workload = queryEpochWorkload(epoch);
    if (workload.length === 0) {
      return;
    }
    const oldFormat = Object.fromEntries(
      workload.map((item) => [
        item.account,
        BigInt(item.amount).toString(16)
      ])
    );
    const tree = parseBalanceMap(oldFormat);
    console.log(oldFormat);
    console.log(tree.merkleRoot, tree.claims, tree.tokenTotal);
    await submitMerkleRoot(epoch, tree.merkleRoot);
    logger.success(`Merkle root ${epoch} submitted`);
  });
}

// src/index.ts
import { PrismaClient as PrismaClient2 } from "@prisma/client";
var program = new Command();
var prisma2 = new PrismaClient2();
BigInt.prototype.toJSON = function() {
  return this.toString();
};
program.name("settler").description("CLI application built with Commander.js").version("0.0.1").action(async () => {
  initStorage();
  startAPIServer();
  startWorkloadModule(prisma2);
  await startRewardModule();
});
registerSubmitCommand(program);
program.parse();
