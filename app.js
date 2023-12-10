const express = require("express");
const multer = require("multer");
const app = express();
const port = process.env.PORT || 5432;

const prefixApi = "/Dmitry-Tretyak-ISIP-2-21-api";
const routers = require("./routes/index");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH DELETE');
  res.setHeader('Access-Control-Allow-Header', 'Content-Type');
  next(); 
});

app.use(upload);

app.use(prefixApi, routers);

app.use("/", (req, res) => {
  res.status(404).json({ error: "404. Страница не существует", code: 404 });
});

app.listen(port, () => {
  console.log("Сервер запущен на порту ${port}");
});

module.exports = app