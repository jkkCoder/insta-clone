import React, { useState, useEffect,useContext } from 'react'
import {UserContext} from "../../App"
import {Link} from "react-router-dom"

const Home = () => {
    const [data, setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(() => {
        fetch("/allpost", {
            headers: {
                authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts)
            })
    }, [])

    const likePost = (id)=>{
        fetch("/like",{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id){       //update only for present post
                    // return result
                    return {...item,likes:result.likes}     //this is from comment section
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikePost = (id)=>{
        fetch("/unlike",{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id){
                    // return result
                    return {...item,likes:result.likes}
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
        fetch("/comment",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:postId,
                text:text
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id){        //adding comments to the particular post only
                    return {...item,comments:result.comments}
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div key={item._id} className="card home-card">
                            <div className="post-header">
                                <Link to={item.postedBy._id !== state._id?`/profile/${item.postedBy._id}` : "/profile"}><img className="small-circled" src={item.postedBy.pic}/></Link>
                                <h5 style={{padding:"6px"}}><Link to={item.postedBy._id !== state._id?`/profile/${item.postedBy._id}` : "/profile"}>{item.postedBy.name} </Link>
                                    {
                                        item.postedBy._id == state._id  //if this is ur account then only it will show
                                        &&
                                        <i className="material-icons" 
                                        style={{position:"absolute",right:"2%"}}    
                                        onClick={
                                            ()=>deletePost(item._id)
                                        }>delete</i>
                                    }
                                    
                                </h5>
                            </div>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {
                                    item.likes.includes(state._id)      //if user is liked then show unlike or else show like button
                                    ?<i className="material-icons" onClick={()=>unlikePost(item._id)}>thumb_down</i>
                                    :<i className="material-icons" onClick={()=>likePost(item._id)}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                <hr></hr>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                    e.target[0].value=""
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home
