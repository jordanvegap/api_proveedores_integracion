module.exports = (sequelize, DataTypes) => {
    const model_ticket_mensajes = sequelize.define('SAMT_TICKET_MENSAJES', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        idTicket: {
            type: DataTypes.INTEGER,
            field: 'TIC_CSCTICKET',
            allowNull: false,
        },
        idRespuesta:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'CSC_RESPUESTA',
        },
        
        respuestaAsunto: {
            type: DataTypes.STRING,
            field: 'RESPUESTA_ASUNTO',
            allowNull: false,
        },
        detalleRespuesta: {
            type: DataTypes.STRING,
            field: 'RESPUESTA_DESCRIPCION',
            allowNull: false,
        },
        fechaAltaRespuesta: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'RESPUESTA_FECHAHORA_ALTA'
        },
        idEstatusRespuesta: {
            type: DataTypes.INTEGER,
            field: 'SAMT_ESTATUS_RESPUESTA_CSC',
            allowNull: false,
        },
        leidoOperador: {
            type: DataTypes.BOOLEAN,
            field: 'RESPUESTA_LEIDO_OPERADOR',
            allowNull: false,
        },
        fechaLeidoOperador: {
            type: DataTypes.DATE,
            //defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'RESPUESTA_FEC_LEIDO_OPERADOR'
        },
        leidoCliente: {
            type: DataTypes.BOOLEAN,
            field: 'RESPUESTA_LEIDO_CLIENTE',
            allowNull: false,
        },
        fechaLeidoCliente: {
            type: DataTypes.DATE,
            //defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'RESPUESTA_FEC_LEIDO_CLIENTE'
        },
        mensajeClave: {
            type: DataTypes.STRING,
            field: 'RESPUESTA_CLAVE',
            allowNull: false,
        },
        mensajeNombreAlta: {
            type: DataTypes.STRING,
            field: 'RESPUESTA_NOMBRE',
            allowNull: false,
        },
        MensajeNewId: {
            type: DataTypes.STRING,
            field: 'TICKET_MENSAJE_NEWID',
            allowNull: false,
        },
        ticketNewID: {
            type: DataTypes.STRING,
            field: 'TIC_NEWID',
            allowNull: false,
        },
        AUDITORIA_USU_ALTA: {
            type:DataTypes.INTEGER,
        },
        AUDITORIA_USU_ULT_MOD: {
            type:DataTypes.INTEGER,
        },
        AUDITORIA_FEC_ALTA: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        AUDITORIA_FEC_ULT_MOD: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        
        
    },{
      freezeTableName: true,
      dateStrings: true,
    });

    return model_ticket_mensajes;
};
    