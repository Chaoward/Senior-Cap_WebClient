const cache = {
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
        ]
};

//TODO: edit fetches to match new data format

async function fetchPending(callback) {
    //GET request
    await fetch("https://flaskapp.jondooley87.repl.co/getUnverifiedXs", {
        method: "GET",
        headers: { 'Access-Corntrol-Allow-Origin': 'http://localhost:3000', "Content-Type": "application/json" }
    })
        .then((res) => res.json()
            .then((resJson) => {
                //save to cache
                resJson.forEach(ele => cache.push(ele));
                callback(resJson);
            }));
    console.log(JSON.stringify(cache));
}



async function sendVerified(callback) {
    //let alertString = cache.map((x) => `Image${cache.indexOf(x) + 1} : ${x.tag}\n`);
    let response;

    //POST request send verified data
    try {
        await fetch("https://flaskapp.jondooley87.repl.co/updateUnverified", {
            method: "POST",
            headers: { 'Access-Corntrol-Allow-Origin': 'http://localhost:3000', "Content-Type": "application/json" },
            body: JSON.stringify(cache)
        })
        .then((res) => response = res);


        await response.json().then(resJson => {
            console.log(resJson);
            
            /*
            if (!resJson.success) {
                alert("POST request made but response was unsuccessful!");
                alert(resJson);
                return;
            }*/
        });

        //clear cache
        while (cache.length > 0)
            cache.pop();

        callback();
    } catch (e) {
        console.error(e);
        alert(e);
    }
}


module.exports = {
    cache,
    fetchPending,
    sendVerified
}