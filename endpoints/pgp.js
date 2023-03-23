require("dotenv").config();
const router = require("express").Router();
const os = require("os");
const fs = require("fs-extra");
const path = require("path");
const pgp = require('openpgp');
const multer = require("multer");
const upload = multer({ dest: os.tmpdir() });

router.post("/genRSAKeypair", async function (req, res, next) {
  
  const keypair = { privateKey, publicKey } = await pgp.generateKey({
    type: 'rsa', // Type of the key
    rsaBits: 4096, // RSA key size (defaults to 4096 bits)
    userIDs: [{ name: req.name, email: req.email }], // you can pass multiple user IDs
    passphrase: req.passphrase // protects the private key
  });
  console.log(privateKey);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
  console.log(publicKey);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
  res.json(keypair);
  next();
});

router.post("/encrypt", upload.single("file"),async function (req, res, next) {
  const filename = req.query.file;
  const encryptedName = filename + '.pgp';
  const file = req.file;
  
  const publicKey = await pgp.readKey({ armoredKey: req.body.recipientKey });
  const fileContent = fs.readFileSync(file.path);
  const options = {
    message: await pgp.createMessage( {binary: fileContent}),
    encryptionKeys: publicKey
  };
  const encrypted = await pgp.encrypt(options);
  const encFile = path.join(os.tmpdir(),encryptedName);
  console.log(encFile);
  writeFileSync(encFile,encrypted);

  //res.send(Buffer.from(encrypted));
  res.status(200).sendFile(encFile,{},function (err){
    if (err) {
      next(err)
    } else {
      
      next();
    }
  });
});

router.post("/decrypt", upload.single("file"),async function (req, res, next) {
  const filename = req.query.file;
  const dlen = filename.length - 4;
  const ext = filename.substring(dlen);
  const decryptedName = ext === '.pgp' ? filename.substring(0,dlen) : filename;
  const file = req.file;
  console.log(decryptedName);
  const privateKey = await pgp.readPrivateKey({ armoredKey: process.env.PGP_PRIVATE_KEY });
  //console.log(fs.readFileSync(file.path).toString());
  const fileContent = fs.readFileSync(file.path).toString();

  //const message = pgp.createMessage({binary:fileContent});
  const options = {
    message: await pgp.readMessage( {armoredMessage: fileContent}),
    decryptionKeys: privateKey
  }

  const decrypted = await pgp.decrypt(options);
  const decFile = path.join(os.tmpdir(),decryptedName);
  const chunks = [];
  for await (const chunk of decrypted.data) {
      chunks.push(chunk);
  }
  const decryptedText = chunks.join('');
  writeFileSync(decFile,decryptedText);
  res.status(200).sendFile(decFile,{},function (err){
    if (err) {
      next(err)
    } else {
      
      next();
    }
  });
});

module.exports = router;


var writeFileSync = function (path, buffer, permission) {
  permission = permission || 438; // 0666
  var fileDescriptor;

  try {
      fileDescriptor = fs.openSync(path, 'w', permission);
  } catch (e) {
      fs.chmodSync(path, permission);
      fileDescriptor = fs.openSync(path, 'w', permission);
  }

  if (fileDescriptor) {
      fs.writeSync(fileDescriptor, buffer, 0, buffer.length, 0);
      fs.closeSync(fileDescriptor);
  }
}