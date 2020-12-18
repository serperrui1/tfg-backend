const Comprador = require('../models/comprador');
const Proveedor = require('../models/proveedor');
const AsistenteTecnico = require('../models/asistenteTecnico');
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
            borrarImagen(pathViejo);

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
            borrarImagen(pathViejo);

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
            borrarImagen(pathViejo);

            asistente.img = nombreArchivo;
            await asistente.save();
            return true;

            break;
    }


}



module.exports = {
    actualizarImagen
}