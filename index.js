const fs = require("fs");
const qrcode = require("qrcode");
const PDFDocument = require("pdfkit");
const nodeHtmlToImage = require("node-html-to-image");
const http = require("http");
const urlCv = "https://pdfkit.org/docs/images.html";
const doc = new PDFDocument();

const convertQR = async () => {
  const QR = await qrcode.toDataURL(urlCv);
  const htmlContent = `
  <div style="display: flex; justify-content: center; align-items: center;">
  <img src="${QR}">
  </div>
  `;

  fs.writeFileSync("./pub/index.html", htmlContent);

  var valorHTML = htmlContent;

  convertPDF(valorHTML);
};

const convertPDF = async (valorHTML) => {
 await nodeHtmlToImage({
    output: "./pub/image.jpg",
    html: valorHTML,
  }).then(() => console.log("The image was created successfully!"));

  doc.pipe(fs.createWriteStream(__dirname + "/pub/example.pdf"));

  doc.image("pub/image.jpg", 0, 30, { width: 50 });

  doc.end();
};


const server = http.createServer(function (req, res) {
  let pdf = __dirname + "/pub/example.pdf";

  fs.access(pdf, fs.constants.F_OK, (error) => {
    console.log(`${pdf} ${error ? "existe" : "no existe"}`);
  });

  fs.readFile(pdf, function (error, data) {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plane" });
      return res.end("404 not found");
    }
    res.writeHead(200, { "Content-Type": "application/pdf" });
    res.write(data);
    return res.end();
  });
});

server.listen(8080, function () {
  console.log("Escuchando en el puerto 8080");
});

convertQR();

console.log("Archivo generado");
