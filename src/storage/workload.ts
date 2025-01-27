import {
  queryEpochWorkload,
  queryNearestEpochWorkload,
  queryWorkloadId,
  storeEpochWorkload,
  storeWorkloadId,
} from "./epoch.js";
import { logger } from "../utils/logger.js";
import { getWorkload } from "../actions/workload.js";
import { parseUnits } from "viem";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../db.js";
import { sleep } from "../utils/utils.js";

export async function getNextEpoch(currentEpoch: number) {
  const nextScore = await prisma.score.findFirst({
    where: {
      epoch: {
        gt: Number(currentEpoch),
      },
    },
    orderBy: {
      epoch: "asc",
    },
  });
  return nextScore ? nextScore.epoch : null;
}

export const startWorkloadModule = async () => {
  while (true) {
    await handleWorkload();
    await sleep(500);
  }
};

async function handleWorkload() {
  const id = (await queryWorkloadId()) + 1;
  logger.info("Handling workload: " + id);
  const res = await getWorkload(id);
  if (!res) return;

  const epoch = parseInt(res.epoch);
  let epochWorkload = await queryEpochWorkload(epoch);
  if (epochWorkload.length > 0) {
    logger.info(`Found existing epoch: ${res.epoch}, workload: ${id}`);
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
    logger.info(`Not Found existing epoch: ${res.epoch}, workload: ${id}`);
    const nearestEpochWorkload = await queryNearestEpochWorkload(epoch);
    const idx = nearestEpochWorkload.findIndex(
      (item) => item.account === res.account,
    );
    if (idx > -1) {
      epochWorkload = nearestEpochWorkload.map((item) =>
        res.account === item.account
          ? { ...item, amount: item.amount + parseUnits(res.score, 12) }
          : item,
      );
    } else {
      nearestEpochWorkload.push({
        id: res.minerId,
        account: res.account,
        amount: parseUnits(res.score, 12),
      });
      epochWorkload = [...nearestEpochWorkload];
    }
  }
  logger.info("Epoch: " + res.epoch + " Score: " + res.score);
  storeEpochWorkload(epoch, epochWorkload);
  storeWorkloadId(id);
}
