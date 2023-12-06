const userManager = require('../../users/user.manager');


const userDocsOk = async (req, res, next) => {
    try {
        const { uid } = req.params
        const { role } = req.user

        const user = await userManager.getById(uid)
        if (!user) {
            res.send({
                status: 404,
                error: 'El Usuario No Existe...'
            })
        }
        let docsOk = 0;
        if (role === 'Premium') {
            next();
            return true;
        }
        if (!user.documents || user.documents.length < 3) {
            res.send({
                status: 403,
                error: '**Los Documentos Requeridos no han sido cargados por el usuario, por el momento. Cambio de Role DENEGADO'
            })
        } else {
            for (const docUser of user.documents) {
                if (docUser.name === 'identificacion.pdf') {
                    docsOk++;
                } else if (docUser.name === 'comprobante_de_domicilio.pdf') {
                    docsOk++;
                } else if (docUser.name === 'comprobante_de_estado_de_cuenta.pdf') {
                    docsOk++;
                }
            }
            if (docsOk >= 3) {
                next();
                return true;
            } else {
                res.send({
                    status: 403,
                    error: 'Los Documentos Requeridos no han sido cargados por el usuario, por el momento. Cambio de Role DENEGADO'
                })
            }
        }


    } catch (err) {
        res.send({
            status: 500,
            error: 'se rompe por aca...' + err
        })
    }
}

module.exports = userDocsOk;