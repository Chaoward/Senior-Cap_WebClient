const cache = [];


async function fetchPending(callback) {
    //GET request
    await fetch("https://flaskapp.jondooley87.repl.co/getUnverifiedXs", {
        method: "GET",
        headers: { 'Access-Corntrol-Allow-Origin': 'http://localhost:3000', "Content-Type": "application/json"}
        })  
        .then((res) => res.json()
        .then((resJson) => {
            //save to cache
            resJson.forEach(ele => cache.push(ele) );
            callback(resJson);
        }) );
    console.log(JSON.stringify(cache));
}



async function sendVerified(callback) {
    let alertString = cache.map( (x) => `Image${cache.indexOf(x)+1} : ${x.tag}\n`);
    let payload = [];

    //load payload and clear cache
    while (cache.length > 0) {
        payload.push( cache.pop() );
    }

    //string JSON
    payload = JSON.stringify(payload);

    //POST request send verified data
    await fetch("https://flaskapp.jondooley87.repl.co/updateUnverified", {
        method: "POST",
        headers: { 'Access-Corntrol-Allow-Origin': 'http://localhost:3000' },
        body: payload
    });

    alert(alertString);
    callback();
}


module.exports = {
    cache,
    fetchPending,
    sendVerified
}