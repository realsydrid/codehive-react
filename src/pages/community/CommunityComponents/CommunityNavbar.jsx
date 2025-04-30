
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import {Nav} from "react-bootstrap";

export default function CommunityNavbar() {

    return (
        <Navbar expand='md' bg={"dark"} variant={"dark"} style={{position:"fixed",top:"3rem"
            ,left:0,marginLeft:0,minWidth:"32rem",width:"100%",maxWidth:"1000rem"}}>
                <Navbar.Toggle aria-controls="freePost"/>
                <Navbar.Collapse id="freePost" style={{marginLeft:"1rem",marginRight:"1rem"}} >
                    <Nav
                        style={{ height:'auto' ,maxHeight: '200px',minWidth:"32rem",width:"95%",maxWidth:"100rem"
                            ,display:"flex"
                            ,justifyContent:"space-between", alignItems:"center",fontSize:"1rem",overflow:"hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"}}
                        navbarScroll
                    >
                        <Nav.Link href="/community/free" style={{color:"white",margin:"0.5rem 2rem 0.2rem 2rem"}}>자유 게시판</Nav.Link>
                        <Nav.Link href="/community/pnl" style={{color:"white",margin:"0.2rem 2rem 0.2rem 2rem"}}>손익인증 게시판</Nav.Link>
                        <Nav.Link href="/community/chart" style={{color:"white",margin:"0.2rem 2rem 0.2rem 2rem"}}>차트분석 게시판</Nav.Link>
                        <Nav.Link href="/community/expert" style={{color:"white",margin:"0.2rem 2rem 0.2rem 2rem"}}>전문가 게시판</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
        </Navbar>

    )
}