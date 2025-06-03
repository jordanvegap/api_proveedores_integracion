const dbConfig = require('../../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: dbConfig.logging,
  define: {
    timestamps: false,
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//[Traer los modelos]
db.model_ticket_services = require('./tickets.model.js')(sequelize,Sequelize);
db.model_ticket_estatus = require('./ticket.estatus.model.js')(sequelize,Sequelize);
db.model_ticket_prioridad = require('./ticket.prioridad.model.js')(sequelize,Sequelize);
db.model_ticket_requisicion = require('./ticket.requisicion.model.js')(sequelize,Sequelize);
db.model_ticket_severidad = require('./ticket.severidad.model.js')(sequelize,Sequelize);
db.model_ticket_tipoticket = require('./ticket.tipoticket.model.js')(sequelize,Sequelize);
db.model_ticket_tiposervicio = require('./ticket.tiposervicio.model.js')(sequelize,Sequelize);
db.model_ticket_tipificaciones = require('./ticket.tipificaciones.model.js')(sequelize,Sequelize);
db.model_ticket_bitacora = require('./ticket.bitacoraticket.model.js')(sequelize,Sequelize);
db.model_ticket_alta_services = require('./ticketsAlta.model.js')(sequelize,Sequelize);
db.model_ticket_fotos = require('./image.model.js')(sequelize,Sequelize);
db.model_ticket_documentos = require('./documents.ticket.model.js')(sequelize,Sequelize);
db.mdoel_ticket_estatus_proveedor = require('./ticket.estatus.proveedor.model.js')(sequelize,Sequelize);
db.model_ticket_tiposervicio_proveedor = require('./ticket.tiposervicio.proveedor.model.js')(sequelize,Sequelize);
db.model_ticket_prioridad_proveedor = require('./ticket.prioridad.proveedor.model.js')(sequelize,Sequelize);
db.model_ticket_severidad_proveedor = require('./ticket.severidad.proveedor.model.js')(sequelize,Sequelize);
db.model_ticket_logs_sla = require('./ticket.logs_sla.model.js')(sequelize,Sequelize);
db.model_ticket_siadeconsrv = require('./ticket.siadeconsrv.model.js')(sequelize,Sequelize);
db.model_ticket_mensajes = require('./ticket.mensajes.model.js')(sequelize,Sequelize)

//[Se define la realación de cada modelo]
db.model_ticket_estatus.hasMany(db.model_ticket_services, {as: 'assoEstatusTicket',foreignKey: 'idEstatus'});
db.model_ticket_services.belongsTo(db.model_ticket_estatus, {as: 'assoEstatusTicket',foreignKey: 'idEstatus'});

db.model_ticket_prioridad.hasMany(db.model_ticket_services, {as: 'assoPrioridadTicket',foreignKey: 'idPrioridad'});
db.model_ticket_services.belongsTo(db.model_ticket_prioridad, {as: 'assoPrioridadTicket',foreignKey: 'idPrioridad'});

db.model_ticket_requisicion.hasMany(db.model_ticket_services, {as: 'assoRequisicionTicket', foreignKey: 'idUbicacion'});
db.model_ticket_services.belongsTo(db.model_ticket_requisicion, {as: 'assoRequisicionTicket', foreignKey: 'idUbicacion'});

db.model_ticket_severidad.hasMany(db.model_ticket_services, {as: 'assoSeveridadTicket', foreignKey: 'idSeveridad'});
db.model_ticket_services.belongsTo(db.model_ticket_severidad, {as: 'assoSeveridadTicket', foreignKey: 'idSeveridad'});

db.model_ticket_tipoticket.hasMany(db.model_ticket_services, {as: 'assoTipoTicket', foreignKey: 'idTipoTicket'});
db.model_ticket_services.belongsTo(db.model_ticket_tipoticket, {as: 'assoTipoTicket', foreignKey: 'idTipoTicket'});

db.model_ticket_tiposervicio.hasMany(db.model_ticket_services, {as: 'assoTipoCanalTicket', foreignKey: 'idCanalTicket'});
db.model_ticket_services.belongsTo(db.model_ticket_tiposervicio, {as: 'assoTipoCanalTicket', foreignKey: 'idCanalTicket'});

db.model_ticket_tipificaciones.hasMany(db.model_ticket_services, {as: 'assoTipificacionesNivelUnoTicket', foreignKey: 'idCategoriaNivelUno'});
db.model_ticket_services.belongsTo(db.model_ticket_tipificaciones, {as: 'assoTipificacionesNivelUnoTicket', foreignKey: 'idCategoriaNivelUno'});

db.model_ticket_tipificaciones.hasMany(db.model_ticket_services, {as: 'assoTipificacionesNivelDosTicket', foreignKey: 'idCategoriaNivelDos'});
db.model_ticket_services.belongsTo(db.model_ticket_tipificaciones, {as: 'assoTipificacionesNivelDosTicket', foreignKey: 'idCategoriaNivelDos'});

db.model_ticket_tipificaciones.hasMany(db.model_ticket_services, {as: 'assoTipificacionesNivelTresTicket', foreignKey: 'idCategoriaNivelTres'});
db.model_ticket_services.belongsTo(db.model_ticket_tipificaciones, {as: 'assoTipificacionesNivelTresTicket', foreignKey: 'idCategoriaNivelTres'});


//[Se define la realación de cada modelo]
db.model_ticket_estatus.hasMany(db.model_ticket_alta_services, {as: 'assoEstatusTicketnew',foreignKey: 'idEstatus'});
db.model_ticket_alta_services.belongsTo(db.model_ticket_estatus, {as: 'assoEstatusTicketnew',foreignKey: 'idEstatus'});

db.model_ticket_prioridad.hasMany(db.model_ticket_alta_services, {as: 'assoPrioridadTicketnew',foreignKey: 'idPrioridad'});
db.model_ticket_alta_services.belongsTo(db.model_ticket_prioridad, {as: 'assoPrioridadTicketnew',foreignKey: 'idPrioridad'});

db.model_ticket_requisicion.hasMany(db.model_ticket_alta_services, {as: 'assoRequisicionTicketnew', foreignKey: 'idUbicacion'});
db.model_ticket_alta_services.belongsTo(db.model_ticket_requisicion, {as: 'assoRequisicionTicketnew', foreignKey: 'idUbicacion'});

db.model_ticket_severidad.hasMany(db.model_ticket_alta_services, {as: 'assoSeveridadTicketnew', foreignKey: 'idSeveridad'});
db.model_ticket_alta_services.belongsTo(db.model_ticket_severidad, {as: 'assoSeveridadTicketnew', foreignKey: 'idSeveridad'});

db.model_ticket_tipoticket.hasMany(db.model_ticket_alta_services, {as: 'assoTipoTicketnew', foreignKey: 'idTipoTicket'});
db.model_ticket_alta_services.belongsTo(db.model_ticket_tipoticket, {as: 'assoTipoTicketnew', foreignKey: 'idTipoTicket'});

db.model_ticket_tiposervicio.hasMany(db.model_ticket_alta_services, {as: 'assoTipoCanalTicketnew', foreignKey: 'idCanalTicket'});
db.model_ticket_alta_services.belongsTo(db.model_ticket_tiposervicio, {as: 'assoTipoCanalTicketnew', foreignKey: 'idCanalTicket'});

db.model_ticket_tipificaciones.hasMany(db.model_ticket_alta_services, {as: 'assoTipificacionesNivelUnoTicketnew', foreignKey: 'idCategoriaNivelUno'});
db.model_ticket_alta_services.belongsTo(db.model_ticket_tipificaciones, {as: 'assoTipificacionesNivelUnoTicketnew', foreignKey: 'idCategoriaNivelUno'});

db.model_ticket_tipificaciones.hasMany(db.model_ticket_alta_services, {as: 'assoTipificacionesNivelDosTicketnew', foreignKey: 'idCategoriaNivelDos'});
db.model_ticket_alta_services.belongsTo(db.model_ticket_tipificaciones, {as: 'assoTipificacionesNivelDosTicketnew', foreignKey: 'idCategoriaNivelDos'});

db.model_ticket_tipificaciones.hasMany(db.model_ticket_alta_services, {as: 'assoTipificacionesNivelTresTicketnew', foreignKey: 'idCategoriaNivelTres'});
db.model_ticket_alta_services.belongsTo(db.model_ticket_tipificaciones, {as: 'assoTipificacionesNivelTresTicketnew', foreignKey: 'idCategoriaNivelTres'});

db.model_ticket_siadeconsrv.hasMany(db.model_ticket_services, {as: 'assoDatosAdicionales',foreignKey: 'newIdTicket'});
db.model_ticket_services.belongsTo(db.model_ticket_siadeconsrv, {as: 'assoDatosAdicionales',foreignKey: 'newIdTicket'});

module.exports = db;