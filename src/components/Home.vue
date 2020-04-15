<template>
    <div class="container">
        <div class="feed">
            <div class="category">
                <button v-for="(category, index) in category_list"
                        :key="category.id"
                        :class="{ active: currentTab === index }"
                        @click="currentTab = index">{{ category.categoryName }}</button>
            </div>

            <div class="feed-content" v-for="category in activeCategory" v-bind:key="category.id">
                <div>
                    <div class="feed-list" v-for = "article in activeArticles(category.categoryName)" v-bind:key="article.category">
                        <div>
                            <div class="account" v-for ="user in user_list" v-bind:key = "user" >
                                <div class="account_image" v-if="user.id===article.user_id">
                                    <a :href="user.account_link">
                                        <img :src="user.image" >
                                    </a>
                                </div>
                                <div class="user_name" v-if="user.id===article.user_id">
                                    {{user.user_name}}
                                </div>
                                <div class="screen_name" v-if="user.id===article.user_id">
                                    @{{user.screen_name}}
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
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component,  Vue } from 'vue-property-decorator';
import {db} from '../firebase';

@Component
export default class Home extends Vue {
    category_list: { id?: number; categoryName?: string}[] = [{}];
    article_list: any[] =[];
    user_list: any[] = [];
    currentTab = 0;

    public activeArticles(value: string){
        const result = this.article_list.filter(article =>
            article.category === value
        );
        return result
    }

    async created(){

         await db.collection("users").get()
             .then((snapshot) =>{
                 snapshot.forEach((doc) =>{
                     const list:  { [key: string]: string } = {};
                     list["id"] = doc.id;
                     list["user_name"] = doc.data().user_name;
                     list["image"] = doc.data().user_image;
                     list["screen_name"] = doc.data().screen_name;
                     list["account_link"] = doc.data().account_link;
                     this.user_list.push(list)
                 })
             });

        //category を追加する
         await db.collection("categories")
            .get()
            .then((snapshot) =>{
                let i = 0;
                this.category_list.pop();
                snapshot.forEach(doc =>{
                    const array: { id: number; categoryName: string} = {id: i, categoryName: doc.data().name };
                    i++;
                    this.category_list.push(array);
                })
            });

         //created時は、category list の初めのもののみ表示。
         await db.collection("articles")
             .get()
             .then((snapshot) =>{
                 snapshot.forEach(doc=>{
                     this.article_list.push(doc.data());
                 })
             });


    }

    get activeCategory() {
        const result = this.category_list.filter(category =>
           category.id === this.currentTab
        );
        return result
    }



}
</script>

<style scoped lang="scss">
.container {

}

.feed{
    .category{
        background-color: #E14500;
        color: #fff;
    }
    .feed-list{
        border-bottom: solid 1px #7F828B;
        padding: 5% 5%;
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

    .account{
        display: flex;
        flex-direction: row;
        .account_image{
            border-radius: 5px;
        }
        .user_name{
            padding-left: 3%;
            width: 10%;
        }
        .screen_name{
            padding-left: 3%
        }
    }
}


</style>
