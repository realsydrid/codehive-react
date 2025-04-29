
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import {Nav} from "react-bootstrap";

export default function CommunityNavbar() {

    return (
        <Navbar expand='sm' bg={"dark"} variant={"dark"} style={{position:"fixed",top:"3rem",marginLeft:0,minWidth:"80rem",width:"100%"}}>
                <Navbar.Toggle aria-controls="freePost"/>
                <Navbar.Collapse id="freePost" style={{marginLeft:"1rem",marginRight:"1rem"}} >
                    <Nav
                        style={{ height:'auto' ,maxHeight: '50px',width:"100%",marginTop:"0.5rem",minWidth:"10em"
                            ,margin:"0.5rem 1rem 0.5rem",display:"flex"
                            ,justifyContent:"center", alignItems:"center"}}
                        navbarScroll
                    >
                        <Nav.Link href="/community/free" style={{color:"white"}}>자유 게시판</Nav.Link>
                        <Nav.Link href="/community/pnl" style={{color:"white"}}>손익인증 게시판</Nav.Link>
                        <Nav.Link href="/community/chart" style={{color:"white"}}>차트분석 게시판</Nav.Link>
                        <Nav.Link href="/community/expert"style={{color:"white"}}>전문가 게시판</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
        </Navbar>

    )
}