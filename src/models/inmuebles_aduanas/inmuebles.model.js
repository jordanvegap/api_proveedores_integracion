module.exports = (sequelize, DataTypes) => {
    const model_ubicaciones = sequelize.define('SAMT_REQUISICION_PROVEEDORES', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        idInterno:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'SAMT_REQUISICION_PROVEEDORES_CSC',
        },
        idParentInterno:{
            type: DataTypes.INTEGER,
            field: 'SAMT_REQUISICION_PROVEEDORES_PARENT',
            allowNull: true,
        },
        nombre: {
            type: DataTypes.STRING,
            field: 'REQUISICION_PROVEEDORES_NOMBRE',
            allowNull: false,
        },
        idExternoProveedor: {
            type: DataTypes.INTEGER,
            field: 'REQUISICION_PROVEEDORES_ID_EXTERNO',
            allowNull: false,
        },
        codigoVPN: {
            type: DataTypes.STRING,
            field: 'REQUISICION_PROVEEDORES_CODIGO_VPN',
            allowNull: false,
        },
        slaUbicacion: {
            type: DataTypes.INTEGER,
            field: 'REQUISICION_PROVEEDORES_SLA',
            allowNull: true,
        },
        direccion: {
            type: DataTypes.STRING,
            field: 'REQUISICION_PROVEEDORES_DIRECCION',
            allowNull: true,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            field: 'REQUISICION_PROVEEDORES_ACTIVO',
            defaultValue: true
        },
        cliente: {
            type: DataTypes.INTEGER,
            field: 'CLIENTE_CSC',
            allowNull: false,
        },
        proyecto: {
            type: DataTypes.INTEGER,
            field: 'PM_CSC_PROYECTO',
            allowNull: false,
        },
        idProveedor: {
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
        },
        
        
    },{
      freezeTableName: true,
      dateStrings: true,
    });

    return model_ubicaciones;
};
    