
module.exports = (sequelize, DataTypes) => {
    const model_ticket_siadeconsrv = sequelize.define("VW_SIADECONSRV_DATOS_ADICIONALES", {
      idEmpresa: {
        type: DataTypes.INTEGER,
        field: 'EMP_CSC_EMPRESA_HOST',
        allowNull: false
      },
      newIdTicket: {
        type: DataTypes.STRING,
        field: 'newIdTicket',
        primaryKey: true
      },
      Nombres: {
        type: DataTypes.STRING,
        field: 'Nombres',
        allowNull: false,
      },
      ApellidoPaterno: {
        type: DataTypes.STRING,
        field: 'ApellidoPaterno',
        allowNull: false,
      },
      ApellidoMaterno: {
        type: DataTypes.STRING,
        field: 'ApellidoMaterno',
        allowNull: false,
      },
      RFC: {
        type: DataTypes.STRING,
        field: 'RFC',
        allowNull: false,
      },
      MailInstitucional: {
        type: DataTypes.STRING,
        field: 'MailInstitucional',
        allowNull: false,
      },
      Aduana: {
        type: DataTypes.STRING,
        field: 'Aduana',
        allowNull: false,
      },
      PuntoTactico: {
        type: DataTypes.STRING,
        field: 'PuntoTactico',
        allowNull: false,
      },
      Area: {
        type: DataTypes.STRING,
        field: 'Area',
        allowNull: false,
      },
      Jerarquia: {
        type: DataTypes.STRING,
        field: 'Jerarquia',
        allowNull: false,
      },
      Vin: {
        type: DataTypes.STRING,
        field: 'Vin',
        allowNull: false,
      },
      Placa: {
        type: DataTypes.STRING,
        field: 'Placa',
        allowNull: false,
      },
      EntidadFederativa: {
        type: DataTypes.STRING,
        field: 'EntidadFederativa',
        allowNull: false,
      },
      Pais: {
        type: DataTypes.STRING,
        field: 'Pais',
        allowNull: false,
      },
      NombreListaNegra: {
        type: DataTypes.STRING,
        field: 'NombreListaNegra',
        allowNull: false,
      }
    },{
      freezeTableName: true,
      dateStrings: true,
    });

    return model_ticket_siadeconsrv;
  };  