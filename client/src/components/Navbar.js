import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../App"
import M from "materialize-css"

const Navbar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const [userDetails,setUserDetails] = useState([])
    const navigate = useNavigate()
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])
    const renderList = () => {
        if (state) {      //if state is there that means user is present
            return [
                <li key="7"><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,
                <li key="8"><Link to="/all">All users</Link></li>,
                <li key="1"><Link to="/profile">Profile</Link></li>,
                <li key="2"><Link to="/create">Create Post</Link></li>,
                <li key="3"><Link to="/myfollowingpost">My following Posts</Link></li>,
                <li key="4">
                    <button onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        navigate("/signin")
                    }} className="btn #c62828 red darken-3" type="submit" name="action">
                        Logout
                    </button>
                </li>
            ]
        } else {
            return [
                <li key="5"><Link to="/signin">Login</Link></li>,
                <li key="6"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    const fetchUsers=(query)=>{    
        setSearch(query)
        fetch("/search-users",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                query:query
            })
        }).then(res=>res.json())
        .then(results=>{
            setUserDetails(results.user)
        })
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>

            <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="search users"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                    />
                    <ul className="collection" style={{display:"grid"}}>
                        {
                            userDetails.map(item=>{
                                return <Link key={item._id} to={item._id !== state._id?"/profile/"+item._id:"/profile"} onClick={()=>{
                                    M.Modal.getInstance(searchModal.current).close()
                                    setSearch("")
                                }}><li className="collection-item">{item.email}</li></Link>
                            })
                        }
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch("")}>Close</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
