const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app=express();

app.set("views engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});

const articleSchema={
    title:String,
    content:String
};

const Article=mongoose.model("Article",articleSchema);
////////////////////////////////////////Request targetting all the elements////////////////////////////////////////////
app.route("/articles")
.get(function(req,res){
    Article.find({},function(err,results){
        res.send(results);
    });
})
.post(function(req,res){
    console.log();
    console.log();
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content

    })
    newArticle.save(function(err){
        if(!err)
        console.log("No errors");
        else
        console.log(err);
    });
})
.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(err)
        console.log(err);
        else
        console.log("Successfully deleted all the items");
    })
});

////////////////////////////////////////Request targetting specific elements////////////////////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
    const requestedArticleTitle=req.params.articleTitle;
    Article.findOne({title:requestedArticleTitle},function(err,foundArticle){
        if(foundArticle)
        {
            res.send(foundArticle);
        }
        else
        {
            res.send("No article was found");
        }
    })
})
.put(function(req,res){
    Article.update({title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err,results){
        if(!err)
        {
            res.send("Successfully updated the elements");
        }
        else{
            res.send(err);
        }
    })
})
.patch(function(req,res){
    Article.update({title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(err)
            res.send(err);
            else
            res.send("Successfully updated the selected item");
        })
})
.delete(function(err){
    Article.deleteOne({title:req.params.articleTitle},function(err){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send("Successfully deleted the selected article");
        }
    })
});
app.listen(3000,()=>{console.log("Server started at port 3000")});