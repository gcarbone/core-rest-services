const router = require("express").Router();
const os = require("os");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: os.tmpdir() });
/*
router.use((req,res,next) =>{
    console.log(req.baseUrl);
    next();
});
*/
router.get("/", async function (req, res, next) {
  const fn = req.query.file || req.body.file;
  console.log('***GGC filename=' + fn + ' resolved=' + path.resolve(fn));
  const del = req.query.delete === 'true';
  if (req.query.asBody != 'true') 
    res.setHeader('Content-Disposition', 'attachment; filename="' + path.basename(fn) + '"');
  res.status(200).sendFile(path.resolve(fn),{},function (err){
    if (err) {
      next(err)
    } else {
      if (del) fs.remove(path.resolve(fn));
      next();
    }
  });
});

router.post("/", upload.single("file"), function (req, res, next) {
  const filename = req.query.file;
  const file = req.file;
  fs.rename(file.path, path.resolve(filename), (err) => {
    if (err){
       res.status(500).json(err);
       next(err);
    }
    else {
      res.sendStatus(201);
      next();
    }
    
  });
  console.log(file);
});

router.get("/basepath", function (req, res, next) {
  res.json({ basepath: path.resolve("./") });
  next();
});

router.get("/tmpdir", function (req, res, next) {
  res.json({ tmpdir: os.tmpdir() });
  next();
});

router.get("/listdir", async function (req, res, next) {
  const dir = path.resolve(req.query.dir);
  const modifiedSince = req.query.modifiedSince
    ? new Date(req.query.modifiedSince)
    : null;
  const filesOnly = req.query.filesOnly === "true";
  var filelist = [];
  const files = await fs.readdir(dir);
  for await (const file of files) {
    const fullpath = dir + path.sep + file;
    const stat = await fs.stat(fullpath);

    const f = {
      type: stat.isFile() ? "file" : "dir",
      name: file,
      path: dir,
      size: stat.size,
      lastModifiedTime: new Date(stat.mtimeMs),
      createdTime: new Date(stat.birthtimeMs),
    };
    if (modifiedSince) {
      if (f.lastModifiedTime > modifiedSince && f.type === "file")
        filelist.push(f);
    } else {
      if (!filesOnly || (filesOnly && f.type === "file")) filelist.push(f);
    }
  }
  res.json(filelist);
  next();
});

module.exports = router;
