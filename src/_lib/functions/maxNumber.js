"use server"
const fs = require('node:fs');
const path = require('path');
const directoryPath = path.join('public', 'guess');
export default async function findHighestNumber() {
    try {
        const files = await new Promise((resolve, reject) => {
            fs.readdir(directoryPath, (err, files) => {
                if (err) reject(err);
                else resolve(files);
            });
        });
        const dirs = files.filter(file => fs.statSync(path.join(directoryPath, file)).isDirectory());
        const numbers = dirs.map(dir => parseInt(dir)).sort((a, b) => b - a);
        const highestNumber = numbers[0];
        console.log(highestNumber);
        return highestNumber;
    } catch (error) {
        console.error("An error occurred:", error);
        return 1;
    }
}