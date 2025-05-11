import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityForm/CommunityCreatePostForm.jsx";
import "./CommunityForm/CommunityPost.css";
import "./CommunityForm/CommunityTextArea.css";
import CommunityTitle from "./CommunityComponents/CommunityTitle.jsx";
import CommunityPostsPage from "./CommunityForm/CommunityPostPage.jsx";


export default function CommunityFreePostsPage(){
    return (
        <div className="container">
            <CommunityNavbar/>
            <div className={"AllPosts"}>
                <CommunityTitle category={"free"}/>
                <CommunityCreatePostForm category={"free"}/>
                <CommunityPostsPage category={"free"}/>
            </div>
        </div>
    )
}