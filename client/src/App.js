import React,{ useEffect,createContext,useReducer,useContext } from "react";
import Navbar from "./components/Navbar";
import "./App.css"
import { BrowserRouter, Routes, Route,useNavigate } from "react-router-dom"
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPost from "./components/screens/SubscribedUserPost";
import AllUsers from "./components/screens/AllUsers";
import {initialState,reducer} from "./reducers/useReducer"

export const UserContext = createContext()  //no export

const Routing = ()=>{     //this is component
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})    //this is for when user closes the window but didn't logged out

      // navigate("/")
    }
    else{
      navigate("/signin")
    }   
  },[])
  return(
    <Routes>
        <Route path="/" element={<Home/>} exact/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/profile" element={<Profile/>} exact/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/create" element={<CreatePost/>}/>
        <Route path="/profile/:userid" element={<UserProfile/>}/>
        <Route path="/myfollowingpost" element={<SubscribedUserPost/>}/>
        <Route path="/all" element={<AllUsers/>}/>
      </Routes>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;