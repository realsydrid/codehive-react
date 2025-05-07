import Navbar from "react-bootstrap/Navbar";
import {Nav} from "react-bootstrap";

export default function NewsNavBar(){
    return (
        <Navbar expand='md' bg={"dark"} variant={"dark"} style={{position:"fixed",top:"3rem"
            ,left:0,marginLeft:0,minWidth:"32rem",width:"100%",maxWidth:"1000rem", zIndex: 1000}}>
            <Navbar.Toggle aria-controls="freePost"/>
            <Navbar.Collapse id="freePost" style={{marginLeft:"1rem",marginRight:"1rem", backgroundColor: "#212529", zIndex: 999}} >
                <Nav
                    style={{ height:'auto' ,maxHeight: '200px',minWidth:"32rem",width:"95%",maxWidth:"100rem"
                        ,display:"flex"
                        ,justifyContent:"space-between", alignItems:"center",fontSize:"1rem",overflow:"hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"}}
                    navbarScroll
                >

                    <Nav.Link href="/news" style={{color:"white",margin:"0.5rem 2rem 0.2rem 2rem"}}>뉴스 홈</Nav.Link>
                    <Nav.Link href="/news/fear-greed-index" style={{color:"white",margin:"0.5rem 2rem 0.2rem 2rem"}}>공포탐욕 인덱스</Nav.Link>
                    <Nav.Link href="/news/kimchi-premium" style={{color:"white",margin:"0.5rem 2rem 0.2rem 2rem"}}>가격 프리미엄</Nav.Link>
                    <Nav.Link href="/news/market-cap-ranking" style={{color:"white",margin:"0.5rem 2rem 0.2rem 2rem"}}>시가총액</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>

    )
}