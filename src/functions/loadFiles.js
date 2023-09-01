const { glob } = require("glob");
const path = require("path");

async function deleteCachedFile(file) {
    const filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

async function loadFiles(dirName) {
    console.log("Reached loadFiles function")
    try {
        const files = await glob(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`);
        const jsFiles = files.filter(file => path.extname(file) === ".js"); // safety measure
        await Promise.all(jsFiles.map(deleteCachedFile));
        return jsFiles;
    } catch (error) {
        console.error(`Error loading files from directory ${dirName}: ${error}`);
        throw error;
    }
}

module.exports = { loadFiles };
