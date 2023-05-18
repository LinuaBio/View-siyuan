// import { createThumbnail } from "./image";

const { exec } = require("child_process");
const fs = require("fs");
const { pipeline } = require("stream");
const path = require("path");
const { createTables, openDatabase, closeDatabase, writeToDatabase } = require("./db");

interface FileInfo {
    name: string;
    dir: string;
    ext: string;
    size: number;
  }
  
  interface FileGroups {
    [key: string]: string[];
  }
  
export function openPdfInWPS(pdfPath: string): void {
    const wpsCommand = "D:/WPS Office/11.1.0.14309/office6/wps.exe";

    const command = `"${wpsCommand}" "${pdfPath}"`;
    try {
        exec(command);
    } catch (e) {
        console.error(`Error when opening file: ${e.message}`);
    }
}

// const start = process.hrtime();

// // 程序代码

// const end = process.hrtime(start);

// // 将耗时转换为毫秒并输出
// console.log(`程序执行时间为 ${end[0] * 1000 + end[1] / 1000000} 毫秒`);

export class File {

    private fileGroups: FileGroups = {
        "images": ["jpg", "jpeg", "png", "gif", "bmp", "svg"],
        "documents": ["doc", "docx", "pdf", "txt", "md"],
        "videos": ["mp4", "avi", "mov", "flv", "wmv", "mkv", "webm"],
        "audio": ["mp3", "wav", "ogg", "flac", "aac"]
    };

    async readFiles(dirPath: string): Promise<void> {
        const promises = [];
        for await (const filePath of this.getFilePaths(dirPath)) {
            const promise = new Promise<void>((resolve, reject) => {
                const fileStream = fs.createReadStream(filePath, { highWaterMark: 64 * 1024 });
                fileStream.on("data", (dataChunk: any) => {
                    // 处理每一块数据的逻辑
                    console.log(dataChunk);
                });
                fileStream.on("end", () => {
                    // 处理文件读取完成后的逻辑
                    resolve();
                });
                fileStream.on("error", (err: Error) => {
                    console.error(`读取文件 ${filePath} 时出现错误:`, err);
                    reject(err);
                });
            });
            promises.push(promise);
        }

        await Promise.all(promises);
    }

    async groupFilesByType(dirPath: string): Promise<Record<string, FileInfo[]>> {
        const filesByType: Record<string, FileInfo[]> = {};
        const filePaths: string[] = [];

        for await (const filePath of this.getFilePaths(dirPath)) {
            filePaths.push(filePath);
        }

        let i = 0;
        const batchSize = 100;
        while (i < filePaths.length) {
            const batch = filePaths.slice(i, i + batchSize);
            const promises = batch.map((filePath) => {
                return this.getFileInfo(filePath).then((fileInfo) => {
                    const fileGroupName = this.getFileGroupName(fileInfo.ext);
                    if (fileGroupName) {
                        if (!filesByType[fileGroupName]) {
                            filesByType[fileGroupName] = [];
                        }
                        filesByType[fileGroupName].push(fileInfo);
                    }
                }).catch((err: Error) => {
                    console.error(`获取文件 ${filePath} 信息时出现错误:`, err);
                });
            });
            await Promise.all(promises);
            i += batchSize;
        }
        return filesByType;
    }

    private async copyFile(srcPath: string, dstPath: string) {
        // Create streams
        const source = fs.createReadStream(srcPath);
        const destination = fs.createWriteStream(dstPath);

        // Pipeline the streams
        return pipeline(source, destination, (err: any) => {
            if (err) {
                console.error(`拷贝文件 ${srcPath} 时发生错误：${err}`);
            }
        });
    }

