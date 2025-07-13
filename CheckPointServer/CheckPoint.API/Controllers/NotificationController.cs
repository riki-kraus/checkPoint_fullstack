//using AutoMapper;
//using CheckPoint.Core.DTOs;
//using CheckPoint.Core.Entities;
//using CheckPoint.Core.Services;
//using Microsoft.AspNetCore.Mvc;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace CheckPoint.API.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class NotificationController : ControllerBase
//    {
//        private readonly INotificationService _notificationService;
//        private readonly IMapper _mapper;

//        public NotificationController(INotificationService notificationService, IMapper mapper)
//        {
//            _notificationService = notificationService;
//            _mapper = mapper;
//        }

//        [HttpGet]
//        public async Task<ActionResult<List<NotificationDto>>> GetAll()
//        {
//            var notifications = await _notificationService.GetAllNotificationsAsync();
//            var dtos = _mapper.Map<List<NotificationDto>>(notifications);
//            return Ok(dtos);
//        }

//        [HttpPost]
//        public async Task<ActionResult<Notification>> Create([FromBody] NotificationDto dto)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);

//            var created = await _notificationService.CreateNotificationAsync(dto);
//            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
//        }

//        [HttpPost("broadcast")]
//        public async Task<IActionResult> Broadcast([FromBody] string message)
//        {
//            await _notificationService.NotifyAllAsync(message);
//            return Ok("Broadcast sent");
//        }

//        [HttpPost("user/{userId}")]
//        public async Task<IActionResult> NotifyUser(string userId, [FromBody] string message)
//        {
//            await _notificationService.NotifyUserAsync(userId, message);
//            return Ok("Message sent to user");
//        }
//    }
//}
using AutoMapper;
using CheckPoint.API;
using CheckPoint.Core.DTOs;
using CheckPoint.Core.Entities;
using CheckPoint.Core.Services;
using CheckPoint.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly IMapper _mapper;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationController(
        INotificationService notificationService,
        IMapper mapper,
        IHubContext<NotificationHub> hubContext)
    {
        _notificationService = notificationService;
        _mapper = mapper;
        _hubContext = hubContext;
    }
    [HttpGet]
    public async Task<ActionResult<List<Notification>>> GetAll()
    {
        var notifications = await _notificationService.GetAllNotificationsAsync();
        var dtos = _mapper.Map<List<Notification>>(notifications);
        return Ok(dtos);
    }
    [HttpPost]
    public async Task<ActionResult<Notification>> Create([FromBody] NotificationDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _notificationService.CreateNotificationAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }

    [HttpPut("{id}/mark-as-read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {

        var created = await _notificationService.MarkAsReadAsync(id);
        return Ok(created);
    }


    [HttpDelete("{id}")]
    public async Task DeleteAsync(int id)
    {
        await _notificationService.DeleteByIdAsync(id);

    }
    //[HttpPost("broadcast")]
    //public async Task<IActionResult> Broadcast([FromBody] Notification message)
    //{
    //    await _notificationService.NotifyAllAsync(message);
    //    await _hubContext.Clients.All.SendAsync("ReceiveMessage", message);
    //    return Ok("Broadcast sent");
    //}


}
