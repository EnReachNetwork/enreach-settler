#!/usr/bin/env node
import { Command } from "commander";
import { registerSubmitCommand } from "./commands/submit.js";
import { startAPIServer } from "./api/index.js";
import { startWorkloadModule } from "./storage/workload.js";
import { startRewardModule } from "./modules/reward.js";

const program = new Command();

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

program
  .name("settler")
  .description("CLI application built with Commander.js")
  .version("0.0.1")
  .action(async () => {
    startAPIServer();
    startWorkloadModule();
    await startRewardModule();
  });

registerSubmitCommand(program);

program.parse();
