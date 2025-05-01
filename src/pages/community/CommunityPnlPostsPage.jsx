import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityForm/CommunityCreatePostForm.jsx";
import {Link} from "react-router-dom";
import "./CommunityPost.css";
import CommunityTitle from "./CommunityForm/CommunityTitle.jsx";
import CommunityPostsPage from "./CommunityForm/CommunityPostPage.jsx";
import {useContext} from "react";
import {UseLoginUserContext} from "../../provider/LoginUserProvider.jsx";
export default function CommunityPnlPostsPage() {
    const [loginUser,]=useContext(UseLoginUserContext)
    if(!loginUser){
        return (
            <div>
                <CommunityNavbar/>
                <div className={"AllPosts"}>
                    <CommunityTitle category={"pnl"}/>
                    <CommunityCreatePostForm category="pnl" userNo={null}/>
                    <CommunityPostsPage category={"pnl"}/>
                </div>
            </div>
        )
    }
    return (
        <div className={"container"}>
            <CommunityNavbar/>
            <div>
                <Link to="/community/search">검색</Link>
                <CommunityTitle category={"pnl"}/>
                <CommunityCreatePostForm category="pnl"/>
                <CommunityPostsPage category={"pnl"}/>
            </div>
        </div>
    )
    }