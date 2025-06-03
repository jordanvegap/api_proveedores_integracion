const db = require("../models/token");
const jwt = require('jsonwebtoken');
const tokeModel = db.model_token_access;
const createLogger = require('../appLogs/a_witsonlogs');
const loggerToken = createLogger({ level: 'error', logFileName: './src/appLogs/token.controller.log' });

const createTokenProvider = async (req, res) => {
    try {
        const { provider_data } = req.body;
        let responseResult = {success: false, message: null, JsonData: null, count:0};
        const provider_name = provider_data.provider_name;
        const provider_token = jwt.sign({ provider_data }, 'secret_key');
        try {
            await tokeModel.create({ provider_name, provider_token });
            responseResult = {success: true, message: 'Success get', JsonData: provider_token, count:1};
            res.json(responseResult);
        } catch (err) {
            loggerToken.error(JSON.stringify({errorDescription: err,dataBody: req.body}));
            if (err.name === 'SequelizeUniqueConstraintError') {
                responseResult = {success: false, message: 'Ya existe un token para este proveedor.' , JsonData: null, count:0};
                return res.status(200).json(responseResult);
            } else if (err.name === 'SequelizeDatabaseError'){
                responseResult = {success: false, message: 'Error en el consumo, valide la documentación.' , JsonData: null, count:0};
                return res.status(400).json(responseResult);
            }
            responseResult = {success: false, message: `Error al generar token ${err.name}` , JsonData: null, count:0};
            res.status(200).json(responseResult);
        }
    } catch (error) {
        loggerToken.error(JSON.stringify({errorDescription: error.name,dataBody: req.body}));
        responseResult = {success: false, message: `Error al generar token ${error.name}` , JsonData: null, count:0};
        return res.status(500).json(responseResult);
    }
};

module.exports = {
    createTokenProvider,
};