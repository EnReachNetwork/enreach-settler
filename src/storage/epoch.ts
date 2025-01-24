import path from "node:path";
import * as fs from "fs";
import { PATHS } from "../constants/path.js";

export const storeEpochIndex = (epoch: number) => {
  fs.writeFileSync(PATHS.EPOCH_INDEX, epoch.toString());
};

export const queryEpochIndex = () => {
  return parseInt(fs.readFileSync(PATHS.EPOCH_INDEX, "utf-8"));
};

export const storeEpochWorkload = (epoch: string, content: string) => {
  const filePath = path.join(PATHS.EPOCH_DIR, `${epoch}.json`);
  fs.writeFileSync(filePath, content);
};

export const queryEpochWorkload = (
  epoch: string,
): { account: string; id: string; amount: bigint }[] => {
  const filePath = path.join(PATHS.EPOCH_DIR, `${epoch}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const res = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
    account: string;
    id: string;
    amount: string;
  }[];
  return res.map(({ account, id, amount }) => ({
    account,
    id,
    amount: BigInt(amount),
  }));
};
