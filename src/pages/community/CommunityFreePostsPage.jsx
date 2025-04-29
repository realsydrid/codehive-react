import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityForm/CommunityCreatePostForm.jsx";
import {Link} from "react-router-dom";
import "./CommunityPost.css";
import CommunityTitle from "./CommunityForm/CommunityTitle.jsx";
import CommunityPostsPage from "./CommunityForm/CommunityPostPage.jsx";

export default function CommunityFreePostsPage(){

    return (
        <div className={"AllPosts"}>
            <CommunityNavbar/>
            <div>
                <CommunityTitle category={"free"}/>
                <CommunityCreatePostForm category="free" userNo={1}/>
                <CommunityPostsPage category={"free"}/>
            </div>
        </div>
    )
}