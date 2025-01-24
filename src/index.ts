#!/usr/bin/env node
import { Command } from "commander";
import { registerHelloCommand } from "./commands/hello.js";
import { startAPIServer } from "./api/index.js";
import { getWorkload } from "./actions/workload.js";
import { queryEpochWorkload, storeEpochWorkload } from "./storage/epoch.js";
import { logger } from "./utils/logger.js";
import { parseUnits } from "viem";
import { initStorage } from "./storage/init.js";
import { startRewardModule } from "./modules/reward.js";

const program = new Command();

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

let id = 0;

async function handleWorkload() {
  const res = await getWorkload(id);
  if (!res) return;

  id++;

  let epochWorkload = queryEpochWorkload(res.epoch);
  if (epochWorkload.length > 0) {
    const idx = epochWorkload.findIndex((item) => item.id === res.minerId);
    if (idx > -1) {
      epochWorkload = epochWorkload.map((item) =>
        res.account === item.account
          ? { ...item, value: item.amount + parseUnits(res.score, 12) }
          : item,
      );
    } else {
      epochWorkload.push({
        id: res.minerId,
        account: res.account,
        amount: parseUnits(res.score, 12),
      });
    }
  } else {
    const previousEpochWorkload = queryEpochWorkload(
      (Number(res.epoch) - 1).toString(),
    );
    const idx = previousEpochWorkload.findIndex(
      (item) => item.account === res.account,
    );
    if (idx > -1) {
      epochWorkload = previousEpochWorkload.map((item) =>
        res.account === item.account
          ? { ...item, amount: item.amount + parseUnits(res.score, 12) }
          : item,
      );
    } else {
      previousEpochWorkload.push({
        id: res.minerId,
        account: res.account,
        amount: parseUnits(res.score, 12),
      });
      epochWorkload = [...previousEpochWorkload];
    }
  }
  logger.info("Epoch: " + res.epoch + " Score: " + res.score);
  storeEpochWorkload(res.epoch, JSON.stringify(epochWorkload));
}

program
  .name("settler")
  .description("CLI application built with Commander.js")
  .version("0.0.1")
  .action(async () => {
    initStorage();
    setInterval(handleWorkload, 300);
    startAPIServer();

    await handleWorkload();

    await startRewardModule();
  });

registerHelloCommand(program);

program.parse();
