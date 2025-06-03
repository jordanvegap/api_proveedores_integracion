const winston = require('winston');

function createLogger({ level = 'info', logFileName = 'app.log' }) {
  return winston.createLogger({
    level: level, // Nivel de registro personalizado
    format: winston.format.combine(
      winston.format.colorize(), // Colorear la salida de la consola
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console(), // Registrar en la consola
      new winston.transports.File({ filename: logFileName }) // Registrar en un archivo específico
    ],
  });
}

module.exports = createLogger;