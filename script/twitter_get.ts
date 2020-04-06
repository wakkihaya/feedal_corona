import {consumer_key,consumer_secret,access_token_key,access_token_secret} from './twitter_config'

var Twitter = require("twitter");
var client = new Twitter({consumer_key,consumer_secret,access_token_key,access_token_secret});

const twitterApiGet = function (url: string, params: any) {
    return new Promise((resolve,reject)=>{
        client.get(url,params,(error:any,response:any)=>{
            if(!error){
                resolve(response);
            }else{
                reject(error);
            }
        })
    })
};

var url: string = 'statuses/user_timeline';
var params: any = {screen_name: 'suadd',include_rts: true,since_id:"1246315248434303000"};

(async ()=>{
    try {
        const test = await twitterApiGet(url, params);
        console.log(test);
    }catch (e) {
        console.log(e)
    }

})();
