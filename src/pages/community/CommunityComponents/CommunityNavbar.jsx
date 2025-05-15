
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import {Nav} from "react-bootstrap";
import {Link} from "react-router-dom";

export default function CommunityNavbar() {

    return (
    <Navbar bg={"dark"} style={{position:"fixed",top:"3rem"
        ,left:0,marginLeft:0,minWidth:"22rem",width:"100%",maxWidth:"1000rem",zIndex:"10"}}>
        <Container style={{justifyContent:"space-between",alignItems:"center",color:"white"}}>
            <Nav.Link as={Link} to="/community/free" className={"Community-navLinkSetting"}>자유</Nav.Link>
            <Nav.Link as={Link} to="/community/pnl" className={"Community-navLinkSetting"}>손익인증</Nav.Link>
            <Nav.Link as={Link} to="/community/chart" className={"Community-navLinkSetting"}>차트</Nav.Link>
            <Nav.Link as={Link} to="/community/expert" className={"Community-navLinkSetting"}>전문가</Nav.Link>
        </Container>
    </Navbar>
    )
}