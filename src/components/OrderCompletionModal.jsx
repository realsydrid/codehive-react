import { useOrderNotification } from '../context/OrderNotificationContext';
import { formatDecimalsWithCommas } from '../utils/numberFormat';
import './OrderCompletionModal.css';

export default function OrderCompletionModal() {
  const { showModal, currentNotification, closeNotification } = useOrderNotification();
  
  if (!showModal || !currentNotification) {
    return null;
  }
  
  const { message, market, side, price, volume } = currentNotification;
  
  // 모달이 자동으로 닫히게 설정 (5초 후)
  setTimeout(closeNotification, 5000);
  
  return (
    <div className="orderCompletion-modal-backdrop">
      <div className="orderCompletion-modal-container">
        <div className="orderCompletion-modal-content">
          <div className="orderCompletion-modal-header">
            <h3>주문 체결 알림</h3>
            <button 
              className="orderCompletion-modal-close-button" 
              onClick={closeNotification}
            >
              ×
            </button>
          </div>
          
          <div className="orderCompletion-modal-body">
            <p className="orderCompletion-modal-message">{message}</p>
            <div className="orderCompletion-modal-details">
              <div className="orderCompletion-modal-detail-item">
                <span>마켓:</span>
                <span className="orderCompletion-modal-value">{market}</span>
              </div>
              <div className="orderCompletion-modal-detail-item">
                <span>거래유형:</span>
                <span className={`orderCompletion-modal-value ${side === 'BUY' ? 'bid' : 'ask'}`}>
                  {side === 'BUY' ? '매수' : '매도'}
                </span>
              </div>
              <div className="orderCompletion-modal-detail-item">
                <span>가격:</span>
                <span className="orderCompletion-modal-value">
                  {formatDecimalsWithCommas(price)} 원
                </span>
              </div>
              <div className="orderCompletion-modal-detail-item">
                <span>수량:</span>
                <span className="orderCompletion-modal-value">
                  {volume}
                </span>
              </div>
            </div>
          </div>
          
          <div className="orderCompletion-modal-footer">
            <button 
              className="orderCompletion-modal-button"
              onClick={closeNotification}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 