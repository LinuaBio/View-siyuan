const { exec } = window.require("child_process");
const fs = window.require("fs");
const path = window.require("path");

export function openPdfInWPS(pdfPath: string): void {
    const wpsCommand = "D:/WPS Office/11.1.0.14309/office6/wps.exe";

    const command = `"${wpsCommand}" "${pdfPath}"`;
    try {
        exec(command);
    } catch (e) {
        console.error(`Error when opening file: ${e.message}`);
    }
}



interface FileInfo {
    name: string;
    dir: string;
    ext: string;
    size: number;
}

interface FileGroups {
    [key: string]: string[];
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

    // async groupFilesByType(dirPath: string): Promise<Record<string, FileInfo[]>> {
    //     const filesByType: Record<string, FileInfo[]> = {};
    //     const filePaths: string[] = [];

    //     for await (const filePath of this.getFilePaths(dirPath)) {
    //         filePaths.push(filePath);
    //     }

    //     let i = 0;
    //     const batchSize = 100;
    //     while (i < filePaths.length) {
    //         const batch = filePaths.slice(i, i + batchSize);
    //         const promises = batch.map((filePath) => {
    //             return this.getFileInfo(filePath).then((fileInfo) => {
    //                 const fileGroupName = this.getFileGroupName(fileInfo.ext);
    //                 if (fileGroupName) {
    //                     if (!filesByType[fileGroupName]) {
    //                         filesByType[fileGroupName] = [];
    //                     }
    //                     filesByType[fileGroupName].push(fileInfo);
    //                 }
    //             }).catch((err: Error) => {
    //                 console.error(`获取文件 ${filePath} 信息时出现错误:`, err);
    //             });
    //         });
    //         await Promise.all(promises);
    //         i += batchSize;
    //     }
    //     return filesByType;
    // }
    async groupFilesByType(dirPath: string): Promise<Record<string, FileInfo[]>> {
        const filesByType: Record<string, FileInfo[]> = {};

        for await (const filePath of this.getFilePaths(dirPath)) {
            try {
                const fileInfo = await this.getFileInfo(filePath);
                const fileGroupName = this.getFileGroupName(fileInfo.ext);
                if (fileGroupName) {
                    if (!filesByType[fileGroupName]) {
                        filesByType[fileGroupName] = [];
                    }
                    filesByType[fileGroupName].push(fileInfo);
                }
            } catch (err) {
                console.error(`获取文件 ${filePath} 信息时出现错误:`, err);
            }
        }

        return filesByType;
    }

    private async* getFilePaths(dirPath: string): AsyncGenerator<string> {
        const dir = await fs.promises.readdir(dirPath, { withFileTypes: true });
        for (const dirent of dir) {
            const fullPath = path.join(dirPath, dirent.name);
            if (dirent.isDirectory()) {
                yield* this.getFilePaths(fullPath);
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