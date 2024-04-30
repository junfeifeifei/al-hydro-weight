import fs from 'fs';
import path from 'path';

const FilePath = async () => {
  const directoryPath = path.join(process.cwd(), '../xrd');

  // 使用 fs.promises API 读取目录
  const files = await fs.promises.readdir(directoryPath);
  let latestFolder = null;
  let latestDate = new Date(0); // 初始设为很早的日期

  for (let file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = await fs.promises.stat(filePath);

    if (stats.isDirectory()) {
      const matches = file.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})_alishatanzhi/);
      if (matches) {
        const datePart = matches[1].substring(0, 10); // 'YYYY-MM-DD'
        const timePart = matches[1].substring(11).replace(/-/g, ':'); // 'HH:MM:SS'
        const standardDateTime = datePart + ' ' + timePart; // 'YYYY-MM-DD HH:MM:SS'
        const folderDate = new Date(standardDateTime);
        if (folderDate < new Date() && folderDate > latestDate) {
          latestDate = folderDate;
          latestFolder = file;
        }
      }
    }
  }

  // 读取文件内容
  if (latestFolder) {
    return latestFolder;
  } else {
    throw new Error('No latest folder found.');
  }
};

export default FilePath;