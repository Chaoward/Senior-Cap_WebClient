
var _default = "http://13.57.32.134:5000/";
var debug = "http://192.168.1.72:2000/"; //"http://127.0.0.1:2000/";
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
    POST_uploadImages: _default + "uploadImages",
    POST_setRelease: _default + "setRelease",
    GET_versionList: _default + "versionHistory",
    GET_getUnverifiedWeb: _default + "web_getUnverfified",
    POST_verifyWeb: _default + "web_verify",
    POST_addLabelWeb: _default + "web_addLabels",
    GET_getLabelWeb: _default + "web_getLabels"
}