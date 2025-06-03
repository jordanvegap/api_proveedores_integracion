module.exports = (sequelize, DataTypes) => {
    const model_token_access = sequelize.define("SAMT_TOKEN_API_ACCESS", {
      SAMT_TOKEN_ID:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      provider_name: {
        type: DataTypes.STRING,
        field: 'SAMT_NOMBRE_PROVEEDOR',
        unique: true
      },
      provider_token: {
        type: DataTypes.STRING,
        field: 'SAMT_TOKEN',
      },
      provider_revoked: {
        type: DataTypes.BOOLEAN,
        field: 'SAMT_TOKEN_REVOKED',
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
  
    return model_token_access;
  };