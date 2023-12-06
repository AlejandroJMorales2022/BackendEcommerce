const { Router } = require('express');
const mailSender = require('../services/mail.sender.service');
const sgMail = require('@sendgrid/mail')

const router = Router();

router.get('/mail', async (req, res) => {

    sgMail.setApiKey('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');



    const body = {
        to: 'info@cabanasecosdelvalle.com.ar',
        from: "info@cabanasecosdelvalle.com.ar",
        subject: "Sandgrid Test",
        text: "Pompeulimp eu vou te seguir insta relaxa!! @pompeulimp",
        html: `<span>
                <strong>
                Ola vem seguir no insta vem por favor? Sr. info@cabanasecosdelvalle.com.ar
                </strong>
                </span>
                <div class="text-center d-flex">
                    
                    <a class="btn btn-secundary mt-4" style="color:white;" href="http://localhost:8080/restartpass" target="_blank">Restablecer Contraseña</a>
                    
                </div>`
                ,
    };
    await sendEmail(body)
    res.status(201).send({
        status: 'success',
        statusNumber: 201,
        msg: 'Email Enviado con Exito'
    });
})

const sendEmail = (body) =>
    sgMail
        .send(body)
        .then((result) => {
            console.log("Email enviado");
            console.log(result);

        })
        .catch((error) => {
            console.error(error);

            if (error.response) {
                console.error(error.response.body);
            }
        });



module.exports = router;