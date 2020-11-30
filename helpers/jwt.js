const jsw = require('jsonwebtoken');


const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid
        };

        jsw.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('Noe se pudo generar el JWT')
            } else {
                resolve(token);
            }
        });

    });


}

module.exports = {
    generarJWT
}