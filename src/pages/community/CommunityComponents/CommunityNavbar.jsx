
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import {Nav} from "react-bootstrap";

export default function CommunityNavbar() {

    return (
    <Navbar bg={"dark"} style={{position:"fixed",top:"3rem"
        ,left:0,marginLeft:0,minWidth:"22rem",width:"100%",maxWidth:"1000rem"}}>
        <Container style={{justifyContent:"space-between",alignItems:"center",color:"white"}}>
            <Nav.Link href="/community/free" className={"Community-navLinkSetting"}>자유</Nav.Link>
            <Nav.Link href="/community/pnl" className={"Community-navLinkSetting"}>손익인증</Nav.Link>
            <Nav.Link href="/community/chart" className={"Community-navLinkSetting"}>차트</Nav.Link>
            <Nav.Link href="/community/expert" className={"Community-navLinkSetting"}>전문가</Nav.Link>
        </Container>
    </Navbar>
    )
}