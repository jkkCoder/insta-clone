const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const requireLogin = require("../middleware/requireLogin")
const Post = mongoose.model("Post")

router.get("/allpost",requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")       //if populate was not added then postedBy just shows id and not the full UserSchema
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")     //sorting posts in descending order
    .then(posts=>{
        // console.log(posts)
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get("/getsubpost",requireLogin,(req,res)=>{

    //if postedBy in following
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")       //if populate was not added then postedBy just shows id and not the full UserSchema
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")     //sorting posts in descending order
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post("/createpost",requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        return res.status(422).json({error:"please add all the fields"})  
    }
    req.user.password = undefined   //not store password in postSchea
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user       //req.user is through requireLogin middleware
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get("/mypost",requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}      //we are pushing in the likes array the id of user
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}      //we are removing in the likes array the id of user
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put("/comment",requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}      //we are pushing in the likes array the id of user
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){       //if error or post is not found
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})



module.exports = router