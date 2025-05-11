import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityForm/CommunityCreatePostForm.jsx";
import {Link} from "react-router-dom";
import "./CommunityForm/CommunityPost.css";
import CommunityTitle from "./CommunityComponents/CommunityTitle.jsx";
import CommunityPostsPage from "./CommunityForm/CommunityPostPage.jsx";


export default function CommunityChartPostsPage(){
    return (
        <div className={"container"}>
            <CommunityNavbar/>
            <div className={"AllPosts"}>
                <CommunityTitle category={"chart"}/>
                <CommunityCreatePostForm category="chart"/>
                <CommunityPostsPage category={"chart"}/>
            </div>
        </div>
    )
}