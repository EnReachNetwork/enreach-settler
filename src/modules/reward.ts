import { queryEpochIndex, queryEpochWorkload } from "../storage/epoch.js";
import { readdir } from "node:fs/promises";
import { PATHS } from "../constants/path.js";
import { getOnlineEpoch, submitMerkleRoot } from "./chainface.js";
import { logger } from "../utils/logger.js";
import BalanceTree from "../utils/balance-tree.js";
import { sleep } from "../utils/utils.js";

const generateMerkleTree = async () => {
  const files = await readdir(PATHS.EPOCH_DIR);
  let epoch = files[0] ? BigInt(files[0].split(".")[0]) : 0n;

  while (true) {
    const workload = queryEpochWorkload(epoch.toString());
  }
};

export const startRewardModule = async () => {
  let epoch = (await getOnlineEpoch()) as bigint;
  const files = await readdir(PATHS.EPOCH_DIR);
  const currentEpoch = files[0] ? BigInt(files[0].split(".")[0]) : 0n;

  logger.success(`Current epoch: ${currentEpoch}`);
  console.log(epoch);
  if (epoch === 0n) {
    epoch = currentEpoch;
  } else {
    epoch = epoch + 1n;
  }

  while (true) {
    try {
      logger.info(`Submit epoch #${epoch} merkle root`);
      const workload = queryEpochWorkload(epoch.toString());
      console.log(workload);
      if (workload.length === 0) {
        await sleep(2000);
        continue;
      }
      const tree = new BalanceTree(
        workload.map((item) => ({
          account: item.account,
          amount: item.amount,
        })),
      );
      await submitMerkleRoot(epoch, tree.getHexRoot());
      logger.success(`Merkle root ${epoch} submitted`);
      epoch++;
    } catch (e) {
      logger.error(JSON.stringify(e));
    }

    await sleep(2000);
  }
};
