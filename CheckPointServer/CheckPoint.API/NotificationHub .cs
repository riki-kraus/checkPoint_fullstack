

using Microsoft.AspNetCore.SignalR;

namespace CheckPoint.API
{
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
   

            await base.OnConnectedAsync();
        }
    }
}
