import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityComponents/CommunityCreatePostForm.jsx";
import {Link} from "react-router-dom";
import "./CommunityPost.css";
import CommunityTitle from "./CommunityForm/CommunityTitle.jsx";
import CommunityPostsPage from "./CommunityForm/CommunityPostPage.jsx";

export default function CommunityExpertPostsPage() {
    return (
        <div className={"container"}>
            <CommunityNavbar/>
            <div className={"AllPosts"}>
                <CommunityTitle category={"expert"}/>
                <CommunityCreatePostForm category={"expert"}/>
                <CommunityPostsPage category={"expert"}/>
            </div>
        </div>
    )
    }