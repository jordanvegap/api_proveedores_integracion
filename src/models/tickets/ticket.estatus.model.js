module.exports = (sequelize, DataTypes) => {
    const model_ticket_estatus = sequelize.define('SAMT_ESTATUS_TICKET', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'ESTATUS_TICKET_CSC',
        },
        descripcion: {
            type: DataTypes.STRING,
            field: 'ESTATUS_TICKET_IDIOMA1',
            allowNull: false,
        },
        orden: {
            type: DataTypes.STRING,
            field: 'ESTATUS_TICKET_ORDEN',
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            field: 'ESTATUS_TICKET_ACTIVO',
            allowNull: false,
            defaultValue: true
        },
        default: {
            type: DataTypes.BOOLEAN,
            field: 'ESTATUS_TICKET_DEFAULT',
            allowNull: false,
            defaultValue: false
        },
        clave: {
            type: DataTypes.STRING,
            field: 'ESTATUS_TICKET_CLAVE',
            allowNull: false,
            defaultValue: false
        },
        claveProveedor: {
            type: DataTypes.STRING,
            field: 'ESTATUS_CLAVE_PROVEEDOR',
            allowNull: false,
            defaultValue: false
        },
        idMesaAyuda: {
            type: DataTypes.INTEGER,
            field: 'CAM_MESA_CSC',
            allowNull: false,
        },
        idProvider: {
            type: DataTypes.INTEGER,
            field: 'CAM_CSC_SERVICIO',
            allowNull: false,
        },
        cierraTicket: {
            type: DataTypes.BOOLEAN,
            field: 'ESTATUS_TICKET_CERRAR',
            allowNull: false
        },
        pausaTicket: {
            type: DataTypes.BOOLEAN,
            field: 'ESTATUS_TICKET_PAUSAR',
            allowNull: false
        },
        reasignaTicket: {
            type: DataTypes.BOOLEAN,
            field: 'ESTATUS_TICKET_REASIGNAR',
            allowNull: false
        },
        tiempoAtencionTicket: {
            type: DataTypes.BOOLEAN,
            field: 'ESTATUS_TICKET_TIEMPO_ATENCION',
            allowNull: false
        },
        resueltoTicket: {
            type: DataTypes.BOOLEAN,
            field: 'ESTATUS_TICKET_RESUELTO',
            allowNull: false
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

    return model_ticket_estatus;
};
    