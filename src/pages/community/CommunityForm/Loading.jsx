import Spinner from 'react-bootstrap/Spinner';

function Loading() {
    return (
        <div>
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
            <br/>
            <h1>로딩중...</h1>
        </div>
    );
}

export default Loading;