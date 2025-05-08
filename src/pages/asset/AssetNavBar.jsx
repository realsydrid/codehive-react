import {Nav} from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import {Link} from "react-router-dom";

export default function AssetNavBar(){
    return (
        <Navbar expand='md' bg={"dark"} variant={"dark"} style={{position:"fixed",top:"3rem"
            ,left:0, zIndex: 1000,marginLeft:0,minWidth:"32rem",width:"100%",maxWidth:"1000rem",}}>
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
                    <Nav.Link as={Link} to="/asset/my-asset" style={{color:"white",margin:"0.5rem 2rem 0.2rem 2rem"}}>보유자산</Nav.Link>
                    <Nav.Link as={Link} to="/asset/history" style={{color:"white",margin:"0.5rem 2rem 0.2rem 2rem"}}>거래내역</Nav.Link>
                    <Nav.Link as={Link} to="/asset/pending-orders" style={{color:"white",margin:"0.5rem 2rem 0.2rem 2rem"}}>미체결</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}