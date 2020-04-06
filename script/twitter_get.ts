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
var params: any = {screen_name: 'suadd',include_rts: true, exclude_replies: true, since_id:"1246277346417504256"};

const RequiredInfoGet = function (doc: any) {
    return new Promise((resolve,reject)=>{
        var array: any = {
            url: "",
            comment: "",
            rt: null,
            fav: null,
        };
        doc.forEach((tweetItem: any) =>{
             //console.log(tweetItem["text"]);
            //console.log(tweetItem["entities"]);

            var entities = tweetItem["entities"];
             if(entities["urls"].length != 0){             //entities のurls が空でなかったら、シェアしたlinkあり
                 console.log(tweetItem["entities"]);
                 array.url = entities["urls"][0].expanded_url;
                 console.log(array.url);
             }

        })
    })
};

(async ()=>{
    try {
        const doc = await twitterApiGet(url, params);
        await RequiredInfoGet(doc);
        // console.log(doc)
    }catch (e) {
        console.log(e)
    }

})();
