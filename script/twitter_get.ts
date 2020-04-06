import {consumer_key,consumer_secret,access_token_key,access_token_secret} from './twitter_config'
import {db} from '../src/firebase'
import set = Reflect.set;

var Twitter = require("twitter");
var client = new Twitter({consumer_key,consumer_secret,access_token_key,access_token_secret});

const twitterApiGet = function (url: string, params: any, user_id: string) {
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
                user_id: user_id
            };
            var new_since_id: string = "";
            response.forEach(async(tweetItem: any) =>{
                //console.log(tweetItem["text"]);
                //console.log(tweetItem["entities"]);

                var entities = tweetItem["entities"];
                if(entities["urls"].length != 0){ //entities のurls が空でなかったら、シェアしたlinkあり
                    array.url = entities["urls"][0].expanded_url;
                    array.comment = tweetItem["text"];
                    array.rt = tweetItem["retweet_count"];
                    array.fav = tweetItem["favorite_count"];
                    array.createdAt = tweetItem["created_at"];
                    console.log(array);
                    new_since_id = tweetItem["id"];

                    //一つ一つのarray をDBに入れていく
                   await addDataToDb(array);
                }
            });
            //since_id を最新のものに変更
            var updated_doc = {"since_id": new_since_id };
            db.collection("users").doc(user_id).update(updated_doc);

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

//article のimage とtitle をupdate する関数


(async ()=>{
    try {
        const url: string = 'statuses/user_timeline';

        db.collection("users").get()
            .then(async(snapshot) =>{
                for await(let doc of snapshot.docs){
                    var s_name: string = doc.data().screen_name;
                    var since_id: string = doc.data().since_id;
                    var user_id: string = doc.id;
                    console.log(user_id);
                    var params: any = {screen_name: s_name,include_rts: true, exclude_replies: true, since_id: since_id}; //suadd のsince_id: 1246277346417504256
                    await twitterApiGet(url,params,user_id);
                }
            });
    }catch (e) {
        console.log(e)
    }

})();
