import {consumer_key,consumer_secret,access_token_key,access_token_secret} from './twitter_config'
import {db} from '../src/firebase'
import set = Reflect.set;

var Twitter = require("twitter");
var client = new Twitter({consumer_key,consumer_secret,access_token_key,access_token_secret});

const twitterApiGet = function (url: string, params: any) {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
        client.get(url,params,(error:any,response:any)=>{
            var array: any =
                {
                url: "",
                image: "",
                title: "",
                comment: "",
                rt: null,
                fav: null,
                createdAt: "",
                user_id:""
            };
            response.forEach(async(tweetItem: any) =>{
                //console.log(tweetItem["text"]);
                //console.log(tweetItem["entities"]);

                var entities = tweetItem["entities"];
                if(entities["urls"].length != 0){ //entities のurls が空でなかったら、シェアしたlinkあり
                    array.url = entities["urls"][0].expanded_url;
                    array.comment = tweetItem["text"];
                    array.rt = tweetItem["retweet_count"];
                    array.fav = tweetItem["favorite_count"];
                    console.log(array);
                    //一つ一つのarray をDBに入れていく
                    await addDataToDb(array);
                }
            });
            resolve();
        });
        },2000);
    })
};

//data をfirestore に入れる
const addDataToDb = function (data: any) {
    return new Promise((resolve, reject)=>{
        db.collection("articles").add(data);
        resolve();
    })
};


var url: string = 'statuses/user_timeline';
var params: any = {screen_name: 'suadd',include_rts: true, exclude_replies: true, since_id:"1246277346417504256"};


//article のimage とtitle をupdate する関数


(async ()=>{
    try {
        const array = await twitterApiGet(url, params);
        console.log("owari")
       // await RequiredInfoGet(doc);
        // console.log(doc)
    }catch (e) {
        console.log(e)
    }

})();
