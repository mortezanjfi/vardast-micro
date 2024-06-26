const fs = require("fs");

const readAllFile = () => {
  const dirMain = "./apps";
  const readDirectoryMain = fs.readdirSync(dirMain);

  readDirectoryMain.forEach((dirNext) => {
    if (
      fs.lstatSync(dirMain + "/" + dirNext).isDirectory() &&
      dirNext.startsWith("vardast")
    ) {
      fs.cpSync(
        "./apps/authentication/src/app/(authentication)",
        dirMain + "/" + dirNext + "/src/app/(authentication)",
        { recursive: true }
      );
    }
  });
};

readAllFile();
