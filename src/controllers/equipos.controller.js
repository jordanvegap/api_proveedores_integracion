const jwt = require('jsonwebtoken');
const createLogger = require('../appLogs/a_witsonlogs');
const loggerToken = createLogger({ level: 'error', logFileName: './src/appLogs/tickets.controller.log' });
const db = require('../models/equipos');
const { Op, where } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { Console } = require('winston/lib/winston/transports');
const serverConfig  = require('../config/server.config');
const moment = require('moment-timezone');
const dbInmuebles = require('../models/inmuebles_aduanas');
function isValidDate(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return regex.test(dateStr);
}
const CreateEquipoProvider = async (req, res) => {
    try {
        const { idProvider } = req.params;
        

        let responseResult = { success: false, message: 'Sin información para mostrar', JsonData: [], count: 0 };

        if (idProvider != req.provider_id) {
            responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
            res.status(403).json(responseResult);
            return
        }

        if (!req.params.idEmpleadoProvider) {
            responseResult = { success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador` };
            res.status(403).json(responseResult);
            return
        }

        if (req.params.idEmpleadoProvider <= 0) {
            responseResult = { success: false, message: `idEmpleadoProvider no es valido`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.params.codVPN) {
            responseResult = { success: false, message: `codVPN es requerido`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.noSerie) {
            responseResult = { success: false, message: `noSerie es requerido`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        //Valida si el inventrio esta activo
        const getEquipo = await db.model_equipo_services.findOne({
            where: {
                idEmpresa: 1,
                idProveedor: req.params.idProvider,
                //codVPN: req.params.codVPN,
                noSerie: req.body.noSerie,
                estatusEquipo: 1
            }
        });

        if (getEquipo) {
            responseResult = { success: false, message: 'El equipo o inventario ya se encuentra activo y registrado en sistema', JsonData: [], count: 1 };
            res.status(403).json(responseResult);
            return;
        }
        
        //Obtiene el id interno del inmueble
        const getInmueble = await dbInmuebles.model_ubicaciones_services.findOne({
            where: {
                idEmpresa: 1,
                idProveedor: req.params.idProvider,
                codigoVPN: req.params.codVPN
            }
        })

        if (!getInmueble) {
            responseResult = { success: false, message: 'No se localizó relación de inmueble por el codigo VPN', JsonData: [], count: 1 };
            res.status(403).json(responseResult);
            return;
        }

        const uuid = uuidv4();
        const insertFields = {
            idEmpresa: 1,
            uuidEquipo: uuid,
            idProveedor: req.params.idProvider,
            idEmpleadoSolicita: req.params.idEmpleadoProvider,
            idInternoRequisicion: getInmueble['dataValues'].idInterno,
            idInternoInmueble: getInmueble['dataValues'].idInterno,
            estatusEquipo: 1,
            codVPN: req.params.codVPN,
            hostName: req.body.hostName,
            modelo: req.body.modelo,
            codigoBarras: req.body.codigoBarras,
            dtsReferencia: req.body.dtsReferencia,
            noSerie: req.body.noSerie,
            noParte: req.body.noParte,
            noInventario: req.body.noInventario,
            dirIP: req.body.dirIP,
            dirMac: req.body.dirMac,
            tipoEquipo_alias: req.body.tipoEquipo_alias,
            tipoEquipo_auxiliar: req.body.tipoEquipo_alias,
            AUDITORIA_USU_ALTA: req.params.idEmpleadoProvider,
            AUDITORIA_USU_ULT_MOD: req.params.idEmpleadoProvider
        };

        const insertRowData = await db.model_equipo_services.create(insertFields);
        if (insertRowData) {
            responseResult = {
                success: true, message: 'Equipo creado correctamente',
                JsonData: {
                    uuidEquipo: insertRowData.uuidEquipo,
                    idEquipo: insertRowData.idEquipo,
                    noSerie: insertRowData.noSerie
                }
                , count: 1
            };
            res.json(responseResult);
        } else {
            responseResult = { success: false, message: 'Error al crear el ticket' };
            res.json(responseResult);
        }
    } catch (err) {
        console.log(err);
        loggerToken.error(JSON.stringify({ errorDescription: err, dataBody: req.body }));
        if (err.name === 'SequelizeUniqueConstraintError') {
            responseResult = { success: false, message: 'Ya existe un ticket con el newIdTicket proporcionado.', JsonData: null, count: 0 };
            return res.status(200).json(responseResult);
        } else if (err.name === 'SequelizeDatabaseError') {
            responseResult = { success: false, message: 'Error en el consumo, valide la documentación.', JsonData: null, count: 0 };
            return res.status(400).json(responseResult);
        }
        responseResult = { success: false, message: `Error al crear el ticket  ${err.name}`, JsonData: null, count: 0 };
        res.status(200).json(responseResult);
    }
};

const ReadEquipoProvider = async (req, res) => {
    const { idProvider } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }
    try {
        const equiposResult = await db.model_equipo_services.findAll({
            attributes: {
                include: [
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('AUDITORIA_FEC_ALTA'), '%Y-%m-%d %H:%i:%s'), 'fechaAlta'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('EQUIPAMIENTO_FECHA_ULTIMO_ESTATUS'), '%Y-%m-%d %H:%i:%s'), 'fechaUltimoEstatus'],
                ],
                exclude: ['AUDITORIA_USU_ALTA', 'AUDITORIA_USU_ULT_MOD', 'AUDITORIA_FEC_ALTA', 'AUDITORIA_FEC_ULT_MOD']
            },
            where: {
                idProveedor: { [Op.in]: [req.provider_id] },
                ...(req.query.codVPN && { codVPN: { [Op.in]: [req.query.codVPN] } }),
                idEmpresa: 1,
                estatusEquipo: 1
            }
        })

        if (equiposResult.length == 0) {
            responseResult = {success: false, message: 'No se localizaron datos'};
        } else {
            responseResult = {success: true, message: 'Success get', JsonData: equiposResult, count:equiposResult.length};
        }
        res.json(responseResult);
    } catch (error) {
        console.log(error);
        
        loggerToken.error(JSON.stringify({errorDescription: error,dataBody: req.body}));
        if (error.name === 'SequelizeUniqueConstraintError') {
            responseResult = {success: false, message: 'Ya existe un token para este proveedor.'};
            return res.status(200).json(responseResult);
        } else if (error.name === 'SequelizeDatabaseError'){
            responseResult = {success: false, message: 'Error en el consumo, valide la documentación.'};
            return res.status(400).json(responseResult);
        }
        responseResult = {success: false, message: `Error al cosumir el servicio ${error.name}`};
        res.status(200).json(responseResult);
    }
};

const isEmptyObject = (obj) => {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
};

const generateNewID = async (req, res) => {
    const { idProvider } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }
    const uuid = uuidv4();
    responseResult = {success: true, message: 'New Id Generado correctamente', JsonData: {newIdGenerado: uuid }, count:1};
    res.json(responseResult);
};

const UpdateEquipoProvider = async (req, res) => {
    const { idProvider, noSerie, idEmpleadoProvider } = req.params;
    const bodyUpdateInventario = req.body;
   
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }

    if (isEmptyObject(bodyUpdateInventario)) {
        responseResult = {success: false, message: 'Se requiere al menos un campo para actualizar', JsonData: [], count:0};
        return res.status(400).json(responseResult);
    }

    try {
        // Obtiene informacion del equipo a actualizar
        const infoInvnetario = await db.model_equipo_services.findOne({
            where: {
                idEmpresa: 1,
                noSerie: noSerie,
                estatusEquipo: 1
            }
        });

        if (!infoInvnetario) {
            responseResult = { success: false, message: 'El equipo o inventario no fue localizado en el sistema o esta inactivo', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        const updateFields = {
            ...bodyUpdateInventario,
            AUDITORIA_USU_ULT_MOD: idEmpleadoProvider,
            AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP')
        };

        if (bodyUpdateInventario.codVPN) {
            // Obtiene el id interno del inmueble
            const getInmueble = await dbInmuebles.model_ubicaciones_services.findOne({
                where: {
                    idEmpresa: 1,
                    idProveedor: req.params.idProvider,
                    codigoVPN: bodyUpdateInventario.codVPN
                }
            });
            if (!getInmueble) {
                responseResult = {
                    success: false,
                    message: 'No se localizó relación de inmueble por el código VPN',
                    JsonData: [],
                    count: 1
                };
                return res.status(403).json(responseResult); // Esto detiene el flujo aquí.
            }
            // Asigna los valores de idInterno a los campos correspondientes
            updateFields.idInternoRequisicion = getInmueble['dataValues'].idInterno;
            updateFields.idInternoInmueble = getInmueble['dataValues'].idInterno;
        }

       const [updatedRowsCount] = await db.model_equipo_services.update(
            updateFields,
            {
                where: {
                    idEmpresa: 1,
                    uuidEquipo: infoInvnetario['dataValues'].uuidEquipo,
                    idEquipo: infoInvnetario['dataValues'].idEquipo,
                }
                //returning: true // Devuelve los registros actualizados
            }
        );
        if (updatedRowsCount > 0) {
            responseResult = {success: true, message: 'Equipo o inventario actualizado correctamente', JsonData: [], count:1};
            res.json(responseResult);
        } else {
            responseResult = {success: false, message: 'No se encontró el registro para actualizar o no se detctaron cambios'};
            res.json(responseResult);
        }
        
    } catch (error) {
        responseResult = {success: false, message: `Error al actualizar el registro -> ${error}`};
        let responseResultLog = {success: false, message: `Error al actualizar el registro -> ${error}`, dataBody: req.body};
        loggerToken.error(JSON.stringify(responseResultLog));
        res.status(500).json(responseResult);
    }
};

module.exports = {
    CreateEquipoProvider,
    ReadEquipoProvider,
    UpdateEquipoProvider,
    //DeleteEquipoProvider,
    generateNewID
};