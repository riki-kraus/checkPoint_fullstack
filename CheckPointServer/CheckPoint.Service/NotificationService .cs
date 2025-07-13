using AutoMapper;
using CheckPoint.Core.DTOs;
using CheckPoint.Core.Entities;
using CheckPoint.Core.IRepositories;
using CheckPoint.Core.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CheckPoint.Service.YourApp.Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly INotificationDispatcher _dispatcher;
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public NotificationService(INotificationRepository notificationRepository, INotificationDispatcher dispatcher, IRepositoryManager repositoryManager, IMapper mapper)
        {
            _notificationRepository = notificationRepository;
            _dispatcher = dispatcher;
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<List<Notification>> GetAllNotificationsAsync()
        {
            return await _notificationRepository.GetAllAsync();
        }

        public async Task<Notification> CreateNotificationAsync(NotificationDto dto)
        {
            dto.Read = false;
            var notification = _mapper.Map<Notification>(dto);
            //notification.Id = Guid.NewGuid().ToString();

            var created = await _notificationRepository.AddAsync(notification);
            _repositoryManager.SaveAsync();
            await _dispatcher.DispatchToAllAsync(created);

            return created;
        }
      
        public async Task<Notification> MarkAsReadAsync(int id)
        {
            var created = await _notificationRepository.MarkAsReadAsync(id);
            _repositoryManager.SaveAsync();

            return created;
        }
        public async Task DeleteByIdAsync(int id)
        {
             await _notificationRepository.DeleteByIdAsync(id);
            _repositoryManager.SaveAsync();

        }
        public Task NotifyAllAsync(Notification message)
        {
            return _dispatcher.DispatchToAllAsync(message);
        }

        public Task NotifyUserAsync(string userId, Notification message)
        {
            return _dispatcher.DispatchToUserAsync(userId, message);
        }
    }
}
