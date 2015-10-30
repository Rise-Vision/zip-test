var path = require("path"),
fs = require("fs"),
gunzip = require("gunzip-maybe"),
gzip = require("zlib").createGzip(),
tar = require("tar-fs"),
interval;

interval = setInterval(()=>{console.log("not blocked");}, 1200);

tarTheFolder()
.then(zipit)
.then(extractTheTarredZippedFile)
.then(()=>{clearInterval(interval);});

function tarTheFolder() {
  console.log("Tarring");
  return new Promise((res, rej)=>{
    tar.pack(path.join(__dirname, "chromium"))
    .pipe(outStreamFile("chromium.tar"))
    .on("close", res);
  });
}

function zipit() {
  console.log("Zipping");
  return new Promise((res, rej)=>{
    fs.createReadStream(path.join(__dirname, "chromium.tar"))
    .pipe(gzip)
    .pipe(outStreamFile("chromium.tar.gz"))
    .on("close", res);
  });
}

function extractTheTarredZippedFile() {
  console.log("Extracting");
  return new Promise((res, rej)=>{
    fs.createReadStream(path.join(__dirname, "chromium.tar.gz"))
    .pipe(gunzip())
    .pipe(tar.extract(path.join(__dirname, "chromium-extracted")))
    .on("finish", res);
  });
}

function outStreamFile(filename) {return fs.createWriteStream(path.join(__dirname, filename));}
