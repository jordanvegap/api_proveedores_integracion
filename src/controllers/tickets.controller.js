const jwt = require('jsonwebtoken');
const createLogger = require('../appLogs/a_witsonlogs');
const loggerToken = createLogger({ level: 'error', logFileName: './src/appLogs/tickets.controller.log' });
const db = require('../models/tickets');
const { Op, where } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { Console } = require('winston/lib/winston/transports');
const serverConfig  = require('../config/server.config');
const moment = require('moment-timezone');

const {sendMailNotification} = require('./mail.controller');
function isValidDate(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return regex.test(dateStr);
}

const getNewTicketsProvider = async (req, res) => {
    const { idProvider } = req.params;
    //const { idEmpresa } = req.query;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }
    try {
        const ticketsResult = await db.model_ticket_services.findAll({
            attributes: {
                include: [
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_PROMESA'), '%Y-%m-%d %H:%i:%s'), 'fechaPromesa'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ALTA'), '%Y-%m-%d %H:%i:%s'), 'fechaAlta'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_SOLICITA'), '%Y-%m-%d %H:%i:%s'), 'fechaClienteSolicita'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE'), '%Y-%m-%d %H:%i:%s'), 'fechaCierre'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE_SISTEMA'), '%Y-%m-%d %H:%i:%s'), 'fechaCierreAutomatico'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ENTREGA_PROVEEDOR'), '%Y-%m-%d %H:%i:%s'), 'fechaEntregaProveedor'],
                ],
                exclude: ['AUDITORIA_USU_ALTA', 'AUDITORIA_USU_ULT_MOD', 'AUDITORIA_FEC_ALTA', 'AUDITORIA_FEC_ULT_MOD']
            },
            include: [
                {model: db.model_ticket_estatus, as: 'assoEstatusTicket', attributes: ['id', 'descripcion', 'clave'], where: {clave: 'DEFAULT'}},
                {model: db.model_ticket_prioridad, as: 'assoPrioridadTicket', attributes: ['id', 'descripcion', 'slaTiempo']},
                {model: db.model_ticket_requisicion, as: 'assoRequisicionTicket', attributes: ['idReq', 'nombreReq']},
                {model: db.model_ticket_severidad, as: 'assoSeveridadTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tipoticket, as: 'assoTipoTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tiposervicio, as: 'assoTipoCanalTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelUnoTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelDosTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelTresTicket', attributes: ['id', 'descripcion', 'slaEjecucion']},
            ],
            where: {
                idProveedorSolicita: { [Op.in]: [req.provider_id] },
                idEmpresa: req.provider_emphost,
               //'$assoEstatusTicket.clave$': 'DEFAULT'
            }
        })

        if (ticketsResult.length == 0) {
            responseResult = {success: false, message: 'No se localizaron datos'};
        } else {
            responseResult = {success: true, message: 'Success get', JsonData: ticketsResult, count:ticketsResult.length};
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

const getTicketsProviderById = async (req, res) => {
    const { idProvider, newIdTicket } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }
    try {
        const ticketsResult = await db.model_ticket_services.findAll({
            attributes: {
                include: [
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_PROMESA'), '%Y-%m-%d %H:%i:%s'), 'fechaPromesa'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ALTA'), '%Y-%m-%d %H:%i:%s'), 'fechaAlta'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_SOLICITA'), '%Y-%m-%d %H:%i:%s'), 'fechaClienteSolicita'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE'), '%Y-%m-%d %H:%i:%s'), 'fechaCierre'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE_SISTEMA'), '%Y-%m-%d %H:%i:%s'), 'fechaCierreAutomatico'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ENTREGA_PROVEEDOR'), '%Y-%m-%d %H:%i:%s'), 'fechaEntregaProveedor'],
                ],
                exclude: ['AUDITORIA_USU_ALTA', 'AUDITORIA_USU_ULT_MOD', 'AUDITORIA_FEC_ALTA', 'AUDITORIA_FEC_ULT_MOD']
            },
            include: [
                {model: db.model_ticket_estatus, as: 'assoEstatusTicket', attributes: ['id', 'descripcion', 'clave', 'claveProveedor']},
                {model: db.model_ticket_prioridad, as: 'assoPrioridadTicket', attributes: ['id', 'descripcion', 'slaTiempo']},
                {model: db.model_ticket_requisicion, as: 'assoRequisicionTicket', attributes: ['idReq', 'nombreReq']},
                {model: db.model_ticket_severidad, as: 'assoSeveridadTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tipoticket, as: 'assoTipoTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tiposervicio, as: 'assoTipoCanalTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelUnoTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelDosTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelTresTicket', attributes: ['id', 'descripcion', 'slaEjecucion']},
            ],
            where: {
                idProveedorSolicita: { [Op.in]: [req.provider_id] },
                idEmpresa: req.provider_emphost,
                newIdTicket: newIdTicket
            }
        })

        if (ticketsResult.length == 0) {
            responseResult = {success: false, message: 'No se localizaron datos'};
        } else {
            responseResult = {success: true, message: 'Success get', JsonData: ticketsResult, count:ticketsResult.length};
        }
        
        res.json(responseResult);

    } catch (error) {
        
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

const updateTicketProvider = async (req, res) => {
    const { idProvider, newIdTicket } = req.params;
    const updateTicket = req.body;
   
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }

    if (isEmptyObject(updateTicket)) {
        responseResult = {success: false, message: 'Se requiere al menos un campo para actualizar', JsonData: [], count:0};
        return res.status(400).json(responseResult);
    }

    try {
        // Obtiene informacion del ticket actualizar
        const ticketInfo = await db.model_ticket_services.findOne({
            include: [
                { model: db.model_ticket_estatus, as: 'assoEstatusTicket', attributes: ['id', 'descripcion', 'clave'] },
            ],
            where: {
                idEmpresa: req.provider_emphost,
                idProveedorSolicita: req.params.idProvider,
                newIdTicket: req.params.newIdTicket
            }
        });

        if (!ticketInfo) {
            responseResult = { success: false, message: 'El ticket no fue localizado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        // Obtiene informacion del ticket actualizar

        //Valida si el ticket se encuentra en estatus cerrado o cancelado
        const estatusNoPermitidos = ['CANCELADO', 'CERRADO'];
        if (estatusNoPermitidos.includes(ticketInfo.assoEstatusTicket.clave)) {
            responseResult = { success: false, message: 'El ticket tiene un estatus de ' + ticketInfo.assoEstatusTicket.clave + ' no se puede actualizar.', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }
        //Valida si el ticket se encuentra en estatus cerrado o cancelado


        const updateFields = {
            AUDITORIA_USU_ULT_MOD: req.provider_id_emp,
            AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP')
        };

        // Inicia Update tickets por estatus
        if (req.body.idEstatus) {
            updateFields.idEstatus = req.body.idEstatus

            if (!ticketInfo.fechaRecepcion) {
                updateFields.fechaRecepcion = db.sequelize.literal('CURRENT_TIMESTAMP');
                updateFields.duracionRecepcion = db.sequelize.literal(`TIMESTAMPDIFF(SECOND, TIC_FECHA_ALTA, CURRENT_TIMESTAMP)`);
            }

            //Mapeo de Tipo Estatus
            const statusInfo = await db.mdoel_ticket_estatus_proveedor.findOne({
                where: {
                    idEmpresa: req.provider_emphost,
                    idEstatusProveedor: req.body.idEstatus,
                    idProvider: req.params.idProvider
                }
            });

            if (!statusInfo) {
                responseResult = { success: false, message: 'El idEstatus no esta configurado en el sistema', JsonData: [], count: 0 };
                res.status(403).json(responseResult);
                return;
            }

            let idEstatus = statusInfo.idEstatus;
            //Mapeo de Tipo Estatus

            // Obtener detalles del estatus a actualizar
            const estatusTicket = await db.model_ticket_estatus.findOne({
                where: {
                    idEmpresa: req.provider_emphost,
                    id: idEstatus,
                    idProvider: req.params.idProvider
                }
            });

            if (!estatusTicket) {
                responseResult = { success: false, message: 'El idEstatus no esta configurado en el sistema', JsonData: [], count: 0 };
                res.status(403).json(responseResult);
                return;
            }
            let claveEstatusTicket = estatusTicket.clave;
            // Obtener detalles del estatus a actualizar

            if (req.body.descipcionSolucion) {
                updateFields.descipcionSolucion = req.body.descipcionSolucion;
            }

            if (estatusTicket.cierraTicket) {
                updateFields.fechaCierre = db.sequelize.literal('CURRENT_TIMESTAMP');
                updateFields.fechaCierreSola = db.sequelize.literal('CURRENT_TIMESTAMP');
                updateFields.fechaCierreHora = db.sequelize.literal('CURRENT_TIMESTAMP');
            }

            if(claveEstatusTicket === 'PROCESO'){
                updateFields.ticketStatusSla = 'open';
            }

            if (claveEstatusTicket === 'CERRADO') {
                updateFields.ticketCerrado = true;
            }
        }
         // Finaliza Update tickets por estatus

        if (req.body.idTipoTicket) {
            //Mapeo de tipo servicio
            const tipoServicioInfo = await db.model_ticket_tiposervicio_proveedor.findOne({
                where: {
                    idEmpresa: req.provider_emphost,
                    idTipoServicioProveedor: req.body.idTipoTicket,
                    idProvider: req.params.idProvider
                }
            });

            if (!tipoServicioInfo) {
                responseResult = { success: false, message: 'El idTipoTicket no esta configurado en el sistema', JsonData: [], count: 0 };
                res.status(403).json(responseResult);
                return;
            }

            let idTipoServicio = tipoServicioInfo.idTipoServicio;
            updateFields.idTipoTicket = idTipoServicio;
        }

        if (req.body.idPrioridad) {
            //Mapeo id prioridad
            const prioridadInfo = await db.model_ticket_prioridad_proveedor.findOne({
                where: {
                    idEmpresa: req.provider_emphost,
                    idTipoPrioridadProveedor: req.body.idPrioridad,
                    idProvider: req.params.idProvider
                }
            });

            if (!prioridadInfo) {
                responseResult = { success: false, message: 'El idPrioridad no esta configurado en el sistema', JsonData: [], count: 0 };
                res.status(403).json(responseResult);
                return;
            }

            let idPrioridad = prioridadInfo.idTipoPrioridad;
            updateFields.idPrioridad = idPrioridad;
        }
    
        if (req.body.idSeveridad) {
            //Mapeo id severidad
            const severidadInfo = await db.model_ticket_severidad_proveedor.findOne({
                where: {
                    idEmpresa: req.provider_emphost,
                    idTipoSeveridadProveedor: req.body.idSeveridad,
                    idProvider: req.params.idProvider
                }
            });

            if (!severidadInfo) {
                responseResult = { success: false, message: 'El idSeveridad no esta configurado en el sistema', JsonData: [], count: 0 };
                res.status(403).json(responseResult);
                return;
            }

            let idSeveridad = severidadInfo.idTipoSeveridad;
            updateFields.idSeveridad = idSeveridad;
        }

        if (req.body.idCategoriaNivelUno){
            updateFields.idCategoriaNivelUno = req.body.idCategoriaNivelUno;
        }

        if (req.body.idCategoriaNivelDos){
            updateFields.idCategoriaNivelDos = req.body.idCategoriaNivelDos;
        }

        if (req.body.idCategoriaNivelTres){
            updateFields.idCategoriaNivelTres = req.body.idCategoriaNivelTres;
        }

        if (req.body.fechaPromesa) {
            if (!isValidDate(req.body.fechaPromesa)) {
                responseResult = { success: false, message: `fechaPromesa debe estar en formato yyyy-MM-dd HH:mm:ss`, JsonData: [], count: 0 };
                res.status(403).json(responseResult);
                return
            }

            const fechaPromesa = new Date(req.body.fechaPromesa);
            const fechaActual = moment.tz('America/Mexico_City');

            // Verifica si fechaPromesa es mayor a la fecha actual
            if (fechaPromesa <= fechaActual) {
                responseResult = { success: false, message: `fechaPromesa debe ser mayor que la fecha actual`, JsonData: [], count: 0 };
                res.status(403).json(responseResult);
                return;
            }

            updateFields.fechaPromesa = req.body.fechaPromesa;
       }

        if (req.body.idUbicacion){
            updateFields.idUbicacion = req.body.idUbicacion;
        }

        const keysUpdateFields = Object.keys(updateFields);
        keysUpdateFields.push('idTicket');
        // Obtener el registro antes de la actualización
        const registroAntes = await db.model_ticket_services.findOne({ attributes: keysUpdateFields, where: { idProveedorSolicita: req.provider_id,idEmpresa: req.provider_emphost,newIdTicket: newIdTicket } });
       
        const [updatedRowsCount, updatedRows] = await db.model_ticket_services.update(
            updateFields,
            {
                where: {
                    idEmpresa: req.provider_emphost,
                    idProveedorSolicita: req.provider_id,
                    newIdTicket: newIdTicket
                }
                //returning: true // Devuelve los registros actualizados
            }
        );
        if (updatedRowsCount > 0) {
            // Obtener el registro después de la actualización
            const registroDespues = await db.model_ticket_services.findOne({attributes: keysUpdateFields, where: { idProveedorSolicita: req.provider_id,idEmpresa: req.provider_emphost,newIdTicket: newIdTicket } });
            // Guardar en la bitácora los cambios realizados
            await guardarBitacora(registroAntes, registroDespues, req.provider_id_emp, req.provider_emphost, req.provider_id,ticketInfo);

            responseResult = {success: true, message: 'Registro actualizado correctamente', JsonData: [], count:1};
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

const insertBitacoraTicket = async (req, res) => {
    const { idProvider, idTicket } = req.params;
    const { nombreEmpleado, idEstatusTicket, detalleBitacora} = req.body;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }

    if (!idTicket) {
        responseResult = { success: false, message: `idTicket is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!nombreEmpleado) {
        responseResult = { success: false, message: `nombreEmpleado is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (nombreEmpleado.length > 100) {
        responseResult = { success: false, message: `nombreEmpleado supera el limite de caracteres que es de 100`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!idEstatusTicket) {
        responseResult = { success: false, message: `idEstatusTicket is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!detalleBitacora) {
        responseResult = { success: false, message: `detalleBitacora is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (detalleBitacora.length > 5000) {
        responseResult = { success: false, message: `detalleBitacora supera el limite de caracteres permitidos (5000)`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    const insertFields = {}
        insertFields.nombreEmpleado = nombreEmpleado;
        insertFields.idEmpresa = req.provider_emphost;
        insertFields.idTicket = idTicket;
        insertFields.idEmpleado = req.provider_id_emp;
        insertFields.idEstatusTicket = idEstatusTicket;
        insertFields.idTipoBitacora = 1;
        insertFields.idSubTipoBitacora = 2;
        insertFields.detalleBitacora = detalleBitacora
        insertFields.AUDITORIA_USU_ALTA = req.provider_id_emp;
        insertFields.AUDITORIA_USU_ULT_MOD = req.provider_id_emp;
        try {
            const insertRowData = await db.model_ticket_bitacora.create(insertFields);
            
            if (insertRowData) {
                responseResult = {success: true, message: 'Bitacora insertada correctamente', JsonData: {idBitacora: insertRowData.idBitacora }, count:1};
                res.json(responseResult);
            } else {
                responseResult = {success: false, message: 'Error al insertar la bitacora'};
                res.json(responseResult);
            }
        } catch (error) {
            loggerToken.error(JSON.stringify({errorDescription: err,dataBody: req.body}));
            if (err.name === 'SequelizeUniqueConstraintError') {
                responseResult = {success: false, message: 'Ya existe una bitacora.' , JsonData: null, count:0};
                return res.status(200).json(responseResult);
            } else if (err.name === 'SequelizeDatabaseError'){
                responseResult = {success: false, message: 'Error en el consumo, valide la documentación.' , JsonData: null, count:0};
                return res.status(400).json(responseResult);
            }
            responseResult = {success: false, message: `Error al insertar bitacora ${err.name}` , JsonData: null, count:0};
            res.status(200).json(responseResult);
        }
};

const insertBitacoraTicketByNewId = async (req, res) => {
    const { idProvider, newIdTicket } = req.params;
    const { nombreEmpleado, detalleBitacora} = req.body;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }

    if (!newIdTicket) {
        responseResult = { success: false, message: `newIdTicket is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!nombreEmpleado) {
        responseResult = { success: false, message: `nombreEmpleado is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }


    if (nombreEmpleado.length > 100) {
        responseResult = { success: false, message: `nombreEmpleado supera el limite de caracteres permitidos (100)`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!detalleBitacora) {
        responseResult = { success: false, message: `detalleBitacora is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (detalleBitacora.length > 5000) {
        responseResult = { success: false, message: `detalleBitacora supera el limite de caracteres permitidos (5000)`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }


    const ticketInfo = await db.model_ticket_services.findOne({
        attributes: ['idTicket', 'newIdTicket', 'idEstatus'],
        where: {
            idEmpresa: req.provider_emphost,
            newIdTicket: newIdTicket,
            idProveedorSolicita: idProvider
        }
    });

    if (!ticketInfo) {
        responseResult = { success: false, message: 'El Ticket no fue localizado en sistema', JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return;
    }

    const insertFields = {}
        insertFields.nombreEmpleado = nombreEmpleado;
        insertFields.idEmpresa = req.provider_emphost;
        insertFields.idTicket = ticketInfo.idTicket;
        insertFields.idEmpleado = req.provider_id_emp;
        insertFields.idEstatusTicket = ticketInfo.idEstatus;
        insertFields.idTipoBitacora = 1;
        insertFields.idSubTipoBitacora = 2;
        insertFields.detalleBitacora = detalleBitacora
        insertFields.AUDITORIA_USU_ALTA = req.provider_id_emp;
        insertFields.AUDITORIA_USU_ULT_MOD = req.provider_id_emp;
        try {
            const insertRowData = await db.model_ticket_bitacora.create(insertFields);
            
            if (insertRowData) {
                responseResult = {success: true, message: 'Bitacora insertada correctamente', JsonData: {idBitacora: insertRowData.idBitacora }, count:1};
                res.json(responseResult);
            } else {
                responseResult = {success: false, message: 'Error al insertar la bitacora'};
                res.json(responseResult);
            }
        } catch (error) {
            loggerToken.error(JSON.stringify({errorDescription: err,dataBody: req.body}));
            if (err.name === 'SequelizeUniqueConstraintError') {
                responseResult = {success: false, message: 'Ya existe una bitacora.' , JsonData: null, count:0};
                return res.status(200).json(responseResult);
            } else if (err.name === 'SequelizeDatabaseError'){
                responseResult = {success: false, message: 'Error en el consumo, valide la documentación.' , JsonData: null, count:0};
                return res.status(400).json(responseResult);
            }
            responseResult = {success: false, message: `Error al insertar bitacora ${err.name}` , JsonData: null, count:0};
            res.status(200).json(responseResult);
        }
};

async function guardarBitacora(registroAntes, registroDespues,idEmpleadoIns, idEmpresaIns, idProviderData = 0,ticketInfoData) {
    // Iterar sobre las propiedades del registro para detectar cambios
    Object.keys(registroAntes.dataValues).forEach(async (campo) => {
        const valorAntes = registroAntes[campo];
        const valorDespues = registroDespues[campo];
        const insertFields = {}
        insertFields.nombreEmpleado = "Actualización desde API";
        insertFields.idEmpresa = idEmpresaIns;
        insertFields.idTicket = registroDespues.idTicket;
        insertFields.idEmpleado = idEmpleadoIns;
        insertFields.idEstatusTicket = 0;
        insertFields.idTipoBitacora = 1;
        insertFields.idSubTipoBitacora = 2;

        if (campo == 'AUDITORIA_FEC_ULT_MOD' || campo == 'AUDITORIA_USU_ULT_MOD') {} else {
            if (campo == 'idEstatus' ) {
                // Obtener detalles del estatus previo al cambio
                const estatusTicketAntes = await db.model_ticket_estatus.findOne({
                    where: {
                        idEmpresa: idEmpresaIns,
                        id: valorAntes,
                        idProvider: idProviderData
                    }
                });

                // Obtener detalles del estatus nuevo
                const estatusTicketDespues = await db.model_ticket_estatus.findOne({
                    where: {
                        idEmpresa: idEmpresaIns,
                        id: valorDespues,
                        idProvider: idProviderData
                    }
                });

                if (!estatusTicketAntes) {
                    responseResult = { success: false, message: 'El estado no esta configurado en el sistema', JsonData: [], count: 0 };
                    res.status(403).json(responseResult);
                    return;
                }

                if (!estatusTicketDespues) {
                    responseResult = { success: false, message: 'El estado no esta configurado en el sistema', JsonData: [], count: 0 };
                    res.status(403).json(responseResult);
                    return;
                }
                
                insertFields.detalleBitacora = `El campo Estado/Estatus cambio de ${estatusTicketAntes.descripcion} a ${estatusTicketDespues.descripcion}`;
                
                if (ticketInfoData != null) {
                    const emailSent = await sendMailNotification(`${ticketInfoData.emailSolicitante}`,`Ticket ${insertFields.idTicket} actualizado`, insertFields.detalleBitacora, insertFields.idTicket)                    
                }
            } else if (campo == 'ticketStatusSla'){
                let traduccionPauseOpenAntes = '';
                
                if (valorDespues == 'open' ) {
                    traduccionPauseOpenAntes = 'reactivado';
                } else {
                    traduccionPauseOpenAntes = 'pausado';
                }
                insertFields.detalleBitacora = `El ticket se ha ${traduccionPauseOpenAntes}`
            }
            else {
                insertFields.detalleBitacora = `El campo ${campo} cambio de ${valorAntes} a ${valorDespues}`        
            }
            // Si hay cambios, guardar en la bitácora
            if (valorAntes !== valorDespues) {
                await db.model_ticket_bitacora.create(insertFields);
                
                
            }    
        }
    });
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

const insertTicketProvider = async (req, res) => {
    try {
        const uuid = uuidv4();

        let responseResult = { success: false, message: 'Sin información para mostrar', JsonData: [], count: 0 };

        if (!req.params.idProvider) {
            responseResult = { success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador` };
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

        if (!req.body.idTicketExternoProveedor) {
            responseResult = { success: false, message: `idTicketExternoProveedor is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.idUbicacion) {
            responseResult = { success: false, message: `idUbicacion is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        if (!req.body.idCategoriaNivelUno) {
            responseResult = { success: false, message: `idCategoriaNivelUno is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        if (!req.body.idCategoriaNivelDos) {
            responseResult = { success: false, message: `idCategoriaNivelDos is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        if (!req.body.idCategoriaNivelTres) {
            responseResult = { success: false, message: `idCategoriaNivelTres is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        if (!req.body.idTipoTicket) {
            responseResult = { success: false, message: `idTipoTicket is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        if (!req.body.idEstatus) {
            responseResult = { success: false, message: `idEstatus is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.idPrioridad) {
            responseResult = { success: false, message: `idPrioridad is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.idSeveridad) {
            responseResult = { success: false, message: `idSeveridad is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.fechaPromesa) {
            responseResult = { success: false, message: `fechaPromesa is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!isValidDate(req.body.fechaPromesa)) {
            responseResult = { success: false, message: `fechaPromesa debe estar en formato yyyy-MM-dd HH:mm:ss`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.nombreSolicitante) {
            responseResult = { success: false, message: `nombreSolicitante is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.descipcionSolicitud) {
            responseResult = { success: false, message: `descipcionSolicitud is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.emailSolicitante) {
            responseResult = { success: false, message: `emailSolicitante is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        //Mapeo de tipo servicio
        const tipoServicioInfo = await db.model_ticket_tiposervicio_proveedor.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                idTipoServicioProveedor: req.body.idTipoTicket,
                idProvider: req.params.idProvider
            }
        });

        if (!tipoServicioInfo) {
            responseResult = { success: false, message: 'El idTipoTicket no esta configurado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        let idTipoServicio = tipoServicioInfo.idTipoServicio;

        //Mapeo de Tipo Estatus
        const statusInfo = await db.mdoel_ticket_estatus_proveedor.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                idEstatusProveedor: req.body.idEstatus,
                idProvider: req.params.idProvider
            }
        });

        if (!statusInfo) {
            responseResult = { success: false, message: 'El idEstatus no esta configurado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        let idEstatus = statusInfo.idEstatus;

        //Mapeo id prioridad
        const prioridadInfo = await db.model_ticket_prioridad_proveedor.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                idTipoPrioridadProveedor: req.body.idPrioridad,
                idProvider: req.params.idProvider
            }
        });

        if (!prioridadInfo) {
            responseResult = { success: false, message: 'El idPrioridad no esta configurado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        let idPrioridad = prioridadInfo.idTipoPrioridad;

        //Mapeo id severidad
        const severidadInfo = await db.model_ticket_severidad_proveedor.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                idTipoSeveridadProveedor: req.body.idSeveridad,
                idProvider: req.params.idProvider
            }
        });

        if (!severidadInfo) {
            responseResult = { success: false, message: 'El idSeveridad no esta configurado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        let idSeveridad = severidadInfo.idTipoSeveridad;

        const insertFields = {
            idEmpresa: 1,
            newIdTicket: uuid,
            idTicketExternoProveedor: req.body.idTicketExternoProveedor,
            idUbicacion: req.body.idUbicacion,
            idCategoriaNivelUno: req.body.idCategoriaNivelUno,
            idCategoriaNivelDos: req.body.idCategoriaNivelDos,
            idCategoriaNivelTres: req.body.idCategoriaNivelTres,
            idTipoTicket: idTipoServicio,
            idEstatus: idEstatus,
            idPrioridad: idPrioridad,
            idClienteSolicitante: 1,
            idServicioProySolicitante: req.params.idProvider,
            idProveedorSolicita: req.params.idProvider,
            idEmpleadoSolicita: req.params.idEmpleadoProvider,
            nombreSolicitante: req.body.nombreSolicitante,
            emailSolicitante: req.body.emailSolicitante,
            descipcionSolicitud: req.body.descipcionSolicitud,
            idSeveridad: idSeveridad,
            segmentacionInmuebleDetalle: req.body.segmentacionInmuebleDetalle,
            idMesa: 1,
            idCanalTicket: 10,
            fechaPromesa: req.body.fechaPromesa,
            AUDITORIA_USU_ALTA: req.params.idEmpleadoProvider,
            AUDITORIA_USU_ULT_MOD: req.params.idEmpleadoProvider
        };


        const insertRowData = await db.model_ticket_alta_services.create(insertFields);
        console.log(insertRowData);
        if (insertRowData) {
            responseResult = {
                success: true, message: 'Ticket creado correctamente',
                JsonData: {
                    newIdTicket: insertRowData.newIdTicket,
                    idTicket: insertRowData.idTicket,
                    idTicketExternoProveedor: insertRowData.idTicketExternoProveedor
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

const updateEstatusTicket = async (req, res) => {
    const { idProvider } = req.params;
    let responseResult = { success: false, message: 'Sin información para mostrar', JsonData: [], count: 0 };

    try {
        if (idProvider != req.params.idProvider) {
            responseResult = { success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador` };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.idEmpresa) {
            responseResult = { success: false, message: `idEmpresa is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.newIdTicket) {
            responseResult = { success: false, message: `newIdTicket is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.idEmpleadoProvider) {
            responseResult = { success: false, message: `provider_id_emp is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.idEstatus) {
            responseResult = { success: false, message: `idEstatus is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        //Mapeo de Tipo Estatus
        const statusInfo = await db.mdoel_ticket_estatus_proveedor.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                idEstatusProveedor: req.body.idEstatus,
                idProvider: req.params.idProvider
            }
        });

        if (!statusInfo) {
            responseResult = { success: false, message: 'El idEstatus no esta configurado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        let idEstatus = statusInfo.idEstatus;
        //Mapeo de Tipo Estatus

        // Obtener detalles del estatus a actualizar
        const estatusTicket = await db.model_ticket_estatus.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                id:idEstatus,
                idProvider: req.params.idProvider
            }
        });

        if (!estatusTicket) {
            responseResult = { success: false, message: 'El idEstatus no esta configurado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }
        let claveEstatusTicket = estatusTicket.clave;
        // Obtener detalles del estatus a actualizar

        // Obtiene informacion del ticket actualizar
        const ticketInfo = await db.model_ticket_services.findOne({
            include: [
                {model: db.model_ticket_estatus, as: 'assoEstatusTicket', attributes: ['id', 'descripcion', 'clave']},
            ],
            where: {
                idEmpresa: req.provider_emphost,
                idProveedorSolicita: req.params.idProvider,
                newIdTicket: req.body.newIdTicket
            }
        });

        if (!ticketInfo) {
            responseResult = { success: false, message: 'El ticket no fue localizado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }
        
        // Obtiene informacion del ticket actualizar

        //Valida si el ticket se encuentra en estatus cerrado o cancelado
        const estatusNoPermitidos = ['CANCELADO', 'CERRADO'];
        if (estatusNoPermitidos.includes(ticketInfo.assoEstatusTicket.clave)) {
            responseResult = { success: false, message: 'El ticket tiene un estatus de ' + ticketInfo.assoEstatusTicket.clave + ' no se puede actualizar.', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }
        //Valida si el ticket se encuentra en estatus cerrado o cancelado

        //Asigna valores a los campos que se actualizaran
        const updateFields = {
            AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider,
            AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP'),
            idEstatus: idEstatus
        };

        if (estatusTicket.cierraTicket){
            if (!req.body.descipcionSolucion) {
                responseResult = { success: false, message: 'descipcionSolucion is required', JsonData: [], count: 0 };
                res.status(403).json(responseResult);
                return;
            }
        }

        if (req.body.descipcionSolucion) {
            updateFields.descipcionSolucion = req.body.descipcionSolucion;
        }

        if (!ticketInfo.fechaRecepcion){
            updateFields.fechaRecepcion =  db.sequelize.literal('CURRENT_TIMESTAMP');
            updateFields.duracionRecepcion = db.sequelize.literal(`TIMESTAMPDIFF(SECOND, TIC_FECHA_ALTA, CURRENT_TIMESTAMP)`);
        }

        if (estatusTicket.cierraTicket) {
            updateFields.fechaCierre = db.sequelize.literal('CURRENT_TIMESTAMP');
            updateFields.fechaCierreSola = db.sequelize.literal('CURRENT_TIMESTAMP');
            updateFields.fechaCierreHora = db.sequelize.literal('CURRENT_TIMESTAMP');
        }

        if (claveEstatusTicket === 'CERRADO'){
            updateFields.ticketCerrado = true;
        }
        //Asigna valores a los campos que se actualizaran


        //Genera logs SLA a actualizar
        const previousPauseLog = await db.model_ticket_logs_sla.findOne({
            where: {
                newIdTicket: req.body.newIdTicket,
                fecha_hora_fin: {
                    [Op.is]: null
                }
            }
        });

        if (estatusTicket.cierraTicket){
            if (previousPauseLog) {
                const updateFieldsLogs = {
                    AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider,
                    AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP'),
                    fecha_hora_fin: db.sequelize.literal('CURRENT_TIMESTAMP')
                };

                const [updatedRowsLogsCount] = await db.model_ticket_logs_sla.update(
                    updateFieldsLogs,
                    {
                        where: {
                            idEmpresa: req.body.idEmpresa,
                            newIdTicket: req.body.newIdTicket,
                            id: previousPauseLog.id
                        }
                        //returning: true // Devuelve los registros actualizados
                    }
                );
            }
        }

        if (estatusTicket.pausaTicket) {
            // Actualizar la fecha de fin del logs anterior
            if (previousPauseLog) {
                console.log(previousPauseLog.id);
                const updateFieldsLogs = {
                    AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider,
                    AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP'),
                    fecha_hora_fin: db.sequelize.literal('CURRENT_TIMESTAMP')
                };

                const [previousResumeLog, updatedRows] = await db.model_ticket_logs_sla.update(
                    updateFieldsLogs,
                    {
                        where: {
                            idEmpresa: req.body.idEmpresa,
                            newIdTicket: req.body.newIdTicket,
                            id: previousPauseLog.id
                        }
                    }
                );
            }

            // Registrar la pausa
            const insertRowData = await db.model_ticket_logs_sla.create({
                idEmpresa: req.body.idEmpresa,
                newIdTicket: req.body.newIdTicket,
                action_status: 'pause',
                AUDITORIA_USU_ALTA: req.body.idEmpleadoProvider,
                AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider
            });
            updateFields.ticketStatusSla = 'pause';
            console.log("insertRowData " + insertRowData);

        } else {
            // Actualizar la fecha de fin del logs anterior si es pausa
            if (previousPauseLog && previousPauseLog.action_status === 'pause') {
                console.log(previousPauseLog.id);
                const updateFieldsLogs = {
                    AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider,
                    AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP'),
                    fecha_hora_fin: db.sequelize.literal('CURRENT_TIMESTAMP')
                };

                const [previousResumeLog, updatedRows] = await db.model_ticket_logs_sla.update(
                    updateFieldsLogs,
                    {
                        where: {
                            idEmpresa: req.body.idEmpresa,
                            newIdTicket: req.body.newIdTicket,
                            id: previousPauseLog.id
                        }
                    }
                );
                console.log(previousResumeLog + " - " + updatedRows)

                if (!estatusTicket.cierraTicket) {
                    // Registrar la Resumen
                    const insertRowData = await db.model_ticket_logs_sla.create({
                        idEmpresa: req.body.idEmpresa,
                        newIdTicket: req.body.newIdTicket,
                        action_status: 'resume',
                        AUDITORIA_USU_ALTA: req.body.idEmpleadoProvider,
                        AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider
                    });

                    updateFields.ticketStatusSla = 'open';
                    console.log("insertRowData " + insertRowData);
                }
               
           }
        }
        //Genera logs SLA a actualizar

        // Actualiza estatus ticket
        const keysUpdateFields = Object.keys(updateFields);
        keysUpdateFields.push('idTicket');

        // Obtener el registro antes de la actualización
        const registroAntes = await db.model_ticket_services.findOne({
            attributes: keysUpdateFields,
            where: {
                idEmpresa: req.body.idEmpresa,
                newIdTicket: req.body.newIdTicket,
                idProveedorSolicita: req.params.idProvider
            }
        });

        const [updatedRowsCount, updatedRows] = await db.model_ticket_services.update(
            updateFields,
            {
                where: {
                    idEmpresa: req.body.idEmpresa,
                    newIdTicket: req.body.newIdTicket,
                    idProveedorSolicita: req.params.idProvider
                }
                //returning: true // Devuelve los registros actualizados
            }
        );
        if (updatedRowsCount > 0) {
            // Obtener el registro después de la actualización
            const registroDespues = await db.model_ticket_services.findOne({
                attributes: keysUpdateFields,
                where: {
                    idEmpresa: req.body.idEmpresa,
                    newIdTicket: req.body.newIdTicket,
                    idProveedorSolicita: req.params.idProvider
                }
            });

            // Guardar en la bitácora los cambios realizados
            await guardarBitacora(registroAntes, registroDespues, req.body.idEmpleadoProvider, req.body.idEmpresa, req.params.idProvider,ticketInfo);

            responseResult = { success: true, message: 'Registro actualizado correctamente', JsonData: [], count: updatedRowsCount };
            res.json(responseResult);
        } else {
            responseResult = { success: false, message: 'No se encontró el registro para actualizar o no se detctaron cambios' };
            res.json(responseResult);
        }



    } catch (error) {
        responseResult = { success: false, message: `Error al actualizar el registro -> ${error}` };
        let responseResultLog = { success: false, message: `Error al actualizar el registro -> ${error}`, dataBody: req.body };
        loggerToken.error(JSON.stringify(responseResultLog));
        res.status(500).json(responseResult);
    }
};

const CancelarTicket = async (req, res) => {
    const {idProvider } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};

    if (idProvider != req.params.idProvider) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }

    if (!req.body.idEmpresa) {
        responseResult = { success: false, message: `idEmpresa is required`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!req.body.newIdTicket) {
        responseResult = { success: false, message: `newIdTicket is required`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!req.body.idEmpleadoProvider) {
        responseResult = { success: false, message: `idEmpleadoProvider is required`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (req.body.idEstatus <= 0 && req.body.idEstatus >= 1000) {
        responseResult = { success: false, message: 'Id Estatus no es valido', JsonData: [], count: 0 };
        return res.status(400).json(responseResult);
    }

    if (!req.body.descipcionCancelacion) {
        responseResult = { success: false, message: `descripcionCancelacion is required`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    try {
        const statusInfo = await db.model_ticket_estatus.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                clave: 'CANCELADO',
                idProvider: idProvider
            }
        });
          
        if (!statusInfo) {
            responseResult = { success: false, message: 'Operacion no valida, el ticket no se puede cancelar.', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        let idEstatus = statusInfo.id;


        const updateFields = {
            AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider,
            AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP'),
            idEstatus: idEstatus,
            fechaCierre: db.sequelize.literal('CURRENT_TIMESTAMP'),
            fechaCierreSola: db.sequelize.literal('CURRENT_TIMESTAMP'),
            fechaCierreHora: db.sequelize.literal('CURRENT_TIMESTAMP'),
            ticketCerrado: true,
            descipcionCancelacion:req.body.descipcionCancelacion
        };
        
        const keysUpdateFields = Object.keys(updateFields);
        keysUpdateFields.push('idTicket');
        
        // Obtener el registro antes de la actualización
        const registroAntes = await db.model_ticket_services.findOne({
            attributes: keysUpdateFields,
            where: {
                idEmpresa: req.body.idEmpresa,
                newIdTicket: req.body.newIdTicket,
                idProveedorSolicita: req.params.idProvider                
            }
        });

        const [updatedRowsCount, updatedRows] = await db.model_ticket_services.update(
            updateFields,
            {
                where: {
                    idEmpresa: req.body.idEmpresa,
                    newIdTicket: req.body.newIdTicket,
                    idProveedorSolicita:  req.params.idProvider                   
                }
                //returning: true // Devuelve los registros actualizados
            }
        );
        if (updatedRowsCount > 0) {
            // Obtener el registro después de la actualización
            const registroDespues = await db.model_ticket_services.findOne({
                attributes: keysUpdateFields,
                where: {
                    idEmpresa: req.body.idEmpresa,
                    newIdTicket: req.body.newIdTicket,
                    idProveedorSolicita:  req.params.idProvider
                }
            });
            
            // Guardar en la bitácora los cambios realizados
            await guardarBitacora(registroAntes, registroDespues,req.body.idEmpleadoProvider, req.body.idEmpresa, req.params.idProvider, null);

            responseResult = {success: true, message: 'Registro actualizado correctamente', JsonData: [], count:updatedRowsCount};
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

const insertTicketProviderSSI = async (req, res) => {
    try {
        const uuid = uuidv4();

        let responseResult = { success: false, message: 'Sin información para mostrar', JsonData: [], count: 0 };

        if (!req.params.idProvider) {
            responseResult = { success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador` };
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

        if (!req.body.idTicketExternoProveedor) {
            responseResult = { success: false, message: `idTicketExternoProveedor is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.idUbicacion) {
            responseResult = { success: false, message: `idUbicacion is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        if (!req.body.idCategoriaNivelUno) {
            responseResult = { success: false, message: `idCategoriaNivelUno is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        if (!req.body.idCategoriaNivelDos) {
            responseResult = { success: false, message: `idCategoriaNivelDos is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        if (!req.body.idCategoriaNivelTres) {
            responseResult = { success: false, message: `idCategoriaNivelTres is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        if (!req.body.idTipoTicket) {
            responseResult = { success: false, message: `idTipoTicket is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }


        if (!req.body.idEstatus) {
            responseResult = { success: false, message: `idEstatus is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.idPrioridad) {
            responseResult = { success: false, message: `idPrioridad is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.idSeveridad) {
            responseResult = { success: false, message: `idSeveridad is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.fechaPromesa) {
            responseResult = { success: false, message: `fechaPromesa is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!isValidDate(req.body.fechaPromesa)) {
            responseResult = { success: false, message: `fechaPromesa debe estar en formato yyyy-MM-dd HH:mm:ss`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.nombreSolicitante) {
            responseResult = { success: false, message: `nombreSolicitante is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.descipcionSolicitud) {
            responseResult = { success: false, message: `descipcionSolicitud is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.emailSolicitante) {
            responseResult = { success: false, message: `emailSolicitante is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        if (!req.body.tipoIncidente) {
            responseResult = { success: false, message: `tipoIncidente is required`, JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return
        }

        //Mapeo de tipo servicio
        const tipoServicioInfo = await db.model_ticket_tiposervicio_proveedor.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                idTipoServicioProveedor: req.body.idTipoTicket,
                idProvider: req.params.idProvider
            }
        });

        if (!tipoServicioInfo) {
            responseResult = { success: false, message: 'El idTipoTicket no esta configurado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        let idTipoServicio = tipoServicioInfo.idTipoServicio;

        //Mapeo de Tipo Estatus
        const statusInfo = await db.mdoel_ticket_estatus_proveedor.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                idEstatusProveedor: req.body.idEstatus,
                idProvider: req.params.idProvider
            }
        });

        if (!statusInfo) {
            responseResult = { success: false, message: 'El idEstatus no esta configurado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        let idEstatus = statusInfo.idEstatus;

        //Mapeo id prioridad
        const prioridadInfo = await db.model_ticket_prioridad_proveedor.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                idTipoPrioridadProveedor: req.body.idPrioridad,
                idProvider: req.params.idProvider
            }
        });

        if (!prioridadInfo) {
            responseResult = { success: false, message: 'El idPrioridad no esta configurado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        let idPrioridad = prioridadInfo.idTipoPrioridad;

        //Mapeo id severidad
        const severidadInfo = await db.model_ticket_severidad_proveedor.findOne({
            where: {
                idEmpresa: req.provider_emphost,
                idTipoSeveridadProveedor: req.body.idSeveridad,
                idProvider: req.params.idProvider
            }
        });

        if (!severidadInfo) {
            responseResult = { success: false, message: 'El idSeveridad no esta configurado en el sistema', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
        }

        let idSeveridad = severidadInfo.idTipoSeveridad;



        const insertFields = {
            idEmpresa: 1,
            newIdTicket: uuid,
            idTicketExternoProveedor: req.body.idTicketExternoProveedor,
            idUbicacion: req.body.idUbicacion,
            idCategoriaNivelUno: req.body.idCategoriaNivelUno,
            idCategoriaNivelDos: req.body.idCategoriaNivelDos,
            idCategoriaNivelTres: req.body.idCategoriaNivelTres,
            idTipoTicket: idTipoServicio,
            idEstatus: idEstatus,
            idPrioridad: idPrioridad,
            idClienteSolicitante: 1,
            idServicioProySolicitante: req.params.idProvider,
            idProveedorSolicita: req.params.idProvider,
            idEmpleadoSolicita: req.params.idEmpleadoProvider,
            nombreSolicitante: req.body.nombreSolicitante,
            emailSolicitante: req.body.emailSolicitante,
            descipcionSolicitud: req.body.descipcionSolicitud,
            idSeveridad: idSeveridad,
            segmentacionInmuebleDetalle: req.body.segmentacionInmuebleDetalle,
            idMesa: 1,
            idCanalTicket: 10,
            fechaPromesa: req.body.fechaPromesa,
            tipoIncidente: req.body.tipoIncidente,
            AUDITORIA_USU_ALTA: req.params.idEmpleadoProvider,
            AUDITORIA_USU_ULT_MOD: req.params.idEmpleadoProvider
        };


        const insertRowData = await db.model_ticket_alta_services.create(insertFields);
        console.log(insertRowData);
        if (insertRowData) {
            responseResult = {
                success: true, message: 'Ticket creado correctamente',
                JsonData: {
                    newIdTicket: insertRowData.newIdTicket,
                    idTicket: insertRowData.idTicket,
                    idTicketExternoProveedor: insertRowData.idTicketExternoProveedor
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

const get_Ticket_Foto = async (req, res) => {
    const { idProvider, newIdTicket } = req.params;

    let responseResult = { success: false, message: 'Sin información para mostrar', JsonData: [], count: 0 };

    if (idProvider != req.provider_id) {
        responseResult = { success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador` };
        res.status(403).json(responseResult);
        return
    }

    try {
        const ticketsFotosResult = await db.model_ticket_fotos.findAll({
            attributes: {
                exclude: ['AUDITORIA_USU_ALTA', 'AUDITORIA_USU_ULT_MOD', 'AUDITORIA_FEC_ALTA', 'AUDITORIA_FEC_ULT_MOD',
                    'url','fechaAltaOrigen','numeroImagen','geoLatitud','geoLongitud','desdeCamara','newIdImagen'
                ],
                include:[
                    [db.Sequelize.literal(`CONCAT('${serverConfig.URL_RETURN_STORAGE}/anam/TICKET/',TIC_NEWID, '/',TICKET_IMAGEN_RUTA, '.',TICKET_MIMETYPE_SISTEMA)`), 'urlTemporal']
                ]
            },
            where: {
                idEmpresa: req.provider_emphost,
                newIdTicket: newIdTicket,
                activo: 1
            }
        })
        
        if (ticketsFotosResult.length == 0) {
            responseResult = { success: false, message: 'No se localizaron datos' };
        } else {
            responseResult = { success: true, message: 'Success get', JsonData: ticketsFotosResult, count: ticketsFotosResult.length };
        }


        res.json(responseResult);

    } catch (error) {
        console.log(error);

        loggerToken.error(JSON.stringify({ errorDescription: error, dataBody: req.body }));
        if (error.name === 'SequelizeUniqueConstraintError') {
            responseResult = { success: false, message: 'Ya existe un token para este proveedor.' };
            return res.status(200).json(responseResult);
        } else if (error.name === 'SequelizeDatabaseError') {
            responseResult = { success: false, message: 'Error en el consumo, valide la documentación.' };
            return res.status(400).json(responseResult);
        }
        responseResult = { success: false, message: `Error al cosumir el servicio ${error.name}` };
        res.status(200).json(responseResult);
    }

};

const get_Ticket_Documentos = async (req, res) => {
        const { idProvider, newIdTicket } = req.params;

        let responseResult = { success: false, message: 'Sin información para mostrar', JsonData: [], count: 0 };
    
        if (idProvider != req.provider_id) {
            responseResult = { success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador` };
            res.status(403).json(responseResult);
            return
        }

        try {
            const ticketsFotosResult = await db.model_ticket_documentos.findAll({
                attributes: {
                    exclude: ['AUDITORIA_USU_ALTA', 'AUDITORIA_USU_ULT_MOD', 'AUDITORIA_FEC_ALTA', 'AUDITORIA_FEC_ULT_MOD',
                        'numeroFoto', 'url','newIdDocumento'],
                    include: [
                        [db.Sequelize.literal(`CONCAT('${serverConfig.URL_RETURN_STORAGE}/anam/TICKET/',TIC_NEWID, '/',TICKET_FILE_RUTA, '.',TICKET_FILE_MIMETYPE_SISTEMA)`), 'urlTemporal']
                    ]
                },
                where: {
                    idEmpresa: req.provider_emphost,
                    newIdTicket: newIdTicket,
                    activo: 1
                }
            })
    
            if (ticketsFotosResult.length == 0) {
                responseResult = { success: false, message: 'No se localizaron datos' };
            } else {
                responseResult = { success: true, message: 'Success get', JsonData: ticketsFotosResult, count: ticketsFotosResult.length };
            }
    
            res.json(responseResult);
    
        } catch (error) {
            console.log(error);
    
            loggerToken.error(JSON.stringify({ errorDescription: error, dataBody: req.body }));
            if (error.name === 'SequelizeUniqueConstraintError') {
                responseResult = { success: false, message: 'Ya existe un token para este proveedor.' };
                return res.status(200).json(responseResult);
            } else if (error.name === 'SequelizeDatabaseError') {
                responseResult = { success: false, message: 'Error en el consumo, valide la documentación.' };
                return res.status(400).json(responseResult);
            }
            responseResult = { success: false, message: `Error al cosumir el servicio ${error.name}` };
            res.status(200).json(responseResult);
        }



    

       
};

const pauseTicket = async (req, res) => {
    const {idProvider } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};

    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }

    if (!req.body.idEmpresa) {
        responseResult = { success: false, message: `idEmpresa is required`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!req.body.newIdTicket) {
        responseResult = { success: false, message: `newIdTicket is required`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!req.body.idEmpleadoProvider) {
        responseResult = { success: false, message: `idEmpleadoProvider is required`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    try {
        const ticketsResult = await db.model_ticket_services.findOne({
            where: {
                //idProveedorSolicita: req.params.idProvider,
                idEmpresa: req.body.idEmpresa,
                newIdTicket: req.body.newIdTicket
            }
        })
        //if (!ticketsResult || ticketsResult.status !== 'open') {
        if (!ticketsResult || ticketsResult.ticketCerrado == true || ticketsResult.ticketStatusSla !== 'open') {
            responseResult = { success: false, message: 'El ticket no fue localizado o ya esta cerrado o esta en pausa', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
            //throw new Error('Ticket no encontrado o no está abierto.');
        }
        // Actualizar el estado del ticket a 'paused'

        const updateFields = {
            AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider,
            AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP'),
            ticketStatusSla: 'pause'
        };

        const [updatedRowsCount, updatedRows] = await db.model_ticket_services.update(
            updateFields,
            {
                where: {
                    idEmpresa: req.body.idEmpresa,
                    newIdTicket: req.body.newIdTicket,
                    //idProveedorSolicita:  req.params.idProvider                   
                }
            }
        );

        // Actualiza registro previo activo
        // Actualizar la fecha de fin de la pausa anterior
        const previousPauseLog = await db.model_ticket_logs_sla.findOne({
            where: {
                newIdTicket: req.body.newIdTicket,
                action_status: 'resume',
                fecha_hora_fin: null // Asumimos que este campo es nulo si está activo
            }
        });

        const updateFieldsLogs = {
            AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider,
            AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP'),
            fecha_hora_fin: db.sequelize.literal('CURRENT_TIMESTAMP')
        };

        if (previousPauseLog) {
            console.log(previousPauseLog.id);
            
            const [previousResumeLog, updatedRows] = await db.model_ticket_logs_sla.update(
                updateFieldsLogs,
                {
                    where: {
                        idEmpresa: req.body.idEmpresa,
                        newIdTicket: req.body.newIdTicket,   
                        id: previousPauseLog.id              
                    }
                }
            );
        }
        
        // Registrar la pausa
        const insertRowData = await db.model_ticket_logs_sla.create({ idEmpresa: req.body.idEmpresa, newIdTicket: req.body.newIdTicket, action_status: 'pause', AUDITORIA_USU_ALTA: req.body.idEmpleadoProvider, AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider  });
            
        if (insertRowData) {
            responseResult = {success: true, message: 'Pausa insertada correctamente', JsonData: [], count:1};
            res.status(200).json(responseResult);
        } else {
            responseResult = {success: false, message: 'Error al insertar la pausa'};
            res.status(200).json(responseResult);
        }

    } catch (error) {
        responseResult = {success: false, message: `Error al actualizar el registro -> ${error}`};
        let responseResultLog = {success: false, message: `Error al actualizar el registro -> ${error}`, dataBody: req.body};
        loggerToken.error(JSON.stringify(responseResultLog));
        res.status(500).json(responseResult);
    }
};

const getCatalogoCategorizaciones = async (req, res) => {
    const { idProvider } = req.params;
    //const { idEmpresa } = req.query;
    let responseResult = { success: false, message: 'Sin información para mostrar', JsonData: [], count: 0 };
    if (idProvider != req.provider_id) {
        responseResult = { success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador` };
        res.status(403).json(responseResult);
        return
    }
    try {
        const query = `
            SELECT 
            HIJO.TIPIFICA_CSC AS idCategoriaNivelUno
            ,HIJO.TIPIFICA_IDIOMA1 AS CategoriaNivelUno
            ,PADRE.TIPIFICA_CSC AS idCategoriaNivelDos
            ,PADRE.TIPIFICA_IDIOMA1 AS CategoriaNivelDos
            ,SAMT_CAM_TIPIFICACIONES.TIPIFICA_CSC as idCategoriaNivelTres
            ,SAMT_CAM_TIPIFICACIONES.TIPIFICA_IDIOMA1 AS CategoriaNivelTres
            FROM SAMT_CAM_TIPIFICACIONES
            LEFT JOIN SAMT_CAM_TIPIFICACIONES AS PADRE
            ON SAMT_CAM_TIPIFICACIONES.TIPIFICA_PARENT = PADRE.TIPIFICA_CSC
            LEFT JOIN SAMT_CAM_TIPIFICACIONES AS HIJO
            ON  PADRE.TIPIFICA_PARENT = HIJO.TIPIFICA_CSC
            WHERE SAMT_CAM_TIPIFICACIONES.EMP_CSC_EMPRESA_HOST = ${req.provider_emphost}
            AND SAMT_CAM_TIPIFICACIONES.CAT_TIPO_TIPIFICA_CSC =
            (
            SELECT TIPIFICA_CSC FROM SAMT_CAM_SERVICIO 
            WHERE SAMT_CAM_SERVICIO.CAM_CSC_SERVICIO = ${idProvider}
            )
            AND HIJO.TIPIFICA_IDIOMA1 IS NOT NULL
            AND SAMT_CAM_TIPIFICACIONES.TIPIFCA_ACTIVO=1;`;

        const categorizacionesResult = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (categorizacionesResult.length == 0) {
            responseResult = { success: false, message: 'No se localizaron datos' };
        } else {
            responseResult = { success: true, message: 'Success get', JsonData: categorizacionesResult, count: categorizacionesResult.length };
        }

        res.json(responseResult);

    } catch (error) {
        console.log(error);

        loggerToken.error(JSON.stringify({ errorDescription: error, dataBody: req.body }));
        if (error.name === 'SequelizeUniqueConstraintError') {
            responseResult = { success: false, message: 'Ya existe un token para este proveedor.' };
            return res.status(200).json(responseResult);
        } else if (error.name === 'SequelizeDatabaseError') {
            responseResult = { success: false, message: 'Error en el consumo, valide la documentación.' };
            return res.status(400).json(responseResult);
        }
        responseResult = { success: false, message: `Error al cosumir el servicio ${error.name}` };
        res.status(200).json(responseResult);
    }
};

const getNewTicketsSiadeconsrv = async (req, res) => {
    const { idProvider } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }
    try {
        const ticketsResult = await db.model_ticket_services.findAll({
            attributes: {
                include: [
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_PROMESA'), '%Y-%m-%d %H:%i:%s'), 'fechaPromesa'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ALTA'), '%Y-%m-%d %H:%i:%s'), 'fechaAlta'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_SOLICITA'), '%Y-%m-%d %H:%i:%s'), 'fechaClienteSolicita'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE'), '%Y-%m-%d %H:%i:%s'), 'fechaCierre'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE_SISTEMA'), '%Y-%m-%d %H:%i:%s'), 'fechaCierreAutomatico'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ENTREGA_PROVEEDOR'), '%Y-%m-%d %H:%i:%s'), 'fechaEntregaProveedor'],
                ],
                exclude: ['AUDITORIA_USU_ALTA', 'AUDITORIA_USU_ULT_MOD', 'AUDITORIA_FEC_ALTA', 'AUDITORIA_FEC_ULT_MOD']
            },
            include: [
                {model: db.model_ticket_estatus, as: 'assoEstatusTicket', attributes: ['id', 'descripcion', 'clave'], where: {clave: 'DEFAULT'}},
                {model: db.model_ticket_prioridad, as: 'assoPrioridadTicket', attributes: ['id', 'descripcion', 'slaTiempo']},
                {model: db.model_ticket_requisicion, as: 'assoRequisicionTicket', attributes: ['idReq', 'nombreReq']},
                {model: db.model_ticket_severidad, as: 'assoSeveridadTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tipoticket, as: 'assoTipoTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tiposervicio, as: 'assoTipoCanalTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelUnoTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelDosTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelTresTicket', attributes: ['id', 'descripcion', 'slaEjecucion']},
                {model: db.model_ticket_siadeconsrv, as: 'assoDatosAdicionales', attributes: ['Nombres', 'ApellidoPaterno', 'ApellidoMaterno', 'RFC', 'MailInstitucional', 'Aduana', 'PuntoTactico', 'Area', 'Jerarquia', 'Vin', 'Placa', 'EntidadFederativa', 'Pais', 'NombreListaNegra'] }
            ],
            where: {
                idProveedorSolicita: { [Op.in]: [req.provider_id] },
                idEmpresa: req.provider_emphost,
               //'$assoEstatusTicket.clave$': 'DEFAULT'
            }
        })

        if (ticketsResult.length == 0) {
            responseResult = {success: false, message: 'No se localizaron datos'};
        } else {
            responseResult = {success: true, message: 'Success get', JsonData: ticketsResult, count:ticketsResult.length};
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

const getTicketsSiadeconsrvById = async (req, res) => {
    const { idProvider, newIdTicket } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }
    try {
        const ticketsResult = await db.model_ticket_services.findAll({
            attributes: {
                include: [
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_PROMESA'), '%Y-%m-%d %H:%i:%s'), 'fechaPromesa'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ALTA'), '%Y-%m-%d %H:%i:%s'), 'fechaAlta'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_SOLICITA'), '%Y-%m-%d %H:%i:%s'), 'fechaClienteSolicita'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE'), '%Y-%m-%d %H:%i:%s'), 'fechaCierre'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE_SISTEMA'), '%Y-%m-%d %H:%i:%s'), 'fechaCierreAutomatico'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ENTREGA_PROVEEDOR'), '%Y-%m-%d %H:%i:%s'), 'fechaEntregaProveedor'],
                ],
                exclude: ['AUDITORIA_USU_ALTA', 'AUDITORIA_USU_ULT_MOD', 'AUDITORIA_FEC_ALTA', 'AUDITORIA_FEC_ULT_MOD']
            },
            include: [
                {model: db.model_ticket_estatus, as: 'assoEstatusTicket', attributes: ['id', 'descripcion', 'clave']},
                {model: db.model_ticket_prioridad, as: 'assoPrioridadTicket', attributes: ['id', 'descripcion', 'slaTiempo']},
                {model: db.model_ticket_requisicion, as: 'assoRequisicionTicket', attributes: ['idReq', 'nombreReq']},
                {model: db.model_ticket_severidad, as: 'assoSeveridadTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tipoticket, as: 'assoTipoTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tiposervicio, as: 'assoTipoCanalTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelUnoTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelDosTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelTresTicket', attributes: ['id', 'descripcion', 'slaEjecucion']},
                {model: db.model_ticket_siadeconsrv, as: 'assoDatosAdicionales', attributes: ['Nombres', 'ApellidoPaterno', 'ApellidoMaterno', 'RFC', 'MailInstitucional', 'Aduana', 'PuntoTactico', 'Area', 'Jerarquia', 'Vin', 'Placa', 'EntidadFederativa', 'Pais', 'NombreListaNegra'] },
            ],
            where: {
                idProveedorSolicita: { [Op.in]: [req.provider_id] },
                idEmpresa: req.provider_emphost,
                newIdTicket: newIdTicket
            }
        })

        if (ticketsResult.length == 0) {
            responseResult = {success: false, message: 'No se localizaron datos'};
        } else {
            responseResult = {success: true, message: 'Success get', JsonData: ticketsResult, count:ticketsResult.length};
        }
        
        res.json(responseResult);

    } catch (error) {
        
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

const resumeTicket = async (req, res) => {
    const {idProvider } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};

    if (idProvider != req.params.idProvider) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }

    if (!req.body.idEmpresa) {
        responseResult = { success: false, message: `idEmpresa is required`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!req.body.newIdTicket) {
        responseResult = { success: false, message: `newIdTicket is required`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!req.body.idEmpleadoProvider) {
        responseResult = { success: false, message: `idEmpleadoProvider is required`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    try {
        const ticketsResult = await db.model_ticket_services.findOne({
            where: {
                //idProveedorSolicita: req.params.idProvider,
                idEmpresa: req.body.idEmpresa,
                newIdTicket: req.body.newIdTicket
            }
        })
        
        //if (!ticketsResult || ticketsResult.status !== 'open') {
        if (!ticketsResult || ticketsResult.ticketCerrado == true || ticketsResult.ticketStatusSla !== 'pause') {
            responseResult = { success: false, message: 'Ticket no encontrado o no está en pausa.', JsonData: [], count: 0 };
            res.status(403).json(responseResult);
            return;
            //throw new Error('Ticket no encontrado o no está abierto.');
        }
        // Actualizar el estado del ticket a 'paused'
        const updateFields = {
            AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider,
            AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP'),
            ticketStatusSla: 'open'
        };

        const [updatedRowsCount, updatedRows] = await db.model_ticket_services.update(
            updateFields,
            {
                where: {
                    idEmpresa: req.body.idEmpresa,
                    newIdTicket: req.body.newIdTicket,
                    //idProveedorSolicita:  req.params.idProvider                   
                }
            }
        );
        

        // Actualiza registro previo activo
        // Actualizar la fecha de fin de la pausa anterior
        const previousPauseLog = await db.model_ticket_logs_sla.findOne({
            where: {
                newIdTicket: req.body.newIdTicket,
                action_status: 'pause',
                fecha_hora_fin: null // Asumimos que este campo es nulo si está activo
            }
        });

        const updateFieldsLogs = {
            AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider,
            AUDITORIA_FEC_ULT_MOD: db.sequelize.literal('CURRENT_TIMESTAMP'),
            fecha_hora_fin: db.sequelize.literal('CURRENT_TIMESTAMP')
        };

        if (previousPauseLog) {
            console.log(previousPauseLog.id);
            
            const [previousResumeLog, updatedRows] = await db.model_ticket_logs_sla.update(
                updateFieldsLogs,
                {
                    where: {
                        idEmpresa: req.body.idEmpresa,
                        newIdTicket: req.body.newIdTicket,   
                        id: previousPauseLog.id              
                    }
                }
            );
        }




        // Registrar la pausa
        const insertRowData = await db.model_ticket_logs_sla.create({ idEmpresa: req.body.idEmpresa, newIdTicket: req.body.newIdTicket, action_status: 'resume', AUDITORIA_USU_ALTA: req.body.idEmpleadoProvider, AUDITORIA_USU_ULT_MOD: req.body.idEmpleadoProvider  });
            
        if (insertRowData) {
            responseResult = {success: true, message: 'Ticket activado correctamente', JsonData: insertRowData, count:1};
            res.status(200).json(responseResult);
        } else {
            responseResult = {success: false, message: 'Error al reactivar ticket'};
            res.status(200).json(responseResult);
        }

    } catch (error) {
        responseResult = {success: false, message: `Error al actualizar el registro -> ${error}`};
        let responseResultLog = {success: false, message: `Error al actualizar el registro -> ${error}`, dataBody: req.body};
        loggerToken.error(JSON.stringify(responseResultLog));
        res.status(500).json(responseResult);
    }
};

const insertMensajeTicketByNewId = async (req, res) => {
    const { idProvider, newIdTicket } = req.params;
    const { nombreEmpleado, asuntoMensaje, descripcionMensaje,
        leidoOperadorDts, leidoClienteDts, msgClaveDts
    } = req.body;
    console.log(req.body);
    /*
    {
  "asuntoMensaje": "AUNTO",
  "nombreEmpleado": "RGB",
"descripcionMensaje": "Descripcion",
"leidoOperadorDts": false,
"leidoClienteDts":  false,
"msgClaveDts": "OPERADOR"

}
    */
    
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }

    if (!newIdTicket) {
        responseResult = { success: false, message: `newIdTicket is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!nombreEmpleado) {
        responseResult = { success: false, message: `nombreEmpleado is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }


    if (nombreEmpleado.length > 100) {
        responseResult = { success: false, message: `nombreEmpleado supera el limite de caracteres permitidos (100)`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!asuntoMensaje) {
        responseResult = { success: false, message: `asuntoMensaje is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (asuntoMensaje.length > 100) {
        responseResult = { success: false, message: `asuntoMensaje supera el limite de caracteres permitidos (100)`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (!descripcionMensaje) {
        responseResult = { success: false, message: `descripcionMensaje is required` , JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }

    if (descripcionMensaje.length > 5000) {
        responseResult = { success: false, message: `descripcionMensaje supera el limite de caracteres permitidos (5000)`, JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return
    }


    const ticketInfo = await db.model_ticket_services.findOne({
        attributes: ['idTicket','newIdTicket'],
        where: {
            idEmpresa: req.provider_emphost,
            newIdTicket: newIdTicket
        }
    });

    if (!ticketInfo) {
        responseResult = { success: false, message: 'El Ticket no fue localizado en sistema', JsonData: [], count: 0 };
        res.status(403).json(responseResult);
        return;
    }
    const uuid = uuidv4();
    const insertFields = {}
        
        insertFields.idEmpresa = req.provider_emphost;
        insertFields.idTicket = ticketInfo.idTicket;
        insertFields.idEmpleado = req.provider_id_emp;
        insertFields.respuestaAsunto = asuntoMensaje;
        insertFields.detalleRespuesta = descripcionMensaje;
        insertFields.idEstatusRespuesta = 1;
        insertFields.leidoOperador = leidoOperadorDts;
        insertFields.fechaLeidoOperador = db.sequelize.literal('CURRENT_TIMESTAMP');
        insertFields.leidoCliente = leidoClienteDts;
        insertFields.fechaLeidoCliente = db.sequelize.literal('CURRENT_TIMESTAMP');
        insertFields.mensajeClave = msgClaveDts;
        insertFields.mensajeNombreAlta = nombreEmpleado;
        insertFields.MensajeNewId = uuid;
        insertFields.ticketNewID = ticketInfo.newIdTicket; 
        insertFields.AUDITORIA_USU_ALTA = req.provider_id_emp;
        insertFields.AUDITORIA_USU_ULT_MOD = req.provider_id_emp;
        
        try {
            const insertRowData = await db.model_ticket_mensajes.create(insertFields);
            
            if (insertRowData) {
                responseResult = {success: true, message: 'Mensaje insertada correctamente', JsonData: {idBitacora: insertRowData.idBitacora }, count:1};
                res.json(responseResult);
            } else {
                responseResult = {success: false, message: 'Error al insertar el mensaje'};
                res.json(responseResult);
            }
        } catch (err) {
            loggerToken.error(JSON.stringify({errorDescription: err,dataBody: req.body}));
            if (err.name === 'SequelizeUniqueConstraintError') {
                responseResult = {success: false, message: 'Ya existe una mensaje.' , JsonData: null, count:0};
                return res.status(200).json(responseResult);
            } else if (err.name === 'SequelizeDatabaseError'){
                responseResult = {success: false, message: 'Error en el consumo, valide la documentación.' , JsonData: null, count:0};
                return res.status(400).json(responseResult);
            }
            responseResult = {success: false, message: `Error al insertar mensaje ${err.name}` , JsonData: null, count:0};
            res.status(200).json(responseResult);
        }
};

const getTicketsProviderCerrados = async (req, res) => {
    const { idProvider } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }
    try {
        const fechaInicio = new Date();
        fechaInicio.setHours(fechaInicio.getHours() - 48);

        const ticketsResult = await db.model_ticket_services.findAll({
            attributes: {
                include: [
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_PROMESA'), '%Y-%m-%d %H:%i:%s'), 'fechaPromesa'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ALTA'), '%Y-%m-%d %H:%i:%s'), 'fechaAlta'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_SOLICITA'), '%Y-%m-%d %H:%i:%s'), 'fechaClienteSolicita'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE'), '%Y-%m-%d %H:%i:%s'), 'fechaCierre'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE_SISTEMA'), '%Y-%m-%d %H:%i:%s'), 'fechaCierreAutomatico'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ENTREGA_PROVEEDOR'), '%Y-%m-%d %H:%i:%s'), 'fechaEntregaProveedor'],
                ],
                exclude: ['AUDITORIA_USU_ALTA', 'AUDITORIA_USU_ULT_MOD', 'AUDITORIA_FEC_ALTA', 'AUDITORIA_FEC_ULT_MOD']
            },
            include: [
                {model: db.model_ticket_estatus, as: 'assoEstatusTicket', attributes: ['id', 'descripcion', 'clave', 'claveProveedor']},
                {model: db.model_ticket_prioridad, as: 'assoPrioridadTicket', attributes: ['id', 'descripcion', 'slaTiempo']},
                {model: db.model_ticket_requisicion, as: 'assoRequisicionTicket', attributes: ['idReq', 'nombreReq']},
                {model: db.model_ticket_severidad, as: 'assoSeveridadTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tipoticket, as: 'assoTipoTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tiposervicio, as: 'assoTipoCanalTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelUnoTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelDosTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelTresTicket', attributes: ['id', 'descripcion', 'slaEjecucion']},
            ],
            where: {
                idProveedorSolicita: { [Op.in]: [req.provider_id] },
                idEmpresa: req.provider_emphost,
                ticketCerrado: 1,
                fechaCierre: {
                    [Op.gte]: fechaInicio 
                }
            }
        })

        if (ticketsResult.length == 0) {
            responseResult = {success: false, message: 'No se localizaron datos'};
        } else {
            responseResult = {success: true, message: 'Success get', JsonData: ticketsResult, count:ticketsResult.length};
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

const getTicketsProviderEnproceso = async (req, res) => {
    const { idProvider } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }
    try {
        const ticketsResult = await db.model_ticket_services.findAll({
            attributes: {
                include: [
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_PROMESA'), '%Y-%m-%d %H:%i:%s'), 'fechaPromesa'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ALTA'), '%Y-%m-%d %H:%i:%s'), 'fechaAlta'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_SOLICITA'), '%Y-%m-%d %H:%i:%s'), 'fechaClienteSolicita'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE'), '%Y-%m-%d %H:%i:%s'), 'fechaCierre'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE_SISTEMA'), '%Y-%m-%d %H:%i:%s'), 'fechaCierreAutomatico'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ENTREGA_PROVEEDOR'), '%Y-%m-%d %H:%i:%s'), 'fechaEntregaProveedor'],
                ],
                exclude: ['AUDITORIA_USU_ALTA', 'AUDITORIA_USU_ULT_MOD', 'AUDITORIA_FEC_ALTA', 'AUDITORIA_FEC_ULT_MOD']
            },
            include: [
                {model: db.model_ticket_estatus, as: 'assoEstatusTicket', attributes: ['id', 'descripcion', 'clave', 'claveProveedor']},
                {model: db.model_ticket_prioridad, as: 'assoPrioridadTicket', attributes: ['id', 'descripcion', 'slaTiempo']},
                {model: db.model_ticket_requisicion, as: 'assoRequisicionTicket', attributes: ['idReq', 'nombreReq']},
                {model: db.model_ticket_severidad, as: 'assoSeveridadTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tipoticket, as: 'assoTipoTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tiposervicio, as: 'assoTipoCanalTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelUnoTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelDosTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelTresTicket', attributes: ['id', 'descripcion', 'slaEjecucion']},
            ],
            where: {
                idProveedorSolicita: { [Op.in]: [req.provider_id] },
                idEmpresa: req.provider_emphost,
                ticketCerrado: 0,
            }
        })

        if (ticketsResult.length == 0) {
            responseResult = {success: false, message: 'No se localizaron datos'};
        } else {
            responseResult = {success: true, message: 'Success get', JsonData: ticketsResult, count:ticketsResult.length};
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

const getTicketsProviderReasignados = async (req, res) => {
    const { idProvider } = req.params;
    let responseResult = {success: false, message: 'Sin información para mostrar', JsonData: [], count:0};
    if (idProvider != req.provider_id) {
        responseResult = {success: false, message: `Error paridad de datos, los datos porporcionanos no son correcto, valide la información proporcionada o pongase en contacto con el administrador`};
        res.status(403).json(responseResult);
        return
    }
    try {
        const ticketsResult = await db.model_ticket_services.findAll({
            attributes: {
                include: [
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_PROMESA'), '%Y-%m-%d %H:%i:%s'), 'fechaPromesa'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ALTA'), '%Y-%m-%d %H:%i:%s'), 'fechaAlta'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_SOLICITA'), '%Y-%m-%d %H:%i:%s'), 'fechaClienteSolicita'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE'), '%Y-%m-%d %H:%i:%s'), 'fechaCierre'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_CIERRE_SISTEMA'), '%Y-%m-%d %H:%i:%s'), 'fechaCierreAutomatico'],
                    [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('TIC_FECHA_ENTREGA_PROVEEDOR'), '%Y-%m-%d %H:%i:%s'), 'fechaEntregaProveedor'],
                ],
                exclude: ['AUDITORIA_USU_ALTA', 'AUDITORIA_USU_ULT_MOD', 'AUDITORIA_FEC_ALTA', 'AUDITORIA_FEC_ULT_MOD']
            },
            include: [
                {model: db.model_ticket_estatus, as: 'assoEstatusTicket', attributes: ['id', 'descripcion', 'clave', 'claveProveedor'], where: {reasignaTicket: 1}},
                {model: db.model_ticket_prioridad, as: 'assoPrioridadTicket', attributes: ['id', 'descripcion', 'slaTiempo']},
                {model: db.model_ticket_requisicion, as: 'assoRequisicionTicket', attributes: ['idReq', 'nombreReq']},
                {model: db.model_ticket_severidad, as: 'assoSeveridadTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tipoticket, as: 'assoTipoTicket', attributes: ['id', 'descripcion']}, 
                {model: db.model_ticket_tiposervicio, as: 'assoTipoCanalTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelUnoTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelDosTicket', attributes: ['id', 'descripcion']},
                {model: db.model_ticket_tipificaciones, as: 'assoTipificacionesNivelTresTicket', attributes: ['id', 'descripcion', 'slaEjecucion']},
            ],
            where: {
                idProveedorSolicita: { [Op.in]: [req.provider_id] },
                idEmpresa: req.provider_emphost
            }
        })

        if (ticketsResult.length == 0) {
            responseResult = {success: false, message: 'No se localizaron datos'};
        } else {
            responseResult = {success: true, message: 'Success get', JsonData: ticketsResult, count:ticketsResult.length};
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


module.exports = {
    getNewTicketsProvider,
    getTicketsProviderById,
    insertTicketProvider,
    updateEstatusTicket,
    updateTicketProvider,
    insertBitacoraTicket,
    insertBitacoraTicketByNewId,
    generateNewID,
    CancelarTicket,
    insertTicketProviderSSI,
    get_Ticket_Foto,
    get_Ticket_Documentos,
    pauseTicket,
    resumeTicket,
    getCatalogoCategorizaciones,
    getNewTicketsSiadeconsrv,
    getTicketsSiadeconsrvById,
    insertMensajeTicketByNewId,
    getTicketsProviderCerrados,
    getTicketsProviderEnproceso,
    getTicketsProviderReasignados
};