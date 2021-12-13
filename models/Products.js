const mongoose = require('mongoose');
const { Schema } = mongoose;


const ProductsSchema = new Schema({
    codProducto: {type: Number, require: true, unique: true, sparse: true},
    nomProducto: {type: String, require: true},
    nitProveedor: {type: Number, require: true},
    precioCompra: {type: Number, require: true},
    ivaCompra: {type: Number, require: true},
    precioVenta: {type: Number, require: true}
});

const dbProductos = mongoose.connection.useDb('dbProductos');

//const db = dbProductos.dropCollection('productos');

const ProductoInfo = dbProductos.model('Producto', ProductsSchema);

module.exports = ProductoInfo;