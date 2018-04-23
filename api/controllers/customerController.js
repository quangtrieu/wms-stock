'use strict';

const customerService = require('../services/customerService');
const redisClient = require('../../commons/redisCache');
const messageConstants = require('../constant/messageConstants');
const Utils = require('../../commons/utils');

var customerKey = {};

/**
 * Get all customer by paging
 */
exports.getAll = function (req, res) {

    var currentPage = req.body.currentPage;
    var pageSize = req.body.pageSize;
    var data = JSON.stringify(req.body.data);
    var sort = JSON.stringify(req.body.sortColumn);
    customerKey = "customer_" + currentPage + "_" + pageSize + "_" + data + "_" + sort;

    redisClient.get(customerKey, function (err, data) {
        if (err) {
            return console.log(err);
        }

        // check redis cache data
        if (data) {
            //get data from redis cache
            res.json(JSON.parse(data));
        } else {
            // call service to create data
            customerService
                .getAll(req.body)
                .then(function (result) {
                    var response = {
                        success: true,
                        data: {
                            count: (result != null) ? result.count : 0,
                            rows: result.rows
                        }
                    };
                    Utils.setRedisCache(customerKey, JSON.stringify(response));
                    res.json(response);
                }).catch(function (error) {
                    console.log(error);
                }
                );
        }
    });
}

/**
 * Get customer by id
 */
exports.getById = function (req, res) {
    customerService.getById(req.params.id).then(function (result) {
        var response = { success: true, data: result };
        res.json(response);
    }).catch(function (e) {
        console.log(e);
    });
}

/**
 * Get customer by code
 */
exports.getByCode = function (req, res) {
    customerService.getByCode(req.body.code)
        .then(result => {
            res.json({ success: true, data: result });
        })
        .catch(err => {
            res.json({ success: false, message: messageConstants.EXIST_CUSTOMER });
        });
}

/**
 * Create new customer
 */
exports.create = function (req, res) {
    customerService.getByCode(req.body.code).then(result => {
        if (result) {
            return res.json({ success: false, message: messageConstants.EXIST_CUSTOMER })
        }
        customerService.create(req.body)
            .then(result => {
                Utils.clearRedisCache(customerKey);
                res.json({ success: true, data: result.id });
            })
            .catch(err => {
                res.json({ success: false, message: messageConstants.ERROR });
            })
    })
}

/**
 * Update customer
 */
exports.update = function (req, res) {
    customerService.update(req.body)
        .then(result => {
            if (result) {
                Utils.clearRedisCache(customerKey);
                res.json({ success: true, data: result.id });
            } else {
                res.json({ success: false, message: messageConstants.NOT_EXIST });
            }
        })
        .catch(err => {
            res.json({ success: false, message: messageConstants.ERROR });
        });
}

/**
 * Delete customer by id
 */
exports.delete = function (req, res) {
    if (req.params.id.indexOf(",") > 0) {
        customerService.deletes(req.params.id)
            .then(result => {
                if (result) {
                    Utils.clearRedisCache(customerKey);
                    res.json({ success: true });
                } else {
                    res.json({ success: false, message: messageConstants.ERROR });
                }
            })
            .catch(err => {
                res.json({ success: false, message: err });
            }
            );
    } else {
        customerService.delete(req.params.id)
            .then(result => {
                if (result) {
                    Utils.clearRedisCache(customerKey);
                    res.json({ success: true });
                } else {
                    res.json({ success: false, message: messageConstants.NOT_EXIST });
                }
            })
            .catch(err => {
                res.json({ success: false, message: messageConstants.ERROR });
            }
            );
    }
}