// const { execSync } = window.require("child_process");

// export function openPdfInWPS(pdfPath: string): void {
//   const wpsCommand = "D:/WPS Office/11.1.0.14309/office6/wps.exe";

//   const command = `"${wpsCommand}" "${pdfPath}"`;
//   try {
//     execSync(command);
//   } catch (e) {
//     console.error(`Error when opening file: ${e.message}`);
//   }
// }


const { ipcMain } = window.require("electron");

ipcMain.on("open-pdf", (event: { reply: (arg0: string, arg1: { success: boolean; }) => void; }, pdfPath: any) => {
  const wpsCommand = "D:/WPS Office/11.1.0.14309/office6/wps.exe";

  const command = `"${wpsCommand}" "${pdfPath}"`;

  const { spawn } = window.require("child_process");
  const child = spawn(command, [], { detached: true, shell: true, stdio: "ignore" });

  // 将结果返回给渲染进程
  child.unref();
  event.reply("open-pdf-reply", { success: true });
});
const { ipcRenderer } = window.require("electron");

export function openPdfInWPS(pdfPath: string): void {
  ipcRenderer.send("open-pdf", pdfPath);

  // 监听主进程返回的结果
  ipcRenderer.once("open-pdf-reply", (_event: any, data: { success: any; }) => {
    if (data.success) {
      console.log("打开成功");
    } else {
      console.error("打开失败");
    }
  });
}