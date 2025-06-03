module.exports = (sequelize, DataTypes) => {
    const model_ticket_estatus_anam_proveedor = sequelize.define('SAMT_ESTATUS_TICKET_ANAM_PROVEEDOR', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        idEstatus:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'ESTATUS_TICKET_CSC',
        },
        idEstatusProveedor: {
            type: DataTypes.STRING,
            field: 'ESTATUS_TICKET_PROVEEDOR_CSC',
            allowNull: false,
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
        activo: {
            type: DataTypes.BOOLEAN,
            field: 'ESTATUS_TICKET_ACTIVO',
            allowNull: false,
            defaultValue: true
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

    return model_ticket_estatus_anam_proveedor;
};
    