import { createContext, useState, useEffect, useContext, useRef } from 'react';

const OrderNotificationContext = createContext();

export const useOrderNotification = () => useContext(OrderNotificationContext);

export const OrderNotificationProvider = ({ children }) => {
  // const ServerUrl="http://localhost:8801";
  const ServerUrl="";
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  
  // 로컬 스토리지 사용 대신 메모리에 직접 저장
  const processedOrdersRef = useRef(new Set());
  const lastPendingOrdersRef = useRef(new Set());
  
  // 주문 체결 확인 함수
  const checkOrderCompletion = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) return;
      
      // 미체결 주문 가져오기
      const response = await fetch(`${ServerUrl}/api/transaction?transactionState=PENDING`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) return;
      
      const pendingTransactions = await response.json();
      const currentPendingSet = new Set(pendingTransactions.content.map(tx => tx.id));
      
      // 이전에 보유했던 대기 중인 주문 중 이제 없는 것들 찾기
      const completedOrders = Array.from(lastPendingOrdersRef.current)
        .filter(id => !currentPendingSet.has(id) && !processedOrdersRef.current.has(id));
      
      if (completedOrders.length > 0) {
        // 모든 주문 목록 가져오기
        const allOrdersResponse = await fetch(`${ServerUrl}/api/transaction`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (allOrdersResponse.ok) {
          const allOrders = await allOrdersResponse.json();
          const newNotifications = [];
          
          completedOrders.forEach(id => {
            const completedOrder = allOrders.content.find(order => order.id === id);
            
            if (completedOrder) {
              // 이 주문이 처리되었음을 기록
              processedOrdersRef.current.add(id);
              
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
          
          if (newNotifications.length > 0) {
            setNotifications(prev => [...newNotifications, ...prev]);
            setCurrentNotification(newNotifications[0]);
            setShowModal(true);
            
            // 브라우저 알림
            if (Notification.permission === 'granted') {
              new Notification('주문 체결 알림', {
                body: newNotifications[0].message
              });
            }
          }
        }
      }
      
      // 현재 대기 중인 주문 업데이트
      lastPendingOrdersRef.current = currentPendingSet;
    } catch (error) {
      console.error('주문 상태 확인 중 오류:', error);
    }
  };
  
  // 폴링 인터벌 설정 (3초로 늘림)
  useEffect(() => {
    const intervalId = setInterval(checkOrderCompletion, 3000);
    return () => clearInterval(intervalId);
  }, []);
  
  // 자동 모달 닫기
  useEffect(() => {
    let timerId;
    if (showModal) {
      timerId = setTimeout(() => {
        setShowModal(false);
      }, 5000);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [showModal]);
  
  const closeNotification = () => {
    setShowModal(false);
    setCurrentNotification(null);
  };
  
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