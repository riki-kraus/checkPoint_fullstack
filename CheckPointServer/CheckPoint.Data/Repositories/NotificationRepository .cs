using CheckPoint.Core.Entities;
using CheckPoint.Core.IRepositories;
using CheckPoint.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CheckPoint.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly DataContext _context;

        public NotificationRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Notification> AddAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            //await _context.SaveChangesAsync();
            return notification;
        }

        //------------------

        public async Task<Notification> MarkAsReadAsync(int id)
        {
            var notification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id);
            notification.Read = !notification.Read;
            return notification;
        }

        public async Task DeleteByIdAsync(int id)
        {
            var notification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id);
            if (notification != null)
            {
                _context.Notifications.Remove(notification);
            }
        }
        //-----------------
        public async Task<List<Notification>> GetAllAsync()
        {
            return await _context.Notifications.ToListAsync();
        }
        //public async Task DeleteNotification(int id)
        //{
        //    var notifications = await _context.Notifications.Where(n => n.Id == id).ToListAsync();
        //    if (notifications != null)
        //    {
        //        foreach (var notification in notifications)
        //        {
        //            _context.Notifications.Remove(notification);
        //        }
        //    }
        //}
    }
}
