module.exports = (sequelize, DataTypes) => {
    const imagen_tickets = sequelize.define("SAMT_TICKET_FOTO", {
      idImagen:{
        field: 'TICKET_FOTO_CSC',
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idEmpresa: {
        field: 'EMP_CSC_EMPRESA_HOST',
        type: DataTypes.INTEGER,
      },
      newIdTicket: {
        field: 'TIC_NEWID',
        type: DataTypes.STRING,
      },
      newIdImagen: {
        field:'TICKET_IMAGEN_RUTA',
        type:DataTypes.STRING,
      },
      url: {
        field:'TICKET_IMAGEN_URL',
        type:DataTypes.STRING,
      },
      fechaAlta: {
        field: 'TICKET_FECHA_ALTA',
        type:DataTypes.STRING,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      fechaAltaOrigen: {
        field: 'TICKET_FECHA_ORIGEN_ALTA',
        type:DataTypes.STRING,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      numeroImagen: {
        field: 'TICKET_NUMERO_FOTO',
        type:DataTypes.INTEGER,
      },
      descripcion: {
        field: 'TICKET_DESCRIPCION',
        type:DataTypes.STRING,
      },
      activo: {
        field: 'TICKET_ACTIVO',
        type:DataTypes.INTEGER,
      },
    mimeTypeOriginal: {
        field: 'TICKET_MIMETYPE_ORIGINAL',
        type:DataTypes.STRING,
      },
      mimeTypeSistema: {
        field: 'TICKET_MIMETYPE_SISTEMA',
        type:DataTypes.STRING,
      },
      geoLatitud: {
        fiel: 'TICKET_GEOREFERENCIA_LAT',
        type:DataTypes.STRING,
      },
      geoLongitud: {
        field: 'TICKET_GEOREFERENCIA_LON',
        type:DataTypes.STRING,
      },
      idOrigenCreacion: {
        field: 'TICKET_ORIGEN_CREACION',
        type:DataTypes.INTEGER,
      },
      desdeCamara: {
        field: 'TICKET_IMAGEN_DESDE_CAMARA', 
        type:DataTypes.INTEGER,
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
      freezeTableName: true
    });
  
    return imagen_tickets;
  };
