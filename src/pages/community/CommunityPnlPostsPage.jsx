import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityForm/CommunityCreatePostForm.jsx";
import "./CommunityForm/CommunityPostList.css";
import CommunityTitle from "./CommunityComponents/CommunityTitle.jsx";
import CommunityPostsPage from "./CommunityForm/CommunityPostPage.jsx";

export default function CommunityPnlPostsPage() {
    return (
        <div className={"container"}>
            <CommunityNavbar/>
            <div className={"AllPosts"}>
                <CommunityTitle category={"pnl"}/>
                <CommunityCreatePostForm category={"pnl"}/>
                <CommunityPostsPage category={"pnl"}/>
            </div>
        </div>
    )
}