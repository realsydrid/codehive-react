import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityForm/CommunityCreatePostForm.jsx";
import "./CommunityPost.css";
import "./CommunityTextArea.css";
import CommunityTitle from "./CommunityForm/CommunityTitle.jsx";
import CommunityPostsPage from "./CommunityForm/CommunityPostPage.jsx";
import {UseLoginUserContext} from "../../provider/LoginUserProvider.jsx";
import {useContext} from "react";

export default function CommunityFreePostsPage(){
    const [loginUser,]=useContext(UseLoginUserContext)
    if(!loginUser){
        return (
            <div>
                <CommunityNavbar/>
                <div className={"AllPosts"}>
                    <CommunityTitle category={"free"}/>
                    <CommunityCreatePostForm category="free"/>
                    <CommunityPostsPage category={"free"}/>
                </div>
            </div>
        )
    }
    return (
        <div>
            <CommunityNavbar/>
            <div className={"AllPosts"}>
                <CommunityTitle category={"free"}/>
                <CommunityCreatePostForm category="free"/>
                <CommunityPostsPage category={"free"}/>
            </div>
        </div>
    )
}