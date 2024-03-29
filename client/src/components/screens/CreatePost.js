import React,{useState,useEffect} from 'react'
import {useNavigate} from "react-router-dom"
import M from "materialize-css"
import { APP_URL } from '../../constants'

const CreatePost = () => {
    const navigate = useNavigate()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{         //this will run after url is set in postDetails function
        if(!url)    return      //this effect will also run when component is mounted... so returning when url is not updated
        fetch(APP_URL + "/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html:"created post successfully",classes:"#43a047 green darken-1"})
                navigate("/")
            }
        })
    },[url])    

    const postDetails = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","jayeshkarn")
        fetch("https://api.cloudinary.com/v1_1/jayeshkarn/image/upload",{
            method:"POST",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            setUrl(data.url)
        }).catch(err=>{
            console.log(err)
        })
    }

    return (
        <div className="card input-filed" style={{
            margin: "30px auto",
            maxWidth: "500px",
            padding: "20px",
            textAlign: "center"
        }}>
            <input type="text" placeholder="title" value={title} onChange={e=>setTitle(e.target.value)}/>
            <input type="text" placeholder="body" value={body} onChange={e=>setBody(e.target.value)}/>
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-2">
                    <span>Upload Image</span>
                    <input type="file" onChange={e=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-2" type="submit" name="action"
                onClick={()=>postDetails()}>
                    Submit post
                </button>
        </div> 
    )
}

export default CreatePost
