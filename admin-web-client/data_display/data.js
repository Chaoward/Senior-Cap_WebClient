const data = [
    {
        "imageURL": "https://cdn.britannica.com/16/234216-050-C66F8665/beagle-hound-dog.jpg",
        "tag": "cat"
    },
    {
        "imageURL": "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
        "tag": "dog"
    }
    ,

    {
        "imageURL": "https://upload.wikimedia.org/wikipedia/commons/d/dc/Young_cats.jpg",
        "tag": "cat"
    }
    ,
    {
        "imageURL": "https://i.pinimg.com/originals/20/f1/ca/20f1cae400dca1097b3a41c4b8c96e5c.png",
        "tag": "neither"
    }
];


async function fetchPending(callback) {
    //GET request
    //parse JSON
    //save and use
    callback();
}

async function sendVerified(callback) {
    //demo code
    callback();
    for (let i = 0; i < data.length; i++)
        delete data[i];

    //string JSON
    //POST request send verified data
    //clear data cache

    //callback();
}


module.exports = {
    data,
    fetchPending,
    sendVerified
}