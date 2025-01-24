import { Command } from "commander";
import WebTorrent from "webtorrent";
import fs from "fs";

const client = new WebTorrent();
export function registerAddCommand(program: Command) {
  program
    .command("add")
    .description("Register miner to enreach chain")
    .option("-n, --name <name>", "name to say hello to")
    .action(async (options) => {
      console.log("Client add");
      client.add(
        "magnet:?xt=urn:btih:20749eb0b13a89c65d89867401471a76f6c9b8c4&dn=1735975761662-example.com&tr=ws%3A%2F%2Flocalhost%3A8888",
        (torrent) => {
          console.log("Client is downloading:", torrent.infoHash);

          torrent.on("done", () => {
            console.log("Download complete");
            console.log("File saved to:", torrent.path);
          });

          // Log download progress
          torrent.on("download", (bytes) => {
            console.log("Progress:", torrent.progress);
          });
        },
      );
    });
}
