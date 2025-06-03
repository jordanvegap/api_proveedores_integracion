module.exports = (sequelize, DataTypes) => {
    const document_ticket = sequelize.define("SAMT_TICKET_FILE", {
      idDocumento:{
      field: 'TICKET_FILE_CSC',
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
      newIdDocumento: {
        field: 'TICKET_FILE_RUTA',
        type:DataTypes.STRING,
      },
      url: {
        field: 'TICKET_FILE_URL',
        type:DataTypes.STRING,
      },
      fechaAlta: {
        field: 'TICKET_FILE_FECHA_ALTA',
        type:DataTypes.STRING,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      numeroFoto: {
        field: 'TICKET_FILE_NUMERO_FOTO',
        type:DataTypes.INTEGER,
      },
      descripcion: {
        field: 'TICKET_FILE_DESCRIPCION',
        type:DataTypes.STRING,
      },
      activo: {
        field: 'TICKET_FILE_ACTIVO',
        type:DataTypes.INTEGER,
      },
      mimetypeOriginal: {
        field: 'TICKET_FILE_MIMETYPE_ORIGINAL',
        type:DataTypes.STRING,
      },
     mimetypeSistema: {
        field:'TICKET_FILE_MIMETYPE_SISTEMA',
        type:DataTypes.STRING,
      },
      idOrigenCreacion: {
        field:'TICKET_FILE_ORIGEN_CREACION',
        type:DataTypes.STRING,
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
  
    return document_ticket;
  };
