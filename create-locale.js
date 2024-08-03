const fs = require("fs");

const readAllFile = () => {
  const dirMain = "./apps";
  const readDirectoryMain = fs.readdirSync(dirMain);

  readDirectoryMain.forEach((dirNext) => {
    if (fs.lstatSync(dirMain + "/" + dirNext).isDirectory() && dirNext) {
      fs.cpSync("./configs/locales", dirMain + "/" + dirNext + "/locales", {
        recursive: true,
      });
    }
  });
  console.log("create-locales");
};

readAllFile();
