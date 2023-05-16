const { exec } = window.require("child_process");

export function openPdfInWPS(pdfPath: string): void {
  const wpsCommand = "D:/WPS Office/11.1.0.14309/office6/wps.exe";

  const command = `"${wpsCommand}" "${pdfPath}"`;
  try {
    exec(command);
  } catch (e) {
    console.error(`Error when opening file: ${e.message}`);
  }
}