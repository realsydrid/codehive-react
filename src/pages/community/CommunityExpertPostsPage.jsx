import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityForm/CommunityCreatePostForm.jsx";
import {Link} from "react-router-dom";
import "./CommunityPost.css";
import CommunityTitle from "./CommunityForm/CommunityTitle.jsx";
import CommunityPostsPage from "./CommunityForm/CommunityPostPage.jsx";
export default function CommunityExpertPostsPage() {
    return (
        <div className={"container"}>
            <CommunityNavbar/>
            <div>
                <Link to="/community/search">검색</Link>
                <CommunityTitle category={"expert"}/>
                <CommunityCreatePostForm category="expert" userNo={1}/>
                <CommunityPostsPage category={"expert"}/>
            </div>
        </div>
    )
    }