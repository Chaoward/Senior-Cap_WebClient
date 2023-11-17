import * as server from "./server-endpoints";

const DEFAULT_HEADER = {
    'Access-Corntrol-Allow-Origin': 'http://localhost:3000',
    "Content-Type": "application/json"
};

const cache = {
    labels: [],
    unverified: []
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
    await fetch(server.GET_getUnverifiedXs, {
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
                    item.imageUrl = server.gateway + item.imageUrl.substr(1);
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
        await fetch(server.POST_verify, {
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

    await fetch(server.POST_addLabel, {
        method: "POST",
        headers: DEFAULT_HEADER,
        body: JSON.stringify(newLabels)
    }).then(res => res.json().then(resJson => {
        respondJson = resJson;
        //refresh label cache with updated one
        if (resJson.successCount > 0)
            fetchLabels();
    }));

    callback(respondJson);
}


async function fetchLabels(callback) {
    await fetch(server.GET_getLabel, {
        method: "GET",
        headers: DEFAULT_HEADER
    }).then(res => res.json().then(resJson => {
        //returns a new array of labels
        cache.labels = resJson;
        callback(resJson);
    }));
}


async function fetchVersion(callback) {
    await fetch(server.GET_getModelVersion, {
        method: "GET",
        headers: DEFAULT_HEADER
    }).then(res => callback(res));
}


async function sendImage(image, label, confidence, callback) {
    try {
         // Upload the selected file to the server
         const formData = new FormData();
         formData.append('file', image);
         formData.append('Label', label);
         formData.append('confidence', confidence);

         //formData.append('id', image.name);
         //formData.append('imageUrl', image.name);

        let response = await fetch("http://54.215.250.216:5000/uploadV2", {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body: formData
        });

        if (response.ok) {
            // If the upload is successful, fetch the updated list of unverified images
            await fetchPending((resJson) => {
                console.log('Updated list of unverified images:', resJson);
            });
            callback(response);
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
    sendImage,
    testSend
}