module.exports = (sequelize, DataTypes) => {
    const model_ticket_logs_sla = sequelize.define('SAMT_TICKET_LOG_SLA', {  
        idEmpresa: {
            type: DataTypes.INTEGER,
            field: 'EMP_CSC_EMPRESA_HOST',
            allowNull: false
        },
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'SAMT_TICKET_LOG_CSC',
        },
        newIdTicket: {
            type: DataTypes.STRING,
            field: 'TIC_NEWID',
            allowNull: false,
        },
        action_status: {
            type: DataTypes.ENUM('pause', 'resume'),
            allowNull: false,
            field: 'ACTION_STATUS'
        },
        fecha_hora: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            field: 'LOG_FECHA_HORA'
        },
        fecha_hora_fin: {
            type: DataTypes.DATE,
            field: 'LOG_FECHA_HORA_FIN'
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

    return model_ticket_logs_sla;
};