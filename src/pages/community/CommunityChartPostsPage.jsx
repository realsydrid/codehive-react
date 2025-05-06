import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityForm/CommunityCreatePostForm.jsx";
import {Link} from "react-router-dom";
import "./CommunityPost.css";
import CommunityTitle from "./CommunityForm/CommunityTitle.jsx";
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