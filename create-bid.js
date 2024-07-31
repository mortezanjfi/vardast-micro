const fs = require("fs");

const readAllFile = () => {
  const dirMain = "./apps";
  const readDirectoryMain = fs.readdirSync(dirMain);

  readDirectoryMain.forEach((dirNext) => {
    if (
      fs.lstatSync(dirMain + "/" + dirNext).isDirectory() &&
      dirNext.startsWith("vardast-admin")
    ) {
      fs.cpSync(
        "./apps/bid/src/app/(layout)/(bid)",
        dirMain + "/" + dirNext + "/src/app/(admin)/(bid)",
        { recursive: true }
      );
    }
  });
};

readAllFile();
