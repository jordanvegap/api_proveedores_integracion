
const serverConfig  = require('../config/server.config');
const nodemailer = require('nodemailer');
const sendMailNotification = async (to, subject, text, idTicket) => {
    try {
        // Configura el transporte de Nodemailer con tu servicio de correo
        const transporter = nodemailer.createTransport(serverConfig.MailConfig);
        // Configuración del correo
        const mailOptions = {
          from: `ANAM MESA CENTRAL NOTIFICACIONES <${serverConfig.MailConfig.auth.user}>`,    // Remitente
          to: to,                        // Destinatario(s)
          subject: subject,              // Asunto del correo
          html: `<h1>Ticket número: ${idTicket} ha sido actualizado por proveedor</h1><p>Detalle de cambio:</br>${text}</p><p>Por favor, no respona sobre este correo ya que solo es de notificaciones</p>
          <p style='font-size: 9px;'>INFORMACIÓN CONFIDENCIAL Este comunicado es para ser utilizado por el receptor y contiene información que puede ser privilegiada, confidencial, de propiedad intelectual y/o que contenga datos personales, de acuerdo con las leyes aplicables. Si usted no es el receptor interesado, por el presente se le notifica formalmente que cualquier uso, copia o distribución de este correo electrónico, en todo o en parte, está estrictamente prohibido. Por favor notifique al remitente regresándole este correo electrónico y bórrelo de su sistema. Este correo electrónico no constituye un consentimiento para el uso de la información del remitente, para propósitos directos de mercadotecnia o para transmisiones de información a terceros.</p>`  // HTML content
        };
        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);
        return true; // Si el correo se envió correctamente
      } catch (error) {
        console.error('Error al enviar correo:', error);
        return false; // Si hubo algún error
      }
}

module.exports = {
    sendMailNotification
};