import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from "react-router-dom"
import { APP_URL } from '../../constants'

const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showfollow, setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(() => {
        fetch(APP_URL + `/user/${userid}`, {
            headers: {
                authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result)
            })
    }, [])

    useEffect(()=>{
        setShowFollow(state && !state.following.includes(userid))       //if state changes then it will be changed
    },state)

    const followUser = () => {
        fetch(APP_URL + "/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
            })
    }

    const unfollowUser = () => {
        fetch(APP_URL + "/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item=>item!== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)
            })
    }

    return (
        <>
            {userProfile ?
                <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={userProfile.user.pic}
                            />
                        </div>
                        <div>
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                            {
                                showfollow ?
                                    <button style={{margin:"10px"}} onClick={() => followUser()} className="btn waves-effect waves-light #64b5f6 blue darken-2" type="submit" name="action">
                                        Follow
                                    </button>
                                :
                                <button style={{margin:"10px"}} onClick={() => unfollowUser()} className="btn waves-effect waves-light #64b5f6 blue darken-2" type="submit" name="action">
                                    UnFollow
                                </button>
                            }  
                        </div>
                    </div>

                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                )
                            })
                        }
                    </div>

                </div>
                : <h2>Loading...!</h2>}
        </>
    )
}

export default Profile
