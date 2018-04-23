'use strict';
const db = require('../entities');
const Paginator = require('../../commons/paginator');
const messageConstants = require('../constant/messageConstants');

/**
 * Get fulfillment
 */

exports.getFulfill = function (searchModel) {
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
            where: {code : 'WAQ'},
            required: true
        }],
        attributes: ['partId', 'workshopId','binId',[db.StockMovement.sequelize.fn('SUM', db.StockMovement.sequelize.col('increase')), 'increase'],[db.StockMovement.sequelize.fn('SUM', db.StockMovement.sequelize.col('decrease')), 'decrease']],
        group: ['partId','workshopId','binId'],
    }, { raw: true });
}


/**
 * Create FulfillmentLog
 */
exports.create = function (obj) {
    obj.isDeleted = 0;
    obj.createdDateTime = Date();
    obj.status = 1;

    // return this.validate(obj, false).then(result => {
    //     if (result && !result.success) {
    //         return Promise.resolve(result);
    //     }
        return db.FulfillmentLog.build(obj).save().then(result => {
            if (result) {
                //return { success: true, message: util.format(messageConstants.COMMON_CREATE_SUCCESS, 'FulfillmentLog') };
                return { success: true, id: result.id };
            }
            return { success: false, message: util.format(messageConstants.COMMON_CREATE_FAIL, 'FulfillmentLog') };
        }).catch(err => {
            return Promise.resolve({ success: false, message: err });
        });
  //  });
}
/**
 * Update FulfillmentLog
 */
exports.update = function (obj) {
    return objFulfillmentLog = this.findById(obj.id).then(resultFulfillmentLog => {
        if (resultFulfillmentLog) {
            // return this.validate(obj, true).then(result => {
            //     if (result && !result.success) {
            //         return Promise.resolve(result);
            //     }
                obj.updatedDateTime = Date();
                return resultFulfillmentLog.updateAttributes(obj).then(resultUpdate => {
                    if (resultUpdate) {
                        return Promise.resolve({ success: true, message: util.format(messageConstants.COMMON_UPDATE_SUCCESS, 'FulfillmentLog') });
                    }
                    return Promise.resolve({ success: false, message: util.format(messageConstants.COMMON_UPDATE_FAIL, 'FulfillmentLog') });
                });
            //});
        }
    });
}