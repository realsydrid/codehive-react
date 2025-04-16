export default function CommunityCreatePostForm(){
    return (
        <>
            <div style={{width:"80%", height:"400px",display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column"}}>
            <textarea name={"postCont"} style={{placeholder:"안녕하세요!"}}></textarea>
              <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                  <button  type="button">이미지 첨부</button>
                  <button  type="button">게시하기</button>
              </div>
            </div>
        </>
    )
}