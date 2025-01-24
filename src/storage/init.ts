import * as fs from "fs";
import { PATHS } from "../constants/path.js";

export const initStorage = () => {
  if (!fs.existsSync(PATHS.DATA_DIR)) fs.mkdirSync(PATHS.DATA_DIR);
  if (!fs.existsSync(PATHS.EPOCH_DIR)) fs.mkdirSync(PATHS.EPOCH_DIR);
  if (!fs.existsSync(PATHS.EPOCH_INDEX))
    fs.writeFileSync(PATHS.EPOCH_INDEX, "0");
};
