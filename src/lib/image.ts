const sharp = require("sharp");
const path = require("path");

async function createThumbnail(inputPath: string, outputPath: string) {
    const thumbPath = path.parse(outputPath);
    thumbPath.base = `thumb_${thumbPath.base}`;

    return sharp(inputPath)
    .resize({
        width: 200,
        height: 200,
        fit: "cover",
    })
    .toFile(path.format(thumbPath));
}

export {
    createThumbnail
};
