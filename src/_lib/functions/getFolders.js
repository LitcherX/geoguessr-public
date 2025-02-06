export default async function getFolders(fs, path) {
    const dirPath = path.join(process.cwd(), "public", "guess");
    const entries = fs.readdirSync(dirPath);
    let folders = entries.filter((entry) =>
        fs.statSync(path.join(dirPath, entry)).isDirectory()
    );
    folders = folders.filter((item) => item !== "0");
    return folders;
}
