const fs = require('fs-extra');
const path = require('path');

// 源文件夹
const sourceDir = path.join(__dirname, 'dist');

// 目标文件夹（上一层目录）
const targetDir = path.join(__dirname, '..');

fs.copy(sourceDir, targetDir, { overwrite: true }, function (err) {
    if (err){
        console.error(err);
    } else {
        console.log("Success!");
    }
});
