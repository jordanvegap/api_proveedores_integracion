module.exports = (sequelize, DataTypes) => {
    const model_ticket_tipificaciones = sequelize.define('SAMT_CAM_TIPIFICACIONES', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'TIPIFICA_CSC',
        },
        descripcion:{
            type: DataTypes.STRING,
            field: 'TIPIFICA_IDIOMA1',
            allowNull: false,
        }, 
        idTipoTipifica:{
            type: DataTypes.INTEGER,
            field: 'CAT_TIPO_TIPIFICA_CSC',
            allowNull: false,
        }, 
        idCamTipoTipifica:{
            type: DataTypes.INTEGER,
            field: 'SAMT_CAM_TIPO_TIPIFICA_CSC',
            allowNull: false,
        },
        idParent:{
            type: DataTypes.INTEGER,
            field: 'TIPIFICA_PARENT',
            allowNull: false,
        },
        tipificaActivo:{
            type: DataTypes.BOOLEAN,
            field: 'TIPIFCA_ACTIVO',
            defaultValue: true
        },
        default: {
            type: DataTypes.BOOLEAN,
            field: 'TIPIFICA_DEFAULT',
            allowNull: false,
            defaultValue: false
        },
        imagen: {
            type: DataTypes.BLOB('long'),
            field: 'TIPIFICA_IMAGEN',
            allowNull: false,
        },
        slaRecepcion: {
            type: DataTypes.INTEGER,
            field: 'TIPIFICA_TIEMPO_RECEPCION',
            defaultValue: 84000
        },
        slaEjecucion: {
            type: DataTypes.INTEGER,
            field: 'TIPIFICA_TIEMPO_EJECUCION',
            defaultValue: 84000
        },
        slaConfirmacion: {
            type: DataTypes.INTEGER,
            field: 'TIPIFICA_TIEMPO_CONFIRMACION',
            defaultValue: 84000
        },
        activo: {
            type: DataTypes.BOOLEAN,
            field: 'TIPO_TICKET_ACTIVO',
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

    return model_ticket_tipificaciones;
};
    