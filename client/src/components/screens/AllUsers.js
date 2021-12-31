import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from "../../App"
import {Link} from "react-router-dom"

const AllUsers = () => {
    const { state } = useContext(UserContext)
    const [users, setUsers] = useState([])
    useEffect(() => {
        fetch("search-users", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: ""        //this will send all users
            })
        }).then(res => res.json())
        .then(results => {
            //remove the current user from that data
            // console.log(results.user)
            let usersExceptMe = results.user.filter(item=> item._id!==state._id)
            setUsers(usersExceptMe)
        })
    }, [])
    return (
        <div>
            <table className="centered">
                <thead>
                    <tr>
                        <th>Users</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        users.map(item => {
                            return (
                                <tr key={item._id}>
                                    <td style={{ cursor: "pointer" }}><Link to={"/profile/"+item._id}>{item.email}</Link></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

        </div>
    )
}

export default AllUsers
