"use strict";

module.exports = function (sequelize, DataTypes) {
    var FulfillmentLog = sequelize.define('FulfillmentLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        repairOrderId :
        {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        partId:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        binId:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        workshopId:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        roRequestQuantity:
        {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        outstandingQuantiy:
        {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        fulfillmentQuantity:
        {
            type: DataTypes.DECIMAL
        },
        availabilityQuantity:
        {
            type: DataTypes.DECIMAL
        },
        boRequestQuantity:
        {
            type: DataTypes.DECIMAL
        },
        boFulfillQuantity:
        {
            type: DataTypes.DECIMAL
        },
        isSubstitutePart:
        {
            type: DataTypes.BOOLEAN
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
                    FulfillmentLog.hasMany(models.StockMovement, { foreignKey: 'fulfillmentId', sourceKey: 'id' });
                }
            },
            timestamps: false
        });
    return FulfillmentLog;
}
