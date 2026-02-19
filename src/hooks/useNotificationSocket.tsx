import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { AppNotification } from '@/src/types/notification';

export const useNotificationSocket = () => {
  const { token, userId } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token || !userId) return;

    const socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
      auth: { token },
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log(' Connected to notification server');
      setIsConnected(true);
    });


    socketInstance.on('new-notification', (notification: AppNotification) => {
      console.log(' New notification received:', notification);
      

      setNotifications(prev => [notification, ...prev]);
      

      if (typeof window !== 'undefined' && window.Notification?.permission === 'granted') {
        new window.Notification('New Blog Activity', {
          body: notification.content,
          icon: notification.actorId?.profilePicture,
        });
      }
    });

    socketInstance.on('disconnect', () => {
      console.log(' Disconnected from notification server');
      setIsConnected(false);
    });

    setSocket(socketInstance);

  
    if (typeof window !== 'undefined' && window.Notification?.permission === 'default') {
      window.Notification.requestPermission();
    }

    return () => {
      socketInstance.disconnect();
    };
  }, [token, userId]);

  return { socket, notifications, setNotifications, isConnected };
};