module.exports = (sequelize, DataTypes) => {
    const model_equipos = sequelize.define('SAMT_EQUIPO', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        idEquipo:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'SAMT_CSCEQUIPAMIENTO',
        },
        uuidEquipo: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_NEWID',
            allowNull: false,
        },
        idInternoRequisicion:{
            type: DataTypes.INTEGER,
            field: 'REQ_CSCREQUISICION',
            allowNull: false
        },
        idInternoInmueble:{
            type: DataTypes.INTEGER,
            field: 'INM_CSCINMUEBLE',
            allowNull: false
        },
        idProveedor: {
            type: DataTypes.INTEGER,
            field: 'CAM_CSC_SERVICIO',
            allowNull: false,
        },
        estatusEquipo: {
            type: DataTypes.INTEGER,
            field: 'CSC_TIPO_ESTATUS_EQUIPO',
            allowNull: false,
        },
        codVPN: {
            type: DataTypes.INTEGER,
            field: 'EQUIPAMIENTO_CODIGO_VPN',
            allowNull: false,
        },
        hostName: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_HOSTNAME',
            allowNull: false,
        },
        modelo: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_MODELO',
            allowNull: false,
        },
        codigoBarras: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_CODBARRAS',
            allowNull: true,
        },
        dtsReferencia: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_REFERENCIA',
            allowNull: true,
        },
        noSerie: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_NO_SERIE',
            allowNull: true,
        },
        noParte: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_NO_PARTE',
            allowNull: true,
        },
        noInventario: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_NO_INVENTARIO',
            allowNull: true,
        },
        dirIP: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_IP',
            allowNull: true,
        },
        dirMac: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_MAC',
            allowNull: true,
        },
        fUltimoEstatus: {
            type: DataTypes.DATE,
            field: 'EQUIPAMIENTO_FECHA_ULTIMO_ESTATUS',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        tipoEquipo_alias: {
            type: DataTypes.STRING,
            field: 'EQUIIPAMIENTO_ALIAS',
            allowNull: true,
        },
        tipoEquipo_auxiliar: {
            type: DataTypes.STRING,
            field: 'EQUIPAMIENTO_AUX1S',
            allowNull: true,
        },
        unidadMedidaInternacional: {
            type: DataTypes.INTEGER,
            field: 'UME_CSC_UM_INTERNACIONALES',
            allowNull: true,
            defaultValue: 1
        },
        unidadMedida: {
            type: DataTypes.INTEGER,
            field: 'UME_CSC_UNIDADES_MEDIDA',
            allowNull: true,
            defaultValue: 1
        },
        idProdServ: {
            type: DataTypes.INTEGER,
            field: 'PRODC_SERV_CSC',
            allowNull: true,
            defaultValue: 1
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

    return model_equipos;
};
    