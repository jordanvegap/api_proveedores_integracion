module.exports = (sequelize, DataTypes) => {
    const model_ticket_requisicion = sequelize.define('SAMT_REQUISICION_PROVEEDORES', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        idReq:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'SAMT_REQUISICION_PROVEEDORES_CSC',
        },
        idParent: {
            type: DataTypes.INTEGER,
            field: 'SAMT_REQUISICION_PROVEEDORES_PARENT',
            allowNull: true,
        },
        nombreReq: {
            type: DataTypes.STRING,
            field: 'REQUISICION_PROVEEDORES_NOMBRE',
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

    return model_ticket_requisicion;
};
    