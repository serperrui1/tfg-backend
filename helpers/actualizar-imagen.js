const Comprador = require('../models/comprador');
const Proveedor = require('../models/proveedor');
const Administrador = require('../models/administrador');
const AsistenteTecnico = require('../models/asistenteTecnico');
const Producto = require('../models/producto');
const fs = require('fs');

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
    }
}


const actualizarImagen = async(tipo, id, nombreArchivo) => {


    let pathViejo = '';

    switch (tipo) {
        case 'compradores':
            const comprador = await Comprador.findById(id);
            if (!comprador) {
                console.log('No es un comprador por id');
                return false;
            }

            pathViejo = `./uploads/compradores/${ comprador.img }`;
            if (comprador.img !== "") {
                borrarImagen(pathViejo);
            }

            comprador.img = nombreArchivo;
            await comprador.save();
            return true;

            break;

        case 'proveedores':
            const proveedor = await Proveedor.findById(id);
            if (!proveedor) {
                console.log('No es un proveedor por id');
                return false;
            }

            pathViejo = `./uploads/proveedores/${ proveedor.img }`;
            if (proveedor.img !== "") {
                borrarImagen(pathViejo);
            }
            proveedor.img = nombreArchivo;
            await proveedor.save();
            return true;

            break;

        case 'asistentes':

            const asistente = await AsistenteTecnico.findById(id);
            if (!asistente) {
                console.log('No es un asistente por id');
                return false;
            }

            pathViejo = `./uploads/asistentes/${ asistente.img }`;
            if (asistente.img !== "") {
                borrarImagen(pathViejo);
            }

            asistente.img = nombreArchivo;
            await asistente.save();
            return true;

            break;


        case 'administradores':

            const administrador = await Administrador.findById(id);
            if (!administrador) {
                console.log('No es un administrador por id');
                return false;
            }

            pathViejo = `./uploads/administradores/${ administrador.img }`;
            if (administrador.img !== "") {
                borrarImagen(pathViejo);
            }

            administrador.img = nombreArchivo;
            await administrador.save();
            return true;

            break;


        case 'productos':
            const producto = await Producto.findById(id);
            if (!producto) {
                console.log('No es un producto por id');
                return false;
            }

            pathViejo = `./uploads/productos/${ producto.imagenes }`;
            if (producto.imagenes !== "") {
                borrarImagen(pathViejo);
            }
            producto.imagenes = nombreArchivo;
            await producto.save();
            return true;

            break;
    }


};
const crearImagen = async(id, nombreArchivo) => {

    const producto = await Producto.findById(id);
    if (!producto) {
        console.log('No existe el producto con esa id');
        return false;
    }

    producto.imagenes.push(nombreArchivo);
    await producto.save();
    return true;

}



module.exports = {
    actualizarImagen,
    crearImagen
}