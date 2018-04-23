"use strict";

module.exports = function (sequelize, DataTypes) {
    var PDMovementTypes = sequelize.define('PDMovementTypes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN
        },
        createdDateTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedDateTime: {
            type: DataTypes.DATE
        },
        createdBy: {
            type: DataTypes.STRING
        },
        modifiedBy: {
            type: DataTypes.STRING
        },
        isDeleted: {
            type: DataTypes.BOOLEAN
        }
    },
        {
            classMethods: {
                associate: function (models) {
                     PDMovementTypes.hasMany(models.StockMovement, { foreignKey: 'typeId', sourceKey: 'id' });
                     PDMovementTypes.hasMany(models.ModuleMovementMatrix, { foreignKey: 'movementTypeId', sourceKey: 'id' });
                }
            },
            timestamps: false
        });
    return PDMovementTypes;
}
