'use strict';

const fulfillmentService = require('../services/fulfillmentService');
const stockMovementService = require('../services/stockMovementService');
const redisClient = require('../../commons/redisCache');
const messageConstants = require('../constant/messageConstants');
const Utils = require('../../commons/utils');

var stockKey = {};

/**
 * Get all customer by paging
 */
exports.getStock = function (req, res) {

    var currentPage = req.body.currentPage;
    var pageSize = req.body.pageSize;
    var data = JSON.stringify(req.body.data);
    var sort = JSON.stringify(req.body.sortColumn);
    stockKey = "stock_" + currentPage + "_" + pageSize + "_" + data + "_" + sort;

    redisClient.get(stockKey, function (err, data) {
        if (err) {
            return console.log(err);
        }

        // check redis cache data
        if (false) {
            //get data from redis cache
            res.json(JSON.parse(data));
        } else {
            // call service to create data
            stockMovementService
                .getStock(req.body)
                .then(function (result) {
                    var temp = [];
                    for (var row in result.rows){
                        temp.push(
                            {
                                'partId' : result.rows[row]['partId'],
                                'workshopId': result.rows[row]['workshopId'],
                                'binId': result.rows[row]['binId'],
                                'code': result.rows[row]['PDMovementType']['code'],
                                'quantity': parseInt(result.rows[row]['increase']) - parseInt(result.rows[row]['decrease'])
                            }
                        );
                    }
                    var response = {
                        success: true,
                        data: {
                            rows: result.rows
                        }
                    };
                    Utils.setRedisCache(stockKey, JSON.stringify(response));
                    res.json(response);
                }).catch(function (error) {
                    console.log(error);
                }
                );
        }
    });
}

/**
 * Create new fulfillment log
 */
exports.create = function (req, res) {
    fulfillmentService.create(req.body)
        .then(result => {
            Utils.clearRedisCache(fulfillmentKey);
            res.json({ success: true, data: result.id });
            //insert stock movement
            stockMovementService.create(req.body)
                .then(resultStock=>{
                    res.json({ success: true, data: result.id });   
                })
        })
        .catch(err => {
            res.json({ success: false, message: messageConstants.ERROR });
        })
}

/**
 * Update fulfillment log
 */
exports.update = function (req, res) {
    fulfillmentService.update(req.body)
        .then(result => {
            if (result) {
                Utils.clearRedisCache(fulfillmentKey);
                res.json({ success: true, data: result.id });
                //stock movement
                stockMovementService.update(req.body)
                    .then(resultStock=>{
                        if (result) {
                            Utils.clearRedisCache(fulfillmentKey);
                            res.json({ success: true, data: result.id });
                        }
                    })
            } else {
                res.json({ success: false, message: messageConstants.NOT_EXIST });
            }
        })
        .catch(err => {
            res.json({ success: false, message: messageConstants.ERROR });
        });
}