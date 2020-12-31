import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";

export async function runCommand(
  command: string,
  logStreamPath: string
): Promise<void> {
  return new Promise(async (resolve) => {
    const dirLocation = path.dirname(logStreamPath);
    mkdirp.sync(dirLocation);

    const process = spawn("bash", ["-c", command]);
    process.stdout.on("data", (data) => {
      fs.appendFile(logStreamPath, data, () => {});
    });
    process.stderr.on("data", (data) => {
      fs.appendFile(logStreamPath, data, () => {});
    });

    resolve();
  });
}
