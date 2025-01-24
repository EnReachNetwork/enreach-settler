import path from "node:path";

export const PATHS = {
  DATA_DIR: path.join(process.cwd(), "data"),
  EPOCH_DIR: path.join(process.cwd(), "data/epoch"),
  EPOCH_INDEX: path.join(process.cwd(), "data/epoch.index"),
  LATEST_MERKLE_TREE: path.join(process.cwd(), "data/latest_merkle_tree.json"),
};
