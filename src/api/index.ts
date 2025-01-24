import express from "express";

import { logger } from "../utils/logger.js";
import { getClaimProof } from "./claim.js";

export const defaultPort = 8546;

export const startAPIServer = (port: number = defaultPort) => {
  const app = express();
  app.use(express.json());

  app.get("/claim/:address", getClaimProof);

  app.listen(port, () => {
    logger.info(`API server listening on port ${port}`);
  });
};
