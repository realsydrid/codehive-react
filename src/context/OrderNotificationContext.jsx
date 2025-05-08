import { createContext, useState, useEffect, useContext } from 'react';

const OrderNotificationContext = createContext();

export const useOrderNotification = () => useContext(OrderNotificationContext);

export const OrderNotificationProvider = ({ children }) => {
  // const ServerUrl="http://localhost:8801";
  const ServerUrl="";
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [lastOrderState, setLastOrderState] = useState({});

  // 로컬 스토리지에서 마지막 주문 상태 불러오기
  useEffect(() => {
    const savedState = localStorage.getItem('lastOrderState');
    if (savedState) {
      setLastOrderState(JSON.parse(savedState));
    }
  }, []);
  
  // 주문 체결 확인 함수
  const checkOrderCompletion = async () => {
    try {
      // 로그인 상태 확인
      const token = localStorage.getItem('jwt');
      if (!token) return;
      
      // 주문 목록 가져오기 - transactionState=PENDING 파라미터로 미체결 주문만 조회
      const response = await fetch(`${ServerUrl}/api/transaction?transactionState=PENDING`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('주문 목록을 가져오는데 실패했습니다.');
      
      const pendingTransactions = await response.json();
      const pendingIds = pendingTransactions.content.map(tx => tx.id);
      
      // 이전에 미체결이었던 주문 IDs
      const prevPendingIds = Object.entries(lastOrderState)
        .filter(([_, state]) => state === 'PENDING')
        .map(([id, _]) => parseInt(id));
      
      // 이전에 미체결이었는데 현재 목록에 없는 주문 (= 체결된 주문)
      const completedIds = prevPendingIds.filter(id => !pendingIds.includes(id));
      
      if (completedIds.length > 0) {
        // 체결된 주문에 대한 상세 정보 가져오기
        const newNotifications = [];
        
        // 모든 주문 목록 가져오기 (체결 상태 포함)
        const allOrdersResponse = await fetch(`${ServerUrl}/api/transaction`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (allOrdersResponse.ok) {
          const allOrders = await allOrdersResponse.json();
          
          // 체결된 주문 찾기
          completedIds.forEach(id => {
            const completedOrder = allOrders.content.find(order => order.id === id);
            
            if (completedOrder) {
              newNotifications.push({
                id: completedOrder.id,
                type: 'order_completed',
                message: `${completedOrder.market} ${completedOrder.transactionType === 'BUY' ? '매수' : '매도'} 주문이 체결되었습니다!`,
                price: completedOrder.price,
                volume: completedOrder.volume,
                market: completedOrder.market,
                side: completedOrder.transactionType,
                timestamp: new Date().toISOString()
              });
            }
          });
        }
        
        // 새로운 알림이 있을 경우 처리
        if (newNotifications.length > 0) {
          setNotifications(prev => [...newNotifications, ...prev]);
          setCurrentNotification(newNotifications[0]);
          setShowModal(true);
          
          // 브라우저 알림 (허용된 경우)
          if (Notification.permission === 'granted') {
            new Notification('주문 체결 알림', {
              body: newNotifications[0].message
            });
          }
        }
      }
      
      // 현재 상태 저장
      const newOrderState = {};
      pendingTransactions.content.forEach(tx => {
        newOrderState[tx.id] = 'PENDING';
      });
      
      // 로컬 스토리지에 현재 상태 저장
      localStorage.setItem('lastOrderState', JSON.stringify(newOrderState));
      setLastOrderState(newOrderState);
      
    } catch (error) {
      console.error('주문 상태 확인 중 오류:', error);
    }
  };
  
  // 주기적으로 주문 상태 확인 (1초마다)
  useEffect(() => {
    const intervalId = setInterval(checkOrderCompletion, 1000);
    
    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [lastOrderState]);
  
  // 알림 모달 닫기
  const closeNotification = () => {
    setShowModal(false);
    setCurrentNotification(null);
  };
  
  // 알림 삭제
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  return (
    <OrderNotificationContext.Provider 
      value={{ 
        notifications, 
        showModal, 
        currentNotification, 
        closeNotification, 
        removeNotification 
      }}
    >
      {children}
    </OrderNotificationContext.Provider>
  );
}; 