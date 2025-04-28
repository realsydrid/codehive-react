import {useEffect} from "react";

export default function Toast({message, onClose, duration = 2000}) {
    useEffect(() => {
        const timer = setTimeout(()=>{
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);
    return (
        <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#333",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "16px",
            zIndex: 9999,
            textAlign: "center",
            maxWidth: "80%",
            wordBreak: "keep-all",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        }}>
            {message}
        </div>
    );
}