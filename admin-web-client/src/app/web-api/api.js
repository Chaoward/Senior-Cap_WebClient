//TODO: fetch calls for all apis endpoints

var _default = "http://52.53.235.182/";
var debug = "http://127.0.0.1:5000/"; //"http://192.168.1.72:2000/"; //"http://127.0.0.1:2000/";
//_default = debug;

const DEFAULT_HEADER = {
    'Access-Corntrol-Allow-Origin': 'http://localhost:3000',
    "Content-Type": "application/json"
};

const cache = {
    labels: [],
    unverified: [],
    versions: [],
    release: {}
};

///// IMAGES ///////////////////////////////////////////////////////
/**
 * 
 * @returns {Promise<Array<Object>>} Promise of the list of unverifed
 *                                   imageURLs with their labels.
 */
async function fetchUnverified() {
    let json = await makeRequest("images/unverified", "GET");

    //save to memory/refresh cache
    cache.unverified = json ? json : [];

    return Promise.resolve(json);
}


/**
 * @param {List<{file, sysLabel: String, userLabel: String}>} files
 */
async function uploadImages(files) {
    //parse files to formData
    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i].file);
        formData.append("label", files[i].sysLabel);
        formData.append("userLabel", files[i].userLabel);
    }

    let res = await makeRequest("images/unverified", "POST", formData, {'Access-Corntrol-Allow-Origin': 'http://localhost:3000'});

    return Promise.resolve(res);
}


async function verify(imgList=cache.unverified) {
    let json = await makeRequest("images/unverified/verify", "PUT", JSON.stringify(imgList));

    cache.unverified = [];

    return Promise.resolve(json);
}


async function fetchVerfied() {
    return Promise.resolve( await makeRequest("images/verified", "GET") );
}


function fullURL(filename) {
    return _default + "images/" + filename;
}


///// LABELS ///////////////////////////////////////////////////////
async function fetchLabels() {
    let labelList = await makeRequest("labels", "GET");

    cache.labels = labelList ? labelList : [];

    return Promise.resolve(labelList);
}

async function insertLabel(newLabels) {
    let resJson = await makeRequest("labels", "POST", JSON.stringify(newLabels));

    return resJson.success ? Promise.resolve(resJson) : Promise.reject(resJson);
}

/*
async function fetchUserLabels() {
    try {
        const response = await makeRequest("userLables", "GET");
        if (!response.ok) {
            throw new Error("Failed to fetch user labels");
        }
        const userLabels = await response.json();
        return userLabels;
    } catch (error) {
        console.error("Error fetching user labels:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}
*/




///// MODELS ///////////////////////////////////////////////////////
async function fetchVersions() {
    let json = await makeRequest("models/info", "GET");

    //save to memory/refresh cache
    cache.versions = json;
    for (const ver of cache.versions) {
        if (ver.release) {
            cache.release = {
                version: ver.version,
                id: ver.id
            };
            break;
        }
    }

    return Promise.resolve(json);
}


async function removeVersion(idList) {
    let res = await makeRequest("models/", "DELETE", JSON.stringify({id: idList}));
    if (!res.success) {
        console.error(res.error);
        return Promise.reject(res);
    }

    await fetchVersions();
    
    return Promise.resolve(res);
}

async function setRelease(versionID) {
    if (!versionID) throw "Must provide a ID of the version to be set as release.";
    let data = {verID: versionID};

    let resJson = await makeRequest("models/release", "PUT", JSON.stringify(data));

    return resJson.success ? Promise.resolve(resJson) : Promise.reject(resJson);
}

async function trainModel() {
    let res = await makeRequest("images/train", "PUT");

    return Promise.resolve(res);
}



//===== makeRequest ===============================
/**
 * Performs a request to the MLNDE server on the passed
 * in endpoint name. Returns a JSON response of the
 * requested endpoint.
 * 
 * To be used privately for the other functions.
 * 
 * @param {String} endpoint
 * @param {String} _method 
 * @param {*} _body Empty string by default 
 * @param {Object} header Uses DEFAULT_HEADER
 * 
 * @returns {Object} JSON response from the endspoint.
 */
//=================================================
async function makeRequest(endpoint, _method, _body="", header=DEFAULT_HEADER) {
    try {
        let res = await fetch(_default+endpoint, {
            method: _method,
            headers: header,
            body: _method === "GET" ? undefined : _body
        });

        let resJson = await res.json();

        return resJson;
    } catch (e) {
        console.error(e);
    }
}



module.exports = {
    fetchLabels,
    fetchUnverified,
    fetchVerfied,
    fetchVersions,
    setRelease,
    verify,
    insertLabel,
    fullURL,
    uploadImages,
    trainModel,
    removeVersion,
    cache
};
