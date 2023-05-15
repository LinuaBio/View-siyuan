const { execSync } = require("child_process");

export function openPdfInWPS(pdfPath: string): void {
  const wpsCommand = "D:/WPS Office/ksolaunch.exe";

  const command = `${wpsCommand} ${pdfPath}`;
  console.log("openPdfInWPS");
  try {
    execSync(command);
    console.log("Open WPS");
  } catch (e) {
    console.error(`Error when opening file: ${e.message}`);
  }
}