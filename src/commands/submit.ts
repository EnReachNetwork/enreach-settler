import { Command } from "commander";
import { queryEpochWorkload } from "../storage/epoch.js";
import { OldFormat, parseBalanceMap } from "../utils/parse-balance-map.js";
import { submitMerkleRoot } from "../modules/chainface.js";
import { logger } from "../utils/logger.js";

export function registerSubmitCommand(program: Command) {
  program
    .command("submit")
    .description("Register miner to enreach chain")
    .option("-n, --epoch <epoch>", "epoch to submit")
    .action(async (options) => {
      const epoch = options.epoch || "0";
      const workload = queryEpochWorkload(epoch);
      if (workload.length === 0) {
        return;
      }
      const oldFormat: OldFormat = Object.fromEntries(
        workload.map((item) => [
          item.account,
          BigInt(item.amount).toString(16),
        ]),
      );
      const tree = parseBalanceMap(oldFormat);
      console.log(oldFormat);
      console.log(tree.merkleRoot, tree.claims, tree.tokenTotal);
      await submitMerkleRoot(epoch, tree.merkleRoot);
      logger.success(`Merkle root ${epoch} submitted`);
    });
}
