<template>
    <div class="container">
        <div class="feed" v-for = "category in category_list" v-bind:key="category">
            <h3>{{category}}</h3>
            <div class="feed-list" v-for = "article in article_list" v-bind:key="article">
                <div class="account">
                    {{article.user_id}}
                </div>
                <div class="url">
                    {{article.url}}
                </div>
                <div class="title">
                    {{article.title}}
                </div>
                <div class="numOfGrade">
                    <div class="rt">
                        {{article.rt}}
                    </div>
                    <div class="fav">
                        {{article.fav}}
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
    article_user_list: any[] = [];

    async created(){
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

    public getUserName(userId: string){ //article とuserをどう紐づけするか？
        db.collection("users")
            .doc(userId).get()
            .then(doc =>{
                if(!doc.exists) console.log("error");
                else {
                     this.article_user_list.push(doc.data());
                }
            });
    }
}
</script>

<style scoped>

</style>
