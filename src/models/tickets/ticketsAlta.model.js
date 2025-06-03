
module.exports = (sequelize, DataTypes) => {
    const model_ticket_alta_services = sequelize.define("SAMT_TICKET_SERVICIO", {
      idTicket:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'TIC_CSCTICKET',
     },
      idEmpresa: {
        type: DataTypes.INTEGER,
        field: 'EMP_CSC_EMPRESA_HOST',
        allowNull: false,
      },
      newIdTicket: {
        type: DataTypes.STRING,
        field: 'TIC_NEWID',
        allowNull: false,
      },
      idUbicacion: { //Mapeado
        type: DataTypes.INTEGER,
        field: 'REQ_CSCREQUISICION',
        allowNull: false,
      },
      idMesa: {
        type: DataTypes.INTEGER,
        field: 'CAM_MESA_CSC',
        allowNull: false,
      },
      idCategoriaNivelUno: {
        type: DataTypes.INTEGER,
        field: 'TIPIFICA_CSC_PARENT_PARENT',
        allowNull: false,
      },
      idCategoriaNivelDos: {
        type: DataTypes.INTEGER,
        field: 'TIPIFICA_CSC_PARENT',
        allowNull: false,
      },
      idCategoriaNivelTres: {
        type: DataTypes.INTEGER,
        field: 'TIPIFICA_CSC',
        allowNull: false,
      },
      idTipoTicket: { //Mapeado
        type: DataTypes.INTEGER,
        field: 'TIPO_TICKET_CSC',
        allowNull: false,
      },
      idPrioridad: { //Mapeado
        type: DataTypes.INTEGER,
        field: 'TIPO_PRIORIDAD_CSC',
        allowNull: false,
      },
      idEstatus: { //Mapeado
        type: DataTypes.INTEGER,
        field: 'ESTATUS_TICKET_CSC',
        allowNull: false
      },
      idCanalTicket: { //Mapeado
        type: DataTypes.INTEGER,
        field: 'SAMT_CAM_TIPO_SERVICIO_CSC',
        allowNull: false,
      },
      idClienteSolicitante: {
        type: DataTypes.INTEGER,
        field: 'CLIENTE_CSC_SOLICITA',
        allowNull: false,
      },
      idServicioProySolicitante: {
        type: DataTypes.INTEGER,
        field: 'PM_CSC_PROYECTO_SOLICITA',
        allowNull: false,
      },
      idProveedorSolicita: {
        type: DataTypes.INTEGER,
        field: 'CAM_CSC_SERVICIO_SOLICITA'
      },
      idSeveridad: { //Mapeado
        type: DataTypes.INTEGER,
        field: 'TIPO_SEVERIDAD_CSC',
        allowNull: false,
      },
      tipoIncidente: { //Mapeado
        type: DataTypes.INTEGER,
        field: 'SAMT_TICKET_TIPO_INCIDENTE_CSC'
      },
      idEmpleadoSolicita: {
        type: DataTypes.INTEGER,
        field: 'EMPLEADO_CSC_SOLICITA'
      },
      idEmpleadoAtiende: {
        type: DataTypes.INTEGER,
        field: 'EMPLEADO_CSC_ATIENDE'
      },
      nombreSolicitante: {
        type: DataTypes.STRING,
        field: 'TIC_SOLICITA',
        allowNull: false,
      },
      descipcionSolicitud: {
        type: DataTypes.STRING,
        field: 'TIC_DESCRIPCION',
        allowNull: false,
      },
      descipcionSolucion: {
        type: DataTypes.STRING,
        field: 'TIC_DESCRIPCION_SOLUCION'
      },
      descipcionCancelacion: {
        type: DataTypes.STRING,
        field: 'TIC_DESCRIPCION_CANCELACION'
      },
      segmentacionInmuebleDetalle: {
        type: DataTypes.STRING,
        field: 'TIC_SEGMENTACION_INM_DES'
      },
      fechaPromesa: {
        type: DataTypes.DATE,
        field: 'TIC_FECHA_PROMESA'
      },
      fechaClienteSolicita: {
        type: DataTypes.DATE,
        field: 'TIC_FECHA_SOLICITA',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      fechaAlta: {
        type: DataTypes.DATE,
        field: 'TIC_FECHA_ALTA',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      fechaAltaSola: {
        type: DataTypes.DATE,
        field: 'TIC_FECHA_ALTA_SOLA',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      fechaAltaHora: {
        type: DataTypes.DATE,
        field: 'TIC_FECHA_ALTA_HORA_COMPLETA',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      fechaCierre: {
        type: DataTypes.DATE,
        field: 'TIC_FECHA_CIERRE',
      },
      fechaCierreSola: {
        type: DataTypes.DATE,
        field: 'TIC_FECHA_CIERRE_SOLA'
      },
      fechaCierreHora: {
        type: DataTypes.DATE,
        field: 'TIC_FECHA_CIERRE_HORA_COMPLETA'
      },
      fechaCierreAutomatico: {
        type: DataTypes.DATE,
        field: 'TIC_FECHA_CIERRE_SISTEMA'
      },
      autoCierreSistema: {
        type: DataTypes.BOOLEAN,
        field: 'TIC_CERRADO_POR_SISTEMA',
        defaultValue: true
      },
      ticketCerrado: {
        type: DataTypes.BOOLEAN,
        field: 'TIC_CERRADO',
        defaultValue: false
      },
      emailSolicitante: {
        type: DataTypes.STRING,
        field: 'TIC_EMAIL_SOLICITANTE',
        allowNull: false,
      },
      emailNotificacion1: {
        type: DataTypes.STRING,
        field: 'TIC_EMAIL_NOTIFICA_1'
      },
      emailNotificacion2: {
        type: DataTypes.STRING,
        field: 'TIC_EMAIL_NOTIFICA_2'
      },
      telefonoSolicitante: {
        type: DataTypes.STRING,
        field: 'TIC_TELEFONO_SOLICITANTE'
      },
      slaTicketRecepcion: {
        type: DataTypes.INTEGER,
        field: 'TIC_TIEMPO_RECEPCION'
      },
      slaTicket: {
        type: DataTypes.INTEGER,
        field: 'TIC_TIEMPO_EJECUCION'
      },
      slaConfirmacion: {
        type: DataTypes.INTEGER,
        field: 'TIC_TIEMPO_CONFIRMACION'
      },
      porcentajePenalizacionRecepcion: {
        type: DataTypes.INTEGER,
        field: 'TIC_PORC_PENALIZACION_RECEPCION'
      },
      porcentajePenalizacionEjecucion: {
        type: DataTypes.INTEGER,
        field: 'TIC_PORC_PENALIZACION_EJECUCION'
      },
      porcentajePenalizacionConfirmacion: {
        type: DataTypes.INTEGER,
        field: 'TIC_PORC_PENALIZACION_CONFIRMACION'
      },
      duracionRecepcion: {
        type: DataTypes.INTEGER,
        field: 'TIC_DURACION_RECEPCION'
      },
      duracionEjecucion: {
        type: DataTypes.INTEGER,
        field: 'TIC_DURACION_EJECUCION'
      },
      duracionConfirmacion: {
        type: DataTypes.INTEGER,
        field: 'TIC_DURACION_CONFIRMACION'
      },
      calificado: {
        type: DataTypes.BOOLEAN,
        field: 'TIC_CALIFICADO',
        defaultValue: false
      },
      idCalificacion: {
        type: DataTypes.INTEGER,
        field: 'TIPO_CALIFICACION_CSC',
        defaultValue: 1
      },
      comentarioCalificacion: {
        type: DataTypes.STRING,
        field: 'TIC_CALIFICACION_COMENTARIO'
      },
      idEmpleadoCalifica: {
        type: DataTypes.INTEGER,
        field: 'EMPLEADO_CSC_CALIFICA'
      },
      idCRM: {
        type: DataTypes.INTEGER,
        field: 'TIC_CRM'
      },
      notificarAOperaciones: {
        type: DataTypes.BOOLEAN,
        field: 'TIC_NOTIFICA_OPERACION',
        defaultValue: true
      },
      esfuerzoRequerdio: {
        type: DataTypes.INTEGER,
        field: 'TIC_ESFUERZO_REQUERIDO'
      },
      asuntoOrigen: {
        type: DataTypes.STRING,
        field: 'TIC_ASUNTO_ORIGEN'
      },
      ticCampoStringAuxiliar1: {
        type: DataTypes.STRING,
        field: 'TIC_AUXS1'
      },
      ticCampoIntegerAuxiliar1: {
        type: DataTypes.INTEGER,
        field: 'TIC_AUXI1'
      },
      ticCampoDateAuxiliar1: {
        type: DataTypes.DATE,
        field: 'TIC_AUXD1'
      },
      ticCampoStringAuxiliar2: {
        type: DataTypes.STRING,
        field: 'TIC_AUXS2'
      },
      ticCampoIntegerAuxiliar2: {
        type: DataTypes.INTEGER,
        field: 'TIC_AUXI2'
      },
      ticCampoDateAuxiliar2: {
        type: DataTypes.DATE,
        field: 'TIC_AUXD2'
      },
      ticCampoStringAuxiliar3: {
        type: DataTypes.STRING,
        field: 'TIC_AUXS3'
      },
      ticCampoIntegerAuxiliar3: {
        type: DataTypes.INTEGER,
        field: 'TIC_AUXI3'
      },
      ticCampoDateAuxiliar3: {
        type: DataTypes.DATE,
        field: 'TIC_AUXD3'
      },
      entregadoProveedor: {
        type: DataTypes.BOOLEAN,
        field: 'TIC_ENTREGADO_PROVEEDOR',
        defaultValue: false
      },
      fechaEntregaProveedor: {
        type: DataTypes.DATE,
        field: 'TIC_FECHA_ENTREGA_PROVEEDOR'
      },
      idTicketExternoProveedor: {
        type: DataTypes.STRING,
        field: 'TIC_ID_EXTERNO_PROVEEDOR'
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

    return model_ticket_alta_services;
  };  