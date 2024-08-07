// Import the fs module
const fs = require("fs");
// file is the file processed by multer
const imgFileHandler = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const fileName = `upload/${file.originalname}`;
    return fs.promises
      .readFile(file.path)
      .then((data) => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch((err) => reject(err));
  });
};
module.exports = {
  imgFileHandler,
};
