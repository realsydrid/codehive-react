import CommunityNavbar from "./CommunityComponents/CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityComponents/CommunityCreatePostForm.jsx";
import "./CommunityPost.css";
import "./CommunityTextArea.css";
import CommunityTitle from "./CommunityForm/CommunityTitle.jsx";
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