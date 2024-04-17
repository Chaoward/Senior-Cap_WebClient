var _default = "http://13.57.32.134:5000/";
var debug = "http://127.0.0.1:5000/"; //"http://192.168.1.72:2000/"; //"http://127.0.0.1:2000/";
_default = debug;

const DEFAULT_HEADER = {
    'Access-Corntrol-Allow-Origin': 'http://localhost:3000',
    "Content-Type": "application/json"
};

const cache = {
    labels: [],
    unverified: [],
    versions: [
        /*
        {
          version: "999.0.2",
          date: "2024-1-12",
          images: 4,
          labels: [],
          size: 8098239,
          //newLabels: ["cow", "horse", "goat"],
        },*/
        {
          version: "999.1.1",
          date: "2024-1-22",
          images: 2,
          labels: [{count:1, label: "sample"}],
          size: 24000,
          //newLabels: ["rabbit", "cat", "daisy", "fox", "ant", "bird"],
        },
      ],
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

    //temp
    for (let i = 0; i < cache.unverified.length; ++i) {
        cache.unverified[i].label = cache.unverified[i].sysLabel;
    }

    return Promise.resolve(json);
}


/**
 * @param {List<{file, label: String}>} files
 */
async function uploadImages(files) {
    //parse files to formData
    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i].file);
        formData.append("label", files[i].label);
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

async function setRelease(versionID) {
    if (!versionID) throw "Must provide an ID of the version to be set as release.";
    let data = {verID: versionID};

    let resJson = await makeRequest("models/release", "PUT", JSON.stringify(data));

    if (resJson.success) {
        const newVer = cache.versions.filter((ver) => ver.id == versionID)[0];
        cache.release = {
            version: newVer.version,
            id: newVer.id
        };
        return Promise.resolve(resJson);
    }
    else 
        Promise.reject(resJson);
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
    cache
};