'use strict';
const db = require('../entities');
const Paginator = require('../../commons/paginator');
const messageConstants = require('../constant/messageConstants');
/**
 * Create Stock Movement
 */
exports.getStock = function (searchModel) {
    var array = JSON.parse("[" + searchModel.partListId + "]");
     var filters = {};
    filters.$and = [{ isDeleted: 0 }];
    let orderby = 'id DESC';
    if (searchModel){
        if (searchModel.workshopId) {
            filters.$and.push({ workshopId: parseInt(searchModel.workshopId) })
        }
        if (searchModel.partListId){
            filters.$and.push({partId: {in: array }})
        }
    }
    return db.StockMovement.findAndCountAll({
        where: filters, order: orderby,
        include: [{
            model: db.PDMovementTypes,
            required: true
        }],
        attributes: ['partId', 'workshopId','binId',[db.PDMovementTypes.sequelize.col('code'),'code'],[db.StockMovement.sequelize.fn('SUM', db.StockMovement.sequelize.col('increase')), 'increase'],[db.StockMovement.sequelize.fn('SUM', db.StockMovement.sequelize.col('decrease')), 'decrease']],
        group: ['partId','workshopId','binId',db.PDMovementTypes.sequelize.col('code')],
    }, { raw: true });
}

/**
 * Create Stock Movement
 */
exports.create = function (obj) {
    obj.isDeleted = 0;
    obj.createdDateTime = Date();
    obj.status = 1;
    obj.fulfillmentId = obj.fulfillmentId;
    obj.partId = obj.partId;
    obj.typeId = 1;
    obj.workshopId =obj.workshopId;
    obj.binId = obj.binId;
    obj.grnId = 1;
    obj.adjId =1;
    obj.invoiceId = 1;
    obj.decrease = 2;
    obj.increase = 0;
    // return this.validate(obj, false).then(result => {
    //     if (result && !result.success) {
    //         return Promise.resolve(result);
    //     }
        return db.StockMovement.build(obj).save().then(result => {
            if (result) {
                return { success: true, message: util.format(messageConstants.COMMON_CREATE_SUCCESS, 'Stock Movement') };
            }
            return { success: false, message: util.format(messageConstants.COMMON_CREATE_FAIL, 'Stock Movement') };
        }).catch(err => {
            return Promise.resolve({ success: false, message: err });
        });
    //});
}

/**
 * Update Stock Movement
 */
exports.update = function (obj) {
    return objStockMovement = this.findById(obj.id).then(resultStockMovement => {
        if (resultStockMovement) {
            // return this.validate(obj, true).then(result => {
            //     if (result && !result.success) {
            //         return Promise.resolve(result);
            //     }
                obj.updatedDateTime = Date();
                return resultStockMovement.updateAttributes(obj).then(resultUpdate => {
                    if (resultUpdate) {
                        return Promise.resolve({ success: true, message: util.format(messageConstants.COMMON_UPDATE_SUCCESS, 'Stock Movement') });
                    }
                    return Promise.resolve({ success: false, message: util.format(messageConstants.COMMON_UPDATE_FAIL, 'Stock Movement') });
                });
            //});
        }
    });
}