    /**
    * 
    * @param dirPath It's your path of the file what should sort, and the path sort to
    * @param N max sort count
    */
    async groupFilesByTypeWithFolderLimit(dirPath: string, N: number, dbPath: string) {
        // Group files by type
        const filesByType = await this.groupFilesByType(dirPath);
        const counters: any = {};

        // Open database connection
        const db = await openDatabase(dbPath);

        // Create tables for different file types
        createTables(db, this.fileGroups);

        for (const [fileType, fileList] of Object.entries(filesByType)) {
            const fileTypeFolder = path.join(dirPath, fileType);
            const folderCount = Math.ceil(fileList.length / N);
            const folders = await this.createFileFolders(fileTypeFolder, folderCount);

            counters[fileType] = {
                folderIndex: 0,
                fileCount: 0,
                folderFileCounts: Array(folderCount).fill(0),
            };

            const copyTasks = [];
            // const createThumbTasks = [];

            // Process files using streams
            for await (const fileInfo of fileList) {
                const filePath = path.join(fileInfo.dir, fileInfo.name);
                const counter = counters[fileType];
                const folderIndex = counter.folderIndex;
                const folder = folders[folderIndex];

                if (counter.fileCount === N) {
                    if (folderIndex < folderCount - 1) {
                        counter.folderIndex++;
                    } else {
                        counter.folderIndex = 0;
                    }

                    counter.fileCount = 0;
                }

                const folderFileCounts = counter.folderFileCounts;
                folderFileCounts[folderIndex]++;

                const fileIndex = folderFileCounts[folderIndex] - 1;
                const numberedFileName = `${fileIndex.toString().padStart(3, "0")}_${fileInfo.name}`;
                const numberedFilePath = path.join(folder, numberedFileName);

                // Queue copy task
                copyTasks.push(this.copyFile(filePath, numberedFilePath));
                // if (fileType === "images"){
                //     const thumbFilePath = path.join(dirPath, "thumbs", fileInfo.name);
                //     copyTasks.push(this.copyFile(filePath, thumbFilePath));
                // }
                counter.fileCount++;

                // Insert file information into database
                writeToDatabase(db, fileType, fileInfo, numberedFilePath);

                if (copyTasks.length > 1000) {
                    // Wait for some copy tasks to complete
                    await Promise.all(copyTasks.splice(0, 1000));
                }

                // if (fileType === "images") { // Only for image files
                //     const thumbFilePath = path.join(dirPath, "thumbs", fileInfo.name);
                //     createThumbTasks.push(createThumbnail(filePath, thumbFilePath)); // Queue create task
        
                //     if (createThumbTasks.length > 1000) {
                //         // Wait for some create tasks to complete
                //         await Promise.all(createThumbTasks.splice(0, 1000));
                //     }
                // }
            }
            // Wait for remaining copy tasks to complete
            await Promise.all(copyTasks);
            // if (fileType === "images") { // Only for image files
            //     // Wait for remaining create tasks to complete
            //     await Promise.all(createThumbTasks);
            // }
            copyTasks.splice(0, copyTasks.length);
            // createThumbTasks.splice(0, createThumbTasks.length);
        }
        // Close database connection
        await closeDatabase(db);
    }

    private async createFileFolders(fileTypeFolder: string, folderCount: number): Promise<string[]> {
        const folders: string[] = [];

        if (!fs.existsSync(fileTypeFolder)) {
            fs.mkdirSync(fileTypeFolder);
        }

        for (let i = 0; i < folderCount; i++) {
            const folderName = `folder${i}`;
            const folderPath = path.join(fileTypeFolder, folderName);

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            folders.push(folderPath);
        }

        return folders;
    }

    private async * getFilePaths(dirPath: string, notIgnoreDirectory = false): AsyncGenerator<string> {
        const dir = await fs.promises.readdir(dirPath, { withFileTypes: true });
        for (const dirent of dir) {
            const fullPath = path.join(dirPath, dirent.name);
            if (notIgnoreDirectory && dirent.isDirectory()) {
                yield* this.getFilePaths(fullPath, true);
            } else {
                yield fullPath;
            }
        }
    }

    private fileInfoCache: Record<string, FileInfo> = {};

    private async getFileInfo(filePath: string): Promise<FileInfo> {
        if (this.fileInfoCache[filePath]) {
            return this.fileInfoCache[filePath];
        } else {
            const stats = await fs.promises.stat(filePath);
            const name = path.basename(filePath);
            const dir = path.dirname(filePath);
            const ext = path.extname(filePath).slice(1);
            const size = stats.size;
            const fileInfo: FileInfo = { name, dir, ext, size };
            this.fileInfoCache[filePath] = fileInfo;
            return fileInfo;
        }
    }

    private getFileGroupName(ext: string): string | null {
        for (const groupName in this.fileGroups) {
            if (this.fileGroups[groupName].includes(ext.toLowerCase())) {
                return groupName;
            }
        }
        return null;
    }
}

const myFileReader = new File();
const dirPath = "E:/SiyuanSpace/data/assets"; // 文件夹路径
const dbPath = "./assets.db";
const N = 1000; // 每个文件夹最多放置 N 个文件 
// const db = openDatabase(dbPath);
// createTables(db);
// Create tables for different file types
// closeDatabase(db);

// const fileGroups: FileGroups = {
//     "images": ["jpg", "jpeg", "png", "gif", "bmp", "svg"],
//     "documents": ["doc", "docx", "pdf", "txt", "md"],
//     "videos": ["mp4", "avi", "mov", "flv", "wmv", "mkv", "webm"],
//     "audio": ["mp3", "wav", "ogg", "flac", "aac"]
// };
// async function test(dbPath: string) {
//     // Open database connection
//     const db = await openDatabase(dbPath);

//     // Create tables for different file types
//     createTables(db, fileGroups);

//     await closeDatabase(db);
// }
// test(dbPath);
myFileReader.groupFilesByTypeWithFolderLimit(dirPath, N, dbPath);
// myFileReader.groupFilesByType(dirPath).then((res) => {
//     console.log(res.images.length);
// });