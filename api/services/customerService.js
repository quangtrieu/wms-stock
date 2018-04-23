'use strict';
const db = require('../entities');
const Paginator = require('../../commons/paginator');
const messageConstants = require('../constant/messageConstants');

/**
 * Returns a list of customer
 * @param   {req}   
 * @returns {Promise} resolved customers if found, otherwise resolves undefined
 */
exports.getAll = function (searchViewModel) {

    var searchModel = searchViewModel.data;
    var sortColumn = searchViewModel.sortColumn;
    let skip = null, limit = null, paginator = null;

    paginator = new Paginator(searchViewModel.currentPage, searchViewModel.pageSize);
    limit = paginator.getLimit();
    skip = paginator.getOffset();

    var filters = {};
    filters.$and = [{ isDeleted: 0 }];
    if (searchModel) {
        if (searchModel.code) {
            filters.$and.push({ code: { $like: '%' + searchModel.code + '%' } })
        }

        if (searchModel.name) {
            filters.$and.push({ name: { $like: '%' + searchModel.name + '%' } })
        }

        if (searchModel.idNumber) {
            filters.$and.push({ idNumber: { $like: '%' + searchModel.idNumber + '%' } })
        }

        if (searchModel.contact) {
            filters.$and.push({ contact: { $like: '%' + searchModel.contact + '%' } })
        }

        if ((searchModel.status != null && searchModel.status != "") || searchModel.status == 0) {
            filters.$and.push({ status: { $eq: searchModel.status } })
        }
    }

    // sorting
    let orderby = 'id DESC';
    if (sortColumn && sortColumn.columnName != null) {
        if (sortColumn.columnName && sortColumn.isAsc) {
            orderby = sortColumn.columnName + ' ASC';
        } else {
            orderby = sortColumn.columnName + ' DESC';
        }
    }

    return db.Customer.findAndCountAll({
        where: filters, order: orderby, offset: paginator.getOffset(), limit: paginator.getLimit(),
        attributes: ['id', 'code', "name", "status", "idNumber", "contact"]
    }, { raw: true });
}

/**
 * Get customer by id
 */
exports.getById = function (id) {
    return db.Customer.find({ where: { id: id } });
}

/**
 * Check exist customer code
 */
exports.getByCode = function (code) {
    return db.Customer.find({
        where: { code: code },
        attributes: ['id', 'code']
    });
}

/**
 * validate form for customer
 */
exports.validate = function (customer, isUpdate) {
    if (customer) {
        if ((customer.code == null || customer.code == "") && !isUpdate) {
            return Promise.resolve({ success: false, message: messageConstants.COMMON_CODE_REQUIRED });
        } else if (customer.code.length > 25 && !isUpdate) {
            return Promise.resolve({ success: false, message: util.format(messageConstants.COMMON_MAXLENGTH, 'code', 25) });
        } else if (customer.name == null || customer.name == "") {
            return Promise.resolve({ success: false, message: messageConstants.CUSTOMER_NAME_REQUIRED });
        } else if (customer.customerType == null || customer.customerType == "") {
            return Promise.resolve({ success: false, message: messageConstants.CUSTOMER_CUSTOMER_TYPE_REQUIRED });
        }
        return Promise.resolve({ success: true });
    }
    return Promise.resolve({ success: false, message: messageConstants.COMMON_PARAM_REQUIRED });
}

/**
 * Create customer
 */
exports.create = function (obj) {
    obj.isDeleted = 0;
    obj.createdDateTime = Date();
    obj.status = 1;

    return this.validate(obj, false).then(result => {
        if (result && !result.success) {
            return Promise.resolve(result);
        }
        return db.Customer.build(obj).save().then(result => {
            if (result) {
                return { success: true, message: util.format(messageConstants.COMMON_CREATE_SUCCESS, 'customer') };
            }
            return { success: false, message: util.format(messageConstants.COMMON_CREATE_FAIL, 'customer') };
        }).catch(err => {
            return Promise.resolve({ success: false, message: err });
        });
    });
}

/**
 * Update customer
 */
exports.update = function (obj) {
    return objCustomer = this.findById(obj.id).then(resultCustomer => {
        if (resultCustomer) {
            return this.validate(obj, true).then(result => {
                if (result && !result.success) {
                    return Promise.resolve(result);
                }
                obj.updatedDateTime = Date();
                return resultCustomer.updateAttributes(obj).then(resultUpdate => {
                    if (resultUpdate) {
                        return Promise.resolve({ success: true, message: util.format(messageConstants.COMMON_UPDATE_SUCCESS, 'customer') });
                    }
                    return Promise.resolve({ success: false, message: util.format(messageConstants.COMMON_UPDATE_FAIL, 'customer') });
                });
            });
        }
    });
}

/**
 * Delete customer
 */
exports.delete = function (obj) {
    var objCustomer = this.findById(obj);
    objCustomer.then(result => {
        if (result) {
            return result.updateAttributes({ isDeleted: 1, updatedDateTime: Date() });
        }
    })
    return objCustomer;
}

/**
 * Delete customers
 */
exports.deletes = function (obj) {
    if (obj.split(",").length > 1) {
        obj.split(",").forEach(prop => {
            var objCustomer = this.findById(prop);
            objCustomer.then(result => {
                if (result) {
                    result.updateAttributes({ isDeleted: 1, updatedDateTime: Date() });
                }
            })
        });

        return Promise.resolve(true);
    }

    return Promise.resolve(false);
}
