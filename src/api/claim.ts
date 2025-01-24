import { Request, Response } from "express";
import fs from "fs";
import path from "node:path";
import { defaultPort } from "./index.js";
import {
  getRewardsDistributionRoot,
  getRewardsDistributionRootCount,
} from "../modules/chainface.js";
import { RewardsDistributionRoot } from "../types/chain.js";
import { queryEpochWorkload } from "../storage/epoch.js";
import BalanceTree from "../utils/balance-tree.js";
import { logger } from "../utils/logger.js";

export const getClaimProof = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const address = req.params.address;
    logger.info(`Fetching claim proof ${address}`);

    let index = await getRewardsDistributionRootCount();
    let root: RewardsDistributionRoot | undefined = undefined;
    let left = 0n;
    let right = index;
    let mid = 0n;
    while (left < right) {
      mid = (left + right) / 2n;
      root = await getRewardsDistributionRoot(mid);
      logger.info(`Checking root ${mid}, ${JSON.stringify(root)}`);
      if (Number(root.activatedAt) < Date.now() / 1000) {
        left = mid;
      } else {
        right = mid;
      }
    }

    logger.success(`Found root ${JSON.stringify(root)}`);

    if (root) {
      const workload = queryEpochWorkload(
        root.rewardsCalculationEndEpoch.toString(),
      );
      const content = workload.map((item) => ({
        account: item.account,
        amount: item.amount,
      }));
      const tree = new BalanceTree(content);
      logger.success("Balance tree created");
      const accountIndex = workload.findIndex(
        (item) => item.account === address,
      );
      const node = workload.find((item) => item.account === address);
      if (!node) {
        res.status(200).json({
          code: 10001,
          data: {},
        });
        return;
      }
      const proof = tree.getProof(accountIndex, address, node?.amount);
      console.log(
        node,
        accountIndex,
        proof,
        content,
        BalanceTree.toNode(accountIndex, address, node?.amount).toString("hex"),
      );
      console.log(
        BalanceTree.verifyProof(
          accountIndex,
          address,
          node?.amount,
          [],
          Buffer.from(tree.getHexRoot()),
        ),
      );
      res.status(200).json({
        code: 0,
        data: {
          rootIndex: mid,
          merkleRoot: root.merkleRoot,
          accountIndex,
          address,
          amount: node.amount,
          proof,
        },
      });
    } else {
      res.status(200).json({
        code: 10001,
        data: {},
      });
    }
  } catch (e: unknown) {
    console.error("Error fetching files:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
