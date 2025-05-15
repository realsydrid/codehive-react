import Spinner from "react-bootstrap/Spinner";

function SmallLoading() {
    return (
        <div>
            <Spinner animation="border" role="status" size={"sm"} variant={"primary"}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <br/>
            <span>로딩중...</span>
        </div>
    );
}

export default SmallLoading;