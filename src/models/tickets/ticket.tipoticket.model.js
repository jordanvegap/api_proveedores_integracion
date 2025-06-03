module.exports = (sequelize, DataTypes) => {
    const model_ticket_tipoticket = sequelize.define('SAMT_TIPO_TICKET', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'TIPO_TICKET_CSC',
        },
        descripcion: {
            type: DataTypes.STRING,
            field: 'TIPO_TICKET_IDIOMA1',
            allowNull: false,
        },
        orden: {
            type: DataTypes.INTEGER,
            field: 'TIPO_TICKET_ORDEN',
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            field: 'TIPO_TICKET_ACTIVO',
            allowNull: false,
            defaultValue: true
        },
        default: {
            type: DataTypes.BOOLEAN,
            field: 'TIPO_TICKET_DEFAULT',
            allowNull: false,
            defaultValue: false
        },
        idMesaAyuda: {
            type: DataTypes.INTEGER,
            field: 'CAM_MESA_CSC',
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

    return model_ticket_tipoticket;
};
    