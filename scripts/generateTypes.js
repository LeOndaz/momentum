const fs = require("fs");
const path = require("path");

const assetsRoot = path.join("./assets");
const outputPath = "./src/typing/autoGenerated.ts";
const templateFileExtension = ".template";

fs.writeFileSync(outputPath, `// This file is auto-generated by generateTypes.js ${getCurrentReadableDate()}\n\n`);

function getCurrentReadableDate () {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
function isTemplate(fileOrPath) {
  return fileOrPath.endsWith(templateFileExtension);
}

function getTemplatePaths(root) {
  const filePaths = [];

  for (const fileOrDir of fs.readdirSync(root)) {
    const subPath = path.resolve(path.join(root, fileOrDir));

    const isFile = fs.lstatSync(subPath).isFile();
    const isDir = fs.lstatSync(subPath).isDirectory();

    if (!isFile && !isDir) {
      throw new Error(`Invalid file or directory: ${fileOrDir}`);
    }

    if (isFile && isTemplate(fileOrDir)) {
      filePaths.push(subPath);
    } else if (isDir) {
      filePaths.push(...getTemplatePaths(subPath));
    }
  }
  
  return filePaths;
}


function writeType(name, type) {
  fs.appendFileSync(outputPath, `export type ${name} = ${type};\n`);
}

function getTypeValues (paths) {
  return paths.map(p => p.split("/templates")).map(p => p[1]);
}

function surroundWithQuotes (value) {
  return `'${value}'`;
}

function stripSuffixTemplate (value) {
  return value.replace(".template", "");
}

function generate () {
  const templatePaths = getTemplatePaths(assetsRoot);
  const typeValues = getTypeValues(templatePaths).map(stripSuffixTemplate).map(surroundWithQuotes).join(' | ');
  
  writeType('TemplatePath', typeValues)
}

generate(assetsRoot);