using CheckPoint.Core.DTOs;
using CheckPoint.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CheckPoint.Core.Services
{
    public interface INotificationService
    {
        Task<List<Notification>> GetAllNotificationsAsync();
        Task<Notification> CreateNotificationAsync(NotificationDto dto);
        Task NotifyAllAsync(Notification message);
        Task NotifyUserAsync(string userId, Notification message);
        Task<Notification> MarkAsReadAsync(int id);
         Task DeleteByIdAsync(int id);


    }
}
