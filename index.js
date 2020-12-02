require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//crear el servidor de express

const app = express();

//configurar cors
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

//Rutas

app.use('/api/login', require('./routes/auth'));
app.use('/api/compradores', require('./routes/compradores'));
app.use('/api/proveedores', require('./routes/proveedores'));
app.use('/api/administradores', require('./routes/administradores'));
app.use('/api/asistentesTecnicos', require('./routes/asistentesTecnicos'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});