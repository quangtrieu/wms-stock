'use strict';

const fulfillmentService = require('../services/fulfillmentService');
const stockMovementService = require('../services/stockMovementService');
const redisClient = require('../../commons/redisCache');
const messageConstants = require('../constant/messageConstants');
const Utils = require('../../commons/utils');

var fulfillmentKey = {};

/**
 * Get all customer by paging
 */
exports.getFulfillment = function (req, res) {

    var currentPage = req.body.currentPage;
    var pageSize = req.body.pageSize;
    var data = JSON.stringify(req.body.data);
    var sort = JSON.stringify(req.body.sortColumn);
    fulfillmentKey = "fulfillment_" + currentPage + "_" + pageSize + "_" + data + "_" + sort;

    redisClient.get(fulfillmentKey, function (err, data) {
        if (err) {
            return console.log(err);
        }

        // check redis cache data
        if (false) {
            //get data from redis cache
            res.json(JSON.parse(data));
        } else {
            // call service to create data
            fulfillmentService
                .getFulfill(req.body)
                .then(function (result) {
                   var temp = [];
                    var parts = req.body.partListId.split(',');
                    for (var i = 0; i < parts.length; i++){
                        var partobj = {};
                        partobj.partId = parts[i];
                        partobj.uom =  parts[i];
                        var bin = [];
                        for (var row in result.rows){
                            if (partobj.partId == result.rows[row]['partId'])
                            {
                                var binobj = {};
                                binobj.binId =  result.rows[row]['binId'];
                                binobj.code = result.rows[row]['binId'];
                                binobj.quantity = parseInt(result.rows[row]['increase']) - parseInt(result.rows[row]['decrease']);
                                bin.push(binobj);
                            } 
                        }
                        partobj.bin = bin;
                        temp.push(partobj);
                    }
                    var response = {
                        success: true,
                        data: {
                            rows: temp
                        }
                    };
                    Utils.setRedisCache(fulfillmentKey, JSON.stringify(response));
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
exports.create = function (req, res) {//TODO: need change
    fulfillmentService.create(req.body)
        .then(result => {
            Utils.clearRedisCache(fulfillmentKey);
            res.json({ success: true, data: result.id });
            //insert stock movement
            req.body.fulfillmentId = result.id;
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
                // //stock movement
                // stockMovementService.update(req.body)
                //     .then(resultStock=>{
                //         if (result) {
                //             Utils.clearRedisCache(fulfillmentKey);
                //             res.json({ success: true, data: result.id });
                //         }
                //     })
            } else {
                res.json({ success: false, message: messageConstants.NOT_EXIST });
            }
        })
        .catch(err => {
            res.json({ success: false, message: messageConstants.ERROR });
        });
}