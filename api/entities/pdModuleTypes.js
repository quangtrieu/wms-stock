"use strict";

module.exports = function (sequelize, DataTypes) {
    var PDModuleTypes = sequelize.define('PDModuleTypes', {
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
                    PDModuleTypes.hasMany(models.ModuleMovementMatrix, { foreignKey: 'moduleTypeId', sourceKey: 'id' });
                }
            },
            timestamps: false
        });
    return PDModuleTypes;
}
