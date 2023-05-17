const fs = window.require("fs");
const path = window.require("path");
import { performance } from "perf_hooks";

export async function readFiles(dirPath: string): Promise<void> {
  const t0 = performance.now();
  
  // 遍历目录下所有文件
  for await (const filePath of getFilePaths(dirPath)) {
    const fileStream = fs.createReadStream(filePath, { highWaterMark: 64 * 1024 }); // 定义读取数据块大小
    fileStream.on("data", (dataChunk: any) => {
      // 处理每一块数据的逻辑
      console.log(dataChunk);
    });
    fileStream.on("end", () => {
      // 处理文件读取完成后的逻辑
    });
    fileStream.on("error", (err: Error) => {
      console.error(`读取文件 ${filePath} 时出现错误:`, err);
    });
  }
  
  const t1 = performance.now();
  console.log(`读取文件共花费了 ${Math.floor(t1 - t0)} 毫秒`);
}

async function* getFilePaths(dirPath: string): AsyncGenerator<string> {
  const dir = await fs.promises.readdir(dirPath, { withFileTypes: true });
  for (const dirent of dir) {
    const fullPath = path.join(dirPath, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFilePaths(fullPath);
    } else {
      yield fullPath;
    }
  }
}