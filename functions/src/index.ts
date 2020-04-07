import * as functions from 'firebase-functions'
import * as twitterGet from './twitterGet'

//twitterGet.ts を定期実行
export const twitterPubSec = functions.pubsub
    .topic('twitterGet').onPublish(message => {
        twitterGet.twitter_execute()
            .catch(e =>{console.log(e)})
    });
