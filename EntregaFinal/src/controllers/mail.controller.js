/* const mailSender = require('../services/mail.sender.service'); */
const sgMail = require('@sendgrid/mail');
// importo config de variables de entorno
const {SG_MAIL_KEY} = require('../config/config');
const { generateToken } = require('../utils/create.token');
const tokenManager = require('../../src/dao/managers/tokensemails/tokens.emails.db.manager');


const mailSender = async (req, res) => {
    const { email } = req.user
    const newToken = generateToken(email)
    /* const expirationTime = Date.now() + 60 * 60 * 1000; */ // 1 hora en milisegundos

    //Guardar en Base de daos newToken y para el email del cliente y habilitar o no la actualizacion de la contraseña
    /* localStorage.setItem(email, newToken); */
    const resp = await tokenManager.getByEmail(email)
    if (resp?.email === email) {
        await tokenManager.update(resp._id, { email: email, token: newToken })
    } else {
        await tokenManager.create({ email: email, token: newToken })
    }


    sgMail.setApiKey('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');
  /*  sgMail.setApiKey(SG_MAIL_KEY);
    console.log(SG_MAIL_KEY) */
    const body = {
        to: email,
        from: "info@cabanasecosdelvalle.com.ar",
        subject: "Restablecer Contraseña",
        text: "Para restablecer su contraseña, por favor, presione el botón abajo...",
        html: `<span>
                <strong>
                Para restablecer su contraseña, por favor, presione el botón abajo...
                </strong>
                </span>
                <div class="text-center d-flex">
                    <button class="btn btn-secundary mt-4" style="background-color: grey; height: 40px; width: 120px; margin-top: 50px; padding:0;">
                    <a  style="display: flex; align-items: center; justify-content: center; text-decoration: none; color: white; height: 100%;" href="http://localhost:8080/restartpass?token=${newToken}&email=${email}" target="_blank">Restablecer Contraseña</a>
                    </button>
                </div>`
        ,
    };
    try {
        await sendEmail(body)
        res.status(201).send({
            status: 'success',
            statusNumber: 201,
            msg: 'Email Enviado con Exito'
        });
    } catch (err) {
        res.status(500).send({
            status: 'FAILURE',
            statusNumber: 500,
            msg: 'Email No Enviado ' + err
        });
    }
}


const notifyPremium = async (email, product) => {
    
    sgMail.setApiKey('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');
  /*  sgMail.setApiKey(SG_MAIL_KEY);
    console.log(SG_MAIL_KEY) */
    const body = {
        to: email,
        from: "info@cabanasecosdelvalle.com.ar",
        subject: "Notificación de Eliminación de un Producto",
        text:  `Notificamos que el producto con Id ${product} ha sido Eliminado de la Base de Datos`,
        html: `<div>Notificamos que el producto con Id ${product} ha sido Eliminado de la Base de Datos del Ecommerce</div>`
        ,
    };
    try {
        await sendEmail(body)
    } catch (err) {
        res.status(500).send({
            status: 'FAILURE',
            statusNumber: 500,
            msg: 'Email No Enviado ' + err
        });
    }
}

const notifyDeletedUserAccount = async (email) => {
    
    sgMail.setApiKey('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');
  /*  sgMail.setApiKey(SG_MAIL_KEY);
    console.log(SG_MAIL_KEY) */
    const body = {
        to: email,
        from: "info@cabanasecosdelvalle.com.ar",
        subject: "Notificación de Baja de Cuenta",
        text:  `Notificamos de Baja de Cuenta`,
        html: `<div>Notificamos que su Cuenta de usuario ha sido dada de Baja de nuestra plataforma de Ecommerce por Inactividad</div>`
        ,
    };
    try {
        await sendEmail(body)
    } catch (err) {
        res.status(500).send({
            status: 'FAILURE',
            statusNumber: 500,
            msg: 'Email No Enviado ' + err
        });
    }
}

const sendEmail = (body) =>
    sgMail
        .send(body)
        .then((result) => {
        })
        .catch((error) => {
            console.error(error);

            if (error.response) {
                console.error(error.response.body);
            }
        });

module.exports = { mailSender, notifyPremium, notifyDeletedUserAccount }