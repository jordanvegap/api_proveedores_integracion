module.exports = (sequelize, DataTypes) => {
    const model_ticket_tiposervicio_proveedor = sequelize.define('SAMT_TIPO_TICKET_PROVEEDOR', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        idTipoServicio:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'TIPO_TICKET_CSC',
            allowNull: false
        },
        idTipoServicioProveedor: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: 'TIPO_TICKET_CLAVE_PROVEEDOR',
            allowNull: false,
        },
        idProvider: {
            type: DataTypes.INTEGER,
            field: 'CAM_CSC_SERVICIO',
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
        }
    },{
      freezeTableName: true,
      dateStrings: true,
    });

    return model_ticket_tiposervicio_proveedor;
};
    