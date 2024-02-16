import * as server from "./server-endpoints";

const DEFAULT_HEADER = {
    'Access-Corntrol-Allow-Origin': 'http://localhost:3000',
    "Content-Type": "application/json"
};

const cache = {
    labels: [],
    unverified: [],
    versions: {},
    /*
    "labels": ["dog", "cat"],
        "unverified": [
            {
                "imageUrl": "https://www.cdc.gov/healthypets/images/pets/cute-dog-headshot.jpg?_=42445",
                "Label": "dog"
            },
            {
                "imageUrl": "https://image.petmd.com/files/styles/978x550/public/dog-allergies.jpg",
                "Label": "cat"
            }
        ]*/
};


async function fetchPending(callback) {
    //GET request
    await fetch(server.GET_getUnverifiedWeb, {
        method: "GET",
        headers: DEFAULT_HEADER
    })
        .then((res) => res.json()
            .then((resJson) => {
                //save to cache
                //cache.labels = resJson.labels;
                console.log(JSON.stringify(resJson));
                cache.unverified = [];
                resJson.images.forEach(item => {
                    //NOTE: image urls is only the local path without the gateway. Must add begining address to path
                    item.imageUrl = server.gateway + item.imageUrl;
                    cache.unverified.push(item);
                });
                fetchLabels(() => { callback(resJson); });    //temp, since labels returned in this json is only the labels used in current image batch
            }));
    console.log(JSON.stringify(cache));
}



async function sendVerified(callback) {
    //let alertString = cache.map((x) => `Image${cache.indexOf(x) + 1} : ${x.tag}\n`);
    let response;

    //POST request send verified data
    try {
        await fetch(server.POST_verifyWeb, {
            method: "POST",
            headers: DEFAULT_HEADER,
            body: JSON.stringify(cache.unverified)
        })
        .then((res) => response = res);


        await response.json().then(resJson => {
            console.log(resJson);

            /*
            if (!resJson.success) {
                alert("POST request made but response was unsuccessful!");
                alert(resJson);
                return;
            }
            */
        });

        //clear cache
        cache.unverified = []

        callback();
    } catch (e) {
        console.error(e);
        alert(e);
    }
}


async function updateDataset(callback) {
    await fetch(server.GET_updateDataset, {
        method: "GET",
        headers: DEFAULT_HEADER
    }).then(res => callback(res));
}


/**
 * @param {String[]} newLabels
 * @param {*} callback
 *  
 */
async function sendLabels(newLabels, callback) {
    let respondJson = undefined;

    await fetch(server.POST_addLabelWeb, {
        method: "POST",
        headers: DEFAULT_HEADER,
        body: JSON.stringify({
            "labels": newLabels
        })
    }).then(res => res.json().then(resJson => {
        respondJson = resJson;
    }));

    if (respondJson.success)
        await fetchLabels();

    if (callback) callback(respondJson);
}


async function fetchLabels(callback) {
    await fetch(server.GET_getLabelWeb, {
        method: "GET",
        headers: DEFAULT_HEADER
    }).then(res => res.json().then(resJson => {
        //returns a new array of labels
        cache.labels = resJson;
        if (callback) callback(resJson);
    }));
}


async function fetchVersion(callback) {
    await fetch(server.GET_versionList, {
        method: "GET",
        headers: DEFAULT_HEADER
    }).then(res => res.json().then(resJson => {
        cache.versions = resJson;
        let verNums = Object.keys(cache.versions);
        callback( verNums.map((ver, index) => ver === "release" ? cache.versions[ver] : ver ));
    }));
}

async function setRelease(ver, callback) {
    await fetch(server.POST_setRelease, {
        method: "POST",
        headers: DEFAULT_HEADER,
        body: JSON.stringify({release: ver})
    });

    await fetchVersion(callback);
}


async function sendImages(imgDataList, callback) {
    try {
        console.log(imgDataList);
         // convert files to multi-form data
         const formData = new FormData();
         for (let i = 0; i < imgDataList.length; i++) {
            formData.append(`files[]`, imgDataList[i].image);
            formData.append(`Labels[]`, imgDataList[i].label);
        }
        formData.append('confidence', -1);

         //formData.append('id', image.name);
         //formData.append('imageUrl', image.name);

        // Upload the selected file to the server
        let response = await fetch(server.POST_uploadImages, {
            method: "POST",
            headers: DEFAULT_HEADER,
            body: formData
        });

        if (response.ok) {
            // If the upload is successful, fetch the updated list of unverified images
            await fetchPending((resJson) => {
                console.log('Updated list of unverified images:', resJson);
            });
            if (callback) callback(response);
        } else {
            console.log(response);
            console.error('Image upload failed');
        }
    }
    catch (e) {
        console.error(e);
        alert(e);
    }
}


/* ========= DEBUG ============== */
async function testSend() {
    await fetch(server.POST_upload, {
        method: 'POST',
        headers: DEFAULT_HEADER,
        body: "cat123565.png"
    }).then(res => console.log(res));
}




module.exports = {
    cache,
    fetchPending,
    sendVerified,
    sendLabels,
    fetchLabels,
    updateDataset,
    fetchVersion,
    setRelease,
    sendImages,
    testSend
}