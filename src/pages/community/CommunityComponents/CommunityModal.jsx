export function CommunityModal({isOpen,onClose,title, message,footer}){
    if(!isOpen) {return null}
    return (
        <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} tabIndex="-50">
            <div className="Community modal-dialog modal-dialog-centered" style={{justifyContent:"center"}}>
                <div className="Community modal-content" style={{width:"80%"}}>
                    <div className="Community modal-header">
                        <h5 className="Community modal-title">{title}</h5>
                        <button type="button" className="Community btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="Community modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="Community modal-footer">
                        {footer}
                    </div>
                </div>
            </div>
        </div>
    );
}