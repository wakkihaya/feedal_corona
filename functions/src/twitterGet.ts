import * as functions from 'firebase-functions';
import {db} from '../../src/firebase'

var Twitter = require("twitter");

const consumer_key = functions.config().twitter.consumer_key;
const consumer_secret = functions.config().twitter.consumer_secret;
const access_token_key = functions.config().twitter.access_token_key;
const access_token_secret = functions.config().twitter.access_token_secret;

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
                if(error){
                    console.log(error)
                }
                var i = 0;
                response.forEach(async(tweetItem: any) =>{
                    // console.log(tweetItem["text"]);
                    // console.log(tweetItem["entities"]);

                    if(i == 0) {  //since_id を最新のものに変更
                        var new_since_id = tweetItem["id"];
                        var updated_doc = {"since_id": new_since_id};
                        db.collection("users").doc(user_id).update(updated_doc);
                    }
                    i++;

                    var entities = tweetItem["entities"];
                    if(entities["urls"].length != 0){ //entities のurls が空でなかったら、シェアしたlinkあり
                        array.url = entities["urls"][0].expanded_url;
                        array.comment = tweetItem["text"];
                        array.rt = tweetItem["retweet_count"];
                        array.fav = tweetItem["favorite_count"];
                        array.createdAt = tweetItem["created_at"];
                        console.log("array",array);
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


export async function twitter_execute(){
    try {
        const url: string = 'statuses/user_timeline';

        db.collection("users").get()
            .then(async(snapshot: any) =>{
                for await(let doc of snapshot.docs){
                    var s_name: string = doc.data().screen_name;
                    var since_id: string | null = String(doc.data().since_id); //since_id はnumber型で収納されるため、stringに変換
                    var user_id: string = doc.id;
                    console.log(user_id);
                    if(since_id === ""){
                        var params: any = {
                            screen_name: s_name,
                            include_rts: true,
                            exclude_replies: true
                        };
                    }else {
                        var params: any = {
                            screen_name: s_name,
                            include_rts: true,
                            exclude_replies: true,
                            since_id: since_id
                        }; //suadd のsince_id: 1246277346417504256 , fukkyy のsince_id: 1247372966100267000
                    }
                    console.log("params",params);
                    await twitterApiGet(url,params,user_id);
                }
            });
    }catch (e) {
        console.log(e)
    }
}
