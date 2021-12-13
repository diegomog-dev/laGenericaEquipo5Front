const express = require('express');
const fileUpload = require('express-fileupload');
const path =require('path');
const http = require("http");
const fs = require("fs");
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const { isAuthenticated } = require('./helpers/auth');
const router = require('./routes/users');
var mongoose = require('mongoose');


const multer = require('multer');
const ProductoInfo = require('./models/Products');
let storage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, './tmp')
  },
  filename:(req,file,cb)=>{
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage
});

//Inicializacion
const app = express();
require('./database');
require('./config/passport');

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'mysecretapp',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Rutas
app.use(require('./routes/users'));
//router.get('/productos.html', isAuthenticated);
router.get('/clientes.html', isAuthenticated);
router.get('/prove.html', isAuthenticated);
router.get('/ventas.html', isAuthenticated);
router.get('/listadoClientes.html', isAuthenticated);
router.get('/ventasClientes.html', isAuthenticated);
router.get('/consolidacion.html', isAuthenticated);

//Settings
app.set('port', process.env.PORT || 3000);

// Static files
app.use(express.static(path.join(__dirname,'public')));
app.use(fileUpload());


app.post('/create', (req,res) => {
  console.log('body: ', req.body);
  const {nit, ciudad, nombreC, telefono, direccionC } = req.body;
  const data = JSON.stringify({
    ciudad: ciudad,
    direccionProveedor: direccionC,
    nit: nit,
    nombreProveedor: nombreC,
    telefonoProveedor: telefono,
  })

  const options = {
    host: "localhost",
    port: 8081,
    path: "/api/db_proveedores",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  req = http.request(options, (res) => {
    console.log("statusCode: ", res.statusCode);
        let result = "";
        res.on("data", (chunk) => {
            result += chunk;
        });
        res.on("end", () => {
            console.log("Result is: " + result);
        });
    });
    req.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    req.write(data);

    req.end();
});

app.put('/update', (req,res) => {
  console.log('body: ', req.body);
  const {nit, ciudad, nombreC, telefono, direccionC } = req.body;
  const data = JSON.stringify({
    ciudad: ciudad,
    direccionProveedor: direccionC,
    nit: nit,
    nombreProveedor: nombreC,
    telefonoProveedor: telefono,
  })
  const options = {
    host: "localhost",
    port: 8081,
    path: "/api/db_proveedores/"+nit,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  req = http.request(options, (res) => {
    console.log("statusCode: ", res.statusCode);
        let result = "";
        res.on("data", (chunk) => {
            result += chunk;
        });
        res.on("end", () => {
            console.log("Result is: " + result);
        });
    });
    req.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    req.write(data);

    req.end();
});

app.post('/ventas', (req, res) =>{
  console.log('body', req.body);
  const {consec, cedulaC, nombreC, prod1, cantProd1, vlrTotal1, precioCompra1, ivaCompra1, prod2, cantProd2, vlrTotal2, 
    precioCompra2, ivaCompra2, prod3, cantProd3, vlrTotal3, precioCompra3, ivaCompra3, totalVenta, totalIva, totalConIva} = req.body;
  const data = JSON.stringify({
    cedulaCliente: cedulaC,
    codigoVenta: consec,
    nombreCliente: nombreC, 
    detalleVenta: [
      {
        detVentaP1: [
          {
            cantProducto1: cantProd1,
            codProducto1: prod1,
            ivaCompra1: ivaCompra1,
            precioCompra1: precioCompra1,
            precioVenta1: vlrTotal1
          }
        ],
        detVentaP2:[
          {
            cantProducto2: cantProd2,
            codProducto2: prod2,
            ivaCompra2: ivaCompra2,
            precioCompra2: precioCompra2,
            precioVenta2: vlrTotal2
          }
        ],
        detVentaP3:[
          {
            cantProducto3: cantProd3,
            codProducto3: prod3,
            ivaCompra3: ivaCompra3,
            precioCompra3: precioCompra3,
            precioVenta3: vlrTotal3
          }
        ]
      }
    ],
    ivaCompraTotal: totalIva,
    precioCompraTotal: totalVenta,
    precioVentaTotal: totalConIva
  })

  const options = {
    host: "localhost",
    port: 8083,
    path: "/api/db_ventas",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  req = http.request(options, (res) => {
    console.log("statusCode: ", res.statusCode);
        let result = "";
        res.on("data", (chunk) => {
            result += chunk;
        });
        res.on("end", () => {
            console.log("Result is: " + result);
        });
    });
    req.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    req.write(data);

    req.end();
});

app.post('/createClient', (req,res) => {
  console.log('body: ', req.body);
  const {cedulaC, emailCliente, nombreC, telefono, direccionC } = req.body;
  const data = JSON.stringify({
    emailCliente: emailCliente,
    direccionCliente: direccionC,
    cedulaCliente: cedulaC,
    nombreCliente: nombreC,
    telefonoCliente: telefono,
  })

  const options = {
    host: "localhost",
    port: 8082,
    path: "/api/db_clientes",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  req = http.request(options, (res) => {
    console.log("statusCode: ", res.statusCode);
        let result = "";
        res.on("data", (chunk) => {
            result += chunk;
        });
        res.on("end", () => {
            console.log("Result is: " + result);
        });
    });
    req.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    req.write(data);

    req.end();
});

app.put('/updateClient', (req,res) => {
  console.log('body: ', req.body);
  const {cedulaC, emailCliente, nombreC, telefono, direccionC } = req.body;
  const data = JSON.stringify({
    emailCliente: emailCliente,
    direccionCliente: direccionC,
    cedulaCliente: cedulaC,
    nombreCliente: nombreC,
    telefonoCliente: telefono,
  })
  const options = {
    host: "localhost",
    port: 8082,
    path: "/api/db_clientes/"+cedulaC,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  req = http.request(options, (res) => {
    console.log("statusCode: ", res.statusCode);
        let result = "";
        res.on("data", (chunk) => {
            result += chunk;
        });
        res.on("end", () => {
            console.log("Result is: " + result);
        });
    });
    req.on("error", (err) => {
        console.log("Error: " + err.message);
    });
    req.write(data);

    req.end();
});

app.post('/upload', upload.single('csvfile'), async (req,res)=>{
  var csv = require("fast-csv");

  //var header = req.headers['content-type'];
  let csvfile = req.files.csvfile;
  csvfile.mv('./uploads/'+ csvfile.name);
  var tar_path = './uploads/'+ csvfile.name;
  
  var Product  = require('./models/Products');
  
  var stream = fs.createReadStream(tar_path)
  .pipe(csv.parse({delimiter: ";"}))
  .on('error', error => console.error(error))
  .on('data', function(data){

    var item = new Product({
      codProducto: data[0],
      nomProducto: data[1],
      nitProveedor: data[2],
      precioCompra: data[3],
      ivaCompra: data[4],
      precioVenta: data[5]
    });

    item.save(function(error){
      console.log(item);
      if(error){
        item.update();
        console.log("error");
        throw error;
      }
    });
  })
  .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
  
  res.redirect('./productos.html');
});
  
// Server is listenning
app.listen(app.get('port'),() => 
    console.log('Server is running and listening on port',app.get("port")
    ));
module.exports=app;