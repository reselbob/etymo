'use strict';
const Swagger = require('swagger-client');

exports.handler = function handler(event, context, callback){
    if(!event.word){
        callback(new Error('No word provided. Please provide a word for etymology lookup.'))
    };
    const url = 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/' + event.word;
    const headers = {
        "Accept": "application/json",
        "app_id": process.env.APP_ID,
        "app_key": process.env.API_KEY
    };
    const request = {
        url: url,
        method: 'GET',
        headers: headers
    };
    //go to the delegate API and get etymology information
    Swagger.http(request)
        .then((res) => {
            try{
                const data = JSON.parse(res.data).results[0].lexicalEntries[0].entries[0].etymologies[0];
                console.log({message:"from od-api.oxforddictionaries.com", data});
                callback(null, {etymology: data, word: event.word});
            }catch(err){
                //No data is a problem
                console.error({message:"error from od-api.oxforddictionaries.com", err});
                callback(err);
            }
        })
        .catch((err) => {
            console.log({message:"error from od-api.oxforddictionaries.com", err});
            callback(err);
            context.fail(err);
        })
};