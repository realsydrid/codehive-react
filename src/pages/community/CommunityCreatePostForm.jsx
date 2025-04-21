import {CreatePosts} from "./CommunityFetch.jsx";

export default function CommunityCreatePostForm(){
    return (
        <>
            <form style={{width:"80%", height:"400px",display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column",
            minWidth:"800px",maxWidth:"1500px"}} onSubmit={}>
                <div>
            <textarea name={"postCont"} style={{placeholder:"안녕하세요!",minWidth:"800px",maxWidth:"1500px", height:"400px",resize:"none",fontSize:"20px"}}></textarea>
              <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",minWidth:"800px",maxWidth:"1500px"}}>
                  <button  type="button">이미지 첨부</button>
                  <button  type="button">게시하기</button>
              </div>
                </div>
            </form>
        </>
    )
}