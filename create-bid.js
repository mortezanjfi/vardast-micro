const fs = require("fs");

const readAllFile = () => {
  const dirMain = "./apps";
  const readDirectoryMain = fs.readdirSync(dirMain);

  readDirectoryMain.forEach((dirNext) => {
    if (
      fs.lstatSync(dirMain + "/" + dirNext).isDirectory() &&
      dirNext.startsWith("vardast-")
    ) {
      const projects = dirNext.replace("vardast-", "");
      const alters = {
        admin: "(admin)",
        client: "(client)/profile/(layout)",
        seller: "(seller)",
      };
      const subDir = alters[projects];
      if (subDir) {
        fs.cpSync(
          "./apps/bid/src/app/(layout)/(bid)",
          `${dirMain}/${dirNext}/src/app/${subDir}/(bid)`,
          { recursive: true }
        );
      }
      console.log({
        projects,
        subDir,
        bib: `${dirMain}/${dirNext}/src/app/${subDir}/(bid)`,
      });
    }
  });
};

readAllFile();
