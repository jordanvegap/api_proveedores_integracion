module.exports = (sequelize, DataTypes) => {
    const model_ticket_bitacora = sequelize.define('SAMT_TICKET_BITACORA', {
        idEmpresa:{
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false,
        },  
        idBitacora:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'TIB_CSCTICKETBITACORA',
        },
        idTicket: {
            type: DataTypes.INTEGER,
            field: 'TIC_CSCTICKET',
            allowNull: false,
        },
        idEmpleado: {
            type: DataTypes.INTEGER,
            field: 'EMPLEADO_CSC_EMPLEADO',
            allowNull: false,
        },
        nombreEmpleado: {
            type: DataTypes.STRING,
            field: 'TIB_NOMBRE',
            allowNull: false,
        },
        detalleBitacora: {
            type: DataTypes.STRING,
            field: 'TIB_DESCRIPCION',
            allowNull: false,
        },
        fechaAltaBitacora: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'TIB_FECHAHORA'
        },
        idEstatusTicket: {
            type: DataTypes.INTEGER,
            field: 'ESTATUS_TICKET_CSC',
            allowNull: false,
        },
        idTipoBitacora: {
            type: DataTypes.INTEGER,
            field: 'SAMT_TICKET_TIPO_BITACORA_CSC',
            allowNull: false,
        },
        idSubTipoBitacora: {
            type: DataTypes.INTEGER,
            field: 'SAMT_TICKET_SUBTIPO_BITACORA_CSC',
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

    return model_ticket_bitacora;
};
    