
var _default = "http://54.215.250.216:5000/";
var debug = "http://127.0.0.1:2000/";
_default = debug;

module.exports = {
    gateway: _default,
    GET_getUnverifiedXs: _default + "getUnverifiedXs",
    POST_verify: _default + "verifyObject",
    GET_updateDataset: _default + "updateTrainingData",
    POST_addLabel: _default + "addLabel",
    GET_getLabel: _default + "getLabels",
    GET_getModelVersion: _default + "getModelVersion",
    GET_getModel: _default + "getModel",
    POST_upload: _default + "uploadV2",
    //web made
    GET_getUnverifiedWeb: _default + "web_getUnverfified",
    POST_verifyWeb: _default + "web_verify",
    POST_addLabelWeb: _default + "web_addLabels",
    GET_getLabelWeb: _default + "web_getLabels"
}