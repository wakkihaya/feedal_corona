<template>
    <div class="container">
        <div class="feed" v-for = "category in category_list" v-bind:key="category">
            <h3>{{category}}</h3>
            <div class="feed-list" v-for = "article in article_list" v-bind:key="article">
                <div class="account" v-for ="user in user_list" v-bind:key = "user">
                    <div class="account_image" v-if="user.id===article.user_id">
                        <img :src="user.image" >
                    </div>
                    <div class="user_name" v-if="user.id===article.user_id">
                        {{user.user_name}}
                    </div>
                    <div class="screen_name" v-if="user.id===article.user_id">
                        {{user.screen_name}}
                    </div>
                </div>
                <div class="comment">
                    {{article.comment}}
                </div>
                <div class="url">
                    <a :href="article.url">
                    <img :src="article.image" />
                        <div class="title">
                            title test
<!--                            {{article.title}}-->
                        </div>
                    </a>
                </div>

                <div class="numOfGrade">
                    <div class="rt">
                        RT {{article.rt}}
                    </div>
                    <div class="fav">
                        Fav {{article.fav}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component,  Vue } from 'vue-property-decorator';
import {db} from '../firebase';

@Component
export default class Home extends Vue {
    category_list: string[] = [];
    article_list: any[] =[];
    user_list: any[] = [];

    async created(){

         await db.collection("users").get()
             .then((snapshot) =>{
                 snapshot.forEach((doc) =>{
                     const list:  { [key: string]: string } = {};
                     list["id"] = doc.id;
                     list["user_name"] = doc.data().user_name;
                     list["image"] = doc.data().user_image;
                     list["screen_name"] = doc.data().screen_name;
                     this.user_list.push(list)
                 })
             });

         await db.collection("categories").get()
            .then((snapshot) =>{
                snapshot.forEach((doc) =>{
                    this.category_list.push(doc.data().name);
                })
            });

         //created時は、category list の初めのもののみ表示。
         await db.collection("articles")
             .where("category","==",this.category_list[0])
             .get()
             .then((snapshot) =>{
                 snapshot.forEach(async (doc)=>{
                     this.article_list.push(doc.data());
                    // await this.getUserName(doc.data().user_id);
                 })
             });

    }

    // public getUserName(userId: string){ //article とuserをどう紐づけするか？
    //     db.collection("users")
    //         .doc(userId).get()
    //         .then(doc =>{
    //             if(!doc.exists) console.log("error");
    //             else {
    //                  this.article_user_list.push(doc.data());
    //             }
    //         });
    // }
}
</script>

<style scoped lang="scss">
.container {

}

.feed{
    h3{
        background-color: #E14500;
        color: #fff;
    }
    .feed-list{
        border-bottom: solid 1px #7F828B;
        padding: 5% 0;
        .account{

        }
        .comment{
            margin: 3%;
        }
        .numOfGrade{
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-top: 3%;
            .rt{
                margin-right: 5%;
            }
        }
    }

    .url{
        width: 65%;
        margin:auto;
        box-shadow:  0 0 8px #4c4c4c;
        position: relative;
        a{
            text-decoration: none;
        }
        img{
            width: 100%;
        }
        .title{
            position:absolute;
            bottom:0;
            height: 20%;
            width:100%;
            background-color: rgba(0,0,0,0.7);
            text-align: center;
            color: #fff;
        }
    }
}


</style>
