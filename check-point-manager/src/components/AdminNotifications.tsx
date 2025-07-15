

import  { useCallback, useState } from 'react';
import { Bell, Check, CheckCircle, Info, AlertTriangle, Trash2, X } from 'lucide-react';
import '../styles/AdminNotifications.css';
import { useSignalR } from '../services/SignalRService';
import { NotificationAdmin, NotificationType } from '../Types';
import { NotificationService } from '../services/NotificationService';

type FilterType = 'all' | 'read' | 'unread';


const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationAdmin[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

// בתוך הקומפוננטה:
const onMessageReceived = useCallback((notification: NotificationAdmin) => {
  setNotifications(prev => [notification, ...prev]);
}, []);
const url=import.meta.env.VITE_API_BASE_URL
  useSignalR(onMessageReceived, `${url}/hubs/notification`);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="notification-icon" />;
      case 'warning':
        return <AlertTriangle className="notification-icon" />;
      case 'error':
        return <AlertTriangle className="notification-icon" />;
      default:
        return <Info className="notification-icon" />;
    } 
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
       
    if (minutes < 1) return `לפני רגע`;
    if (minutes < 60) return `לפני ${minutes} דקות`;
    if (hours < 24) return `לפני ${hours} שעות`;
    return `לפני ${days} ימים`;
  };

  // const markAsRead = (id: number) => {
    
  //   setNotifications(prev =>
  //     prev.map(n => (n.id === id ? { ...n, read: true } : n))
  //   );
  // };
  const markAsRead = async (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await NotificationService.markAsRead(id);
    } catch (e) {
      console.error("שגיאה בסימון כהתראה נקראה", e);
    }
  };
  
  // const markAllAsRead = () => {
  //   setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  // };
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read && n.id !== undefined).map(n => n.id!);
  
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  
    for (const id of unreadIds) {
      try {
        await NotificationService.markAsRead(id);
      } catch (e) {
        console.error(`שגיאה בסימון כהתראה נקראה עבור id=${id}`, e);
      }
    }
  };
  
  // const deleteNotification = (id: number) => {
  //   setNotifications(prev => prev.filter(n => n.id !== id));
  //   setSelectedNotifications(prev => prev.filter(nId => nId !== id));
  // };
  const deleteNotification = async (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedNotifications(prev => prev.filter(nId => nId !== id));
    try {
      await NotificationService.delete(id);
    } catch (e) {
      console.error("שגיאה במחיקת התראה", e);
    }
  };
  
  // const deleteSelected = () => {
  //   setNotifications(prev => prev.filter(n => n.id&&!selectedNotifications.filter(Boolean).includes(n.id)));
  //   setSelectedNotifications([]);
  // };
  const deleteSelected = async () => {
    const toDelete = [...selectedNotifications];
    setNotifications(prev => prev.filter(n => !toDelete.includes(n.id!)));
    setSelectedNotifications([]);
  
    for (const id of toDelete) {
      try {
        await NotificationService.delete(id);
      } catch (e) {
        console.error(`שגיאה במחיקת התראה עם id=${id}`, e);
      }
    }
  };
  
  const toggleSelection = (id: number) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'read') return n.read;
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="notifications-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell"
        aria-label="הצג התראות"
      >
        <Bell className="bell-icon" />
        {unreadCount > 0 && (
          <>
            <div className="unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</div>
            <div className="bell-glow" />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div className="notifications-backdrop" onClick={() => setIsOpen(false)} />
          <div className="notifications-panel" role="dialog" aria-modal="true">
            <div className="notifications-header">
              <div className="header-top">
                <h3 id="notifications-title" className="notifications-title">
                  התראות מנהל
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="close-button"
                  aria-label="סגור חלון התראות"
                >
                  <X className="close-icon" />
                </button>
              </div>

              <div className="filter-tabs" role="tablist" aria-label="סינון התראות">
                {[
                  { key: 'all' as const, label: 'הכל', count: notifications.length },
                  { key: 'unread' as const, label: 'לא נקראו', count: unreadCount },
                  { key: 'read' as const, label: 'נקראו', count: notifications.length - unreadCount },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                    role="tab"
                    aria-selected={filter === tab.key}
                    tabIndex={filter === tab.key ? 0 : -1}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {(unreadCount > 0 || selectedNotifications.length > 0) && (
                <div className="actions-bar">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="action-button mark-read"
                    >
                      <Check className="action-icon" />
                      <span>סמן הכל כנקרא</span>
                    </button>
                  )}
                  {selectedNotifications.length > 0 && (
                    <button
                      onClick={deleteSelected}
                      className="action-button delete-selected"
                    >
                      <Trash2 className="action-icon" />
                      <span>מחק נבחרים ({selectedNotifications.length})</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="notifications-list">
              {filteredNotifications.length === 0 ? (
                <div className="empty-state">
                  <Bell className="empty-icon" />
                  <p>אין התראות להצגה</p>
                </div>
              ) : (
                <div className="notifications-scroll">
                  {filteredNotifications.map((n, i) => (
                    <div
                      key={n.id}
                      className={`notification-item ${n.read ? 'read' : 'unread'} priority-${n.priority} type-${n.type}`}
                      style={{ animationDelay: `${i * 50}ms` }}
                      onClick={() => n.id&&!n.read && markAsRead(n.id)}
                      role="listitem"
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          !n.read &&n.id&& markAsRead(n.id);
                        }
                      }}
                      aria-label={`${n.title} - ${n.message} - ${n.read ? 'נקראה' : 'לא נקראה'}`}
                    >
                      <div className="notification-content">
                        <input
                          type="checkbox"
                          checked={n.id !== undefined && selectedNotifications.includes(n.id)}
                          onChange={() => n.id  && toggleSelection(n.id)}
                          onClick={e => e.stopPropagation()}
                          className="notification-checkbox"
                          aria-label={`בחר התראה: ${n.title}`}
                        />
                        <div className={`notification-icon-wrapper type-${n.type}`}>
                          {getNotificationIcon(n.type)}
                        </div>
                        <div className="notification-text">
                          <div className="notification-header-row">
                            <h4 className="notification-title-text">{n.title}</h4>
                            <span className="notification-time">{formatTimeAgo(new Date(n.timestamp))}</span>
                          </div>
                          <p className="notification-message">{n.message}</p>
                        </div>
                      </div>
                      <button
                        className="notification-delete"
                        onClick={e => {
                          e.stopPropagation();
                          n.id&&deleteNotification(n.id);
                        }}
                        title="מחק התראה"
                        aria-label={`מחק התראה: ${n.title}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminNotifications;


