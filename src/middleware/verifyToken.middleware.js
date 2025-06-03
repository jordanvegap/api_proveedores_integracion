
const db = require("../models/token");
const tokeModel = db.model_token_access;
const jwt = require('jsonwebtoken');

exports.verifyTokenProvider = async (req, res, next) => {
    const provider_token = req.headers['access-token'];
    let responseResult = {success: false, message: null, JsonData: null, count:0};

    if (!provider_token) {
        responseResult = {success: false, message: 'El token es requerido', JsonData: null, count:0};
        return res.status(403).json(responseResult);
    }

    jwt.verify(provider_token, 'secret_key', async (err, decoded) => {
        if (err) {
            responseResult = {success: false, message: 'El token no es valido', JsonData: null, count:0};
            return res.status(401).json(responseResult);
        }
        
        const provider_name = decoded.provider_data.provider_name;
        const storedToken = await tokeModel.findOne({ where: { provider_name,provider_token } });
        if (!storedToken || storedToken.provider_revoked) {
            responseResult = {success: false, message: 'El token fue revocado o no existe', JsonData: null, count:0};
            return res.status(401).json(responseResult);
        }

        req.provider_id = decoded.provider_data.provider_id;
        req.provider_id_emp = decoded.provider_data.provider_id_emp;
        req.provider_emphost = decoded.provider_data.provider_emphost;
        req.provider_servicio = decoded.provider_data.provider_servicio;        
        next(); // Pasar al siguiente middleware o ruta
    });
}