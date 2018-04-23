'use strict';

module.exports = Object.freeze({
    SUCCESS: "Action is successfull",
    ERROR: "Have a error",

    // customer 
    CUSTOMER_EXIST_NAME: "Customer name already existed",
    CUSTOMER_DELETE_FAIL: "Delete customer fail",
    CUSTOMER_NOT_FOUND: "Customer not found",
    CUSTOMER_NAME_REQUIRED: "name must be required!",
    CUSTOMER_IDNUMBER_REQUIRED: "idNumber must be required!",
    CUSTOMER_CUSTOMER_TYPE_REQUIRED: "customer type must be required!",

    // PartMaster 
    EXIST_PARTMASTER: "PartMaster already existed",
    DELETE_PARTMASTER_ERROR: "Have error PartMaster when deleted",
    PARTMASTER_NOT_EXIST: "PartMaster is not exist",

    //vehicleMake
    VEHICLE_MAKE_EXIST_CODE: "Vehicle make code must be unique!",
    VEHICLE_MAKE_CREATE_SUCCESS: "Create vehicleMake success!",
    VEHICLE_MAKE_CREATE_FAIL: "Create vehicleMake fail!",
    VEHICLE_MAKE_UPDATE_SUCCESS: "Update vehicleMake success!",
    VEHICLE_MAKE_UPDATE_FAIL: "Update vehicleMake fail!",
    VEHICLE_MAKE_PARAM_REQUIRED: "The param must be required!",
    VEHICLE_MAKE_DESCRIPTION_REQUIRED: "description must be required!",
    VEHICLE_MAKE_NOT_FOUND  : "vehicle make not found!",

    // vehicle
    VEHICLE_EXIST_VIN_NO: "VinNo already existed",
    VEHICLE_NOTFOUND: "Vehicle not found",
    VEHICLE_CREATE_SUCCESS: "Create vehicle success!",
    VEHICLE_CREATE_FAIL: "Create vehicle fail!",
    VEHICLE_UPDATE_SUCCESS: "Update vehicle success!",
    VEHICLE_UPDATE_FAIL: "Update vehicle fail!",
    VEHICLE_VARIANT_REQUIRED: "variant must be required!",
    VEHICLE_VINNO_REQUIRED: "vinNo must be required!",

    // vehiclecustomer
    VEHICLE_CUSTOMER_EXIST_REGISTRATION_NO: "RegistrationNo already existed",
    VEHICLE_CUSTOMER_NOTFOUND: "Vehicle Customer not found",
    VEHICLE_CUSTOMER_REGISTRATION_NO_REQUIRED: "registrationNo must be required!",
    VEHICLE_CUSTOMER_VEHICLE_ID_REQUIRED: "vehicle must be required!",
    VEHICLE_CUSTOMER_CUSTOMER_ID_REQUIRED: "customer must be required!",

    //Common Message
    COMMON_CODE_REQUIRED: "code must be required!",
    COMMON_MAXLENGTH: "Please enter %s no more than %i characters",
    COMMON_RECORD_NOT_FOUND: "The record not found!",
    COMMON_CREATE_SUCCESS: "Create %s success!",
    COMMON_CREATE_FAIL: "Create %s fail!",
    COMMON_UPDATE_SUCCESS: "Update %s success!",
    COMMON_UPDATE_FAIL: "Update %s fail!",
    COMMON_PARAM_REQUIRED: "The param must be required!",
});