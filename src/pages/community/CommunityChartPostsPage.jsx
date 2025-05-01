import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityForm/CommunityCreatePostForm.jsx";
import {Link} from "react-router-dom";
import "./CommunityPost.css";
import CommunityTitle from "./CommunityForm/CommunityTitle.jsx";
import CommunityPostsPage from "./CommunityForm/CommunityPostPage.jsx";
import {useContext} from "react";
import {UseLoginUserContext} from "../../provider/LoginUserProvider.jsx";

export default function CommunityChartPostsPage(){
    const [loginUser,]=useContext(UseLoginUserContext)
    if(!loginUser){
        return (
            <div>
                <CommunityNavbar/>
                <div className={"AllPosts"}>
                    <CommunityTitle category={"chart"}/>
                    <CommunityCreatePostForm category="expert" userNo={null}/>
                    <CommunityPostsPage category={"expert"}/>
                </div>
            </div>
        )
    }
    return (
        <div className={"container"}>
            <CommunityNavbar/>
            <div className={"mt-50"}>
                <Link to="/community/search">검색</Link>
                <CommunityTitle category={"chart"}/>
                <CommunityCreatePostForm category="chart"/>
                <CommunityPostsPage category={"chart"}/>
            </div>
        </div>
    )
}