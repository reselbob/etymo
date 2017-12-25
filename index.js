'use strict';
const Swagger = require('swagger-client');

exports.handler = function handler(event, context, callback) {
    /**************************************************
     helper function to get values associated with a property
     @param obj, the object to inspect
     @param key, the property to search for
     @param memo, an arbitrary holder variable, just provide a null variable
     **************************************************/
    function findNested(obj, key, memo) {
        let i;
        const proto = Object.prototype,
            ts = proto.toString,
            hasOwn = proto.hasOwnProperty.bind(obj);

        if ('[object Array]' !== ts.call(memo)) memo = [];

        for (i in obj) {
            if (hasOwn(i)) {
                if (i === key) {
                    memo.push(obj[i]);
                } else if ('[object Array]' === ts.call(obj[i]) || '[object Object]' === ts.call(obj[i])) {
                    findNested(obj[i], key, memo);
                }
            }
        }
        return memo;
    }

    if (!event.word) {
        callback(new Error('No word provided. Please provide a word for etymology lookup.'))
    }
    ;
    const url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/' + event.word;
    const synAntUrl = `https://od-api.oxforddictionaries.com:443/api/v1/entries/en/${event.word}/synonyms;antonyms`;
    const headers = {
        "Accept": "application/json",
        "app_id": process.env.APP_ID,
        "app_key": process.env.API_KEY
    };
    let request = {
        url: url,
        method: 'GET',
        headers: headers
    };
    //go to the delegate API and get etymology information
    let rtnObj = {};
    Swagger.http(request)
        .then((res) => {
            try {
                const data = JSON.parse(res.data).results[0].lexicalEntries[0].entries[0].etymologies[0];
                console.log({message: "from od-api.oxforddictionaries.com", data});
                rtnObj.etymology = data;
                //callback(null, {});
            } catch (err) {
                //No data is a problem
                console.error({message: "error from od-api.oxforddictionaries.com", err});
                callback(err);
            }
            // go get the synonyms and antonyms
            request = {
                url: synAntUrl,
                method: 'GET',
                headers: headers
            };
            return Swagger.http(request);
        })
        .then(res => {
            const obj = JSON.parse(res.data);
            let memo;
            rtnObj.synonyms = findNested(obj, 'synonyms', memo);
            rtnObj.antonyms = findNested(obj, 'antonyms', memo);
            callback(null, rtnObj);
        })
        .catch((err) => {
            // check to make sure that it's not a not found due to no synonym or antonym
            if (err.response.status === 404 && err.response.url.indexOf('synonyms;antonyms') !== -1) {
                console.log({message: "word not found", word: event.word, url: err.response.url});
                if (!rtnObj.etymology) rtnObj.etymology = null
                if (!rtnObj.synonyms) rtnObj.synonyms = null;
                if (!rtnObj.antonyms) rtnObj.antonyms = null;
                callback(null, rtnObj);
            } else {
                console.log({message: "error from od-api.oxforddictionaries.com", err});
                callback(err);
            }
        })
};