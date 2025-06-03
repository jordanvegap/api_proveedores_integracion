module.exports = (sequelize, DataTypes) => {
    const model_ticket_tiposervicio = sequelize.define('SAMT_CAM_TIPO_SERVICIO', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'SAMT_CAM_TIPO_SERVICIO_CSC',
        },
        descripcion: {
            type: DataTypes.STRING,
            field: 'TIPO_SERVICIO_IDIOMA1',
            allowNull: false,
        },
        orden: {
            type: DataTypes.INTEGER,
            field: 'TIPO_SERVICIO_ORDEN',
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            field: 'TIPO_SERVICIO_ACTIVO',
            allowNull: false,
            defaultValue: true
        },
        default: {
            type: DataTypes.BOOLEAN,
            field: 'TIPO_SERVICIO_DEFAULT',
            allowNull: false,
            defaultValue: false
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

    return model_ticket_tiposervicio;
};
    