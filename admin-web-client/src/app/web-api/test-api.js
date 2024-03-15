//import * as api from "./api";
const api = require("./api");

/**
 * 
 * @param {Function} func 
 * @param {Object} expected 
 */
async function testEndpoint(func, param, expected) {
    expected = JSON.stringify(expected);
    const test = (out) => {
        out = JSON.stringify(out);
        if (out === expected)
            console.log("===== TEST SUCCESS ==============\n"
                + ` FUNCTION : ${func.name}\n`
                + "================================="
            );
        else {
            console.log("===== TEST FAILED ==============\n"
                + ` FUNCTION : ${func.name}\n`
                + ` OUTPUT : ${out}\n`
                + ` EXPECTED : ${expected}\n`
                + "================================"
            );
        }
    };

    
    if (param)
        func(param).then(test, test);
    else
        func().then(test, test);

}

//////////// EXECUTE ////////////////////////////////////
async function testFew() {
    await testEndpoint(api.setRelease, 2, { "success": true });
    //await testEndpoint(api.fetchVersions, undefined, []);
}

async function testAll() {
    await testEndpoint(api.fetchUnverified, undefined, [
        {
            id: 1,
            imgURL: 'chicken.png',
            label: 'bird'
        },
        {
            id: 2,
            imgURL: 'dino.png',
            label: 'dog'
        },
        {
            id: 3,
            imgURL: 'dog.png',
            label: 'dog'
        }
    ]);

    await testEndpoint(api.fetchLabels, undefined, [
        'dog',
        'bird',
        'frog',
        'popcorn',
        'burger',
        'cat',
        'chair',
    ]);

    await testEndpoint(api.insertLabel, ['whale'], { "count": 1, "success": true });

    await testEndpoint(api.fetchVersions, undefined, []);

    await testEndpoint(api.setRelease, 4, { "success": true });

    await testEndpoint(api.verify,
        [
            {
                id: 1,
                imgURL: 'chicken.png',
                label: 'bird'
            },
            {
                id: 2,
                imgURL: 'dino.png',
                label: 'dino'
            },
            {
                id: 3,
                imgURL: 'dog.png',
                label: 'dog'
            }
        ],
        {
            'count': 3,
            'success': true
        }
    );

    await testEndpoint(api.fetchUnverified, undefined, []);
}
testFew();