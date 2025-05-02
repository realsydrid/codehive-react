import CommunityModifyPostForm from "./CommunityForm/modifyPostForm.jsx";
import {useEffect, useState} from "react";
import {ModifyPost, ReadPost} from "./CommunityUtil/CommunityPostFetch.js";
import Loading from "./CommunityForm/Loading.jsx";
import {useNavigate, useParams} from "react-router-dom";

export default function CommunityPostModifyPage(){
    const {postNo}=useParams();
    const [post, setPost] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!postNo){return;}
        const BeforePost = async () => {
            const res = await ReadPost(postNo); // res = { 0: {...} }
            const values = Object.values(res);
            const postData = values[0];
            setPost(postData);
            setIsLoading(false);
        };
        BeforePost();
    },[postNo])
    const handleSubmit = async (newPostCont)=>{
        await ModifyPost(postNo,newPostCont);
        setIsLoading(false);
    }
    if(isLoading){return <Loading/>}
    if(!post){
        alert("게시글을 찾을 수 없습니다.")
        return navigate("/community/free")
    }
    return (
        <CommunityModifyPostForm post={post} onSubmit={handleSubmit}/>
    )
}