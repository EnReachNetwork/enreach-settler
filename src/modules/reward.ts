import { queryEpochWorkload } from "../storage/epoch.js";
import { readdir } from "node:fs/promises";
import { PATHS } from "../constants/path.js";
import { getOnlineEpoch, submitMerkleRoot } from "./chainface.js";
import { logger } from "../utils/logger.js";
import BalanceTree from "../utils/balance-tree.js";
import { sleep } from "../utils/utils.js";
import { OldFormat, parseBalanceMap } from "../utils/parse-balance-map.js";
import { getNextEpoch } from "../storage/workload.js";
import { prisma } from "../db.js";

export const startRewardModule = async () => {
  let epoch = (await getOnlineEpoch()) as number;

  while (true) {
    try {
      const nextEpoch = await getNextEpoch(epoch);
      if (!nextEpoch) {
        await sleep(2000);
        continue;
      }

      epoch = nextEpoch;

      logger.info(`Submit epoch #${epoch} merkle root`);
      const workload = await queryEpochWorkload(epoch);
      console.log(workload);
      if (workload.length === 0) {
        await sleep(2000);
        continue;
      }
      const oldFormat: OldFormat = Object.fromEntries(
        workload.map((item) => [
          item.account,
          BigInt(item.amount).toString(16),
        ]),
      );
      const tree = parseBalanceMap(oldFormat);
      await submitMerkleRoot(epoch, tree.merkleRoot);
      logger.success(`Merkle root ${epoch} submitted`);
      epoch++;
    } catch (e) {
      logger.error(JSON.stringify(e));
    }

    await sleep(2000);
  }
};
