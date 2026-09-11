using backend.Database;
using CareerConnect.Domain.Models;
using Domain.DTOs.Notification;
using Domain.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using backend.Hubs;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<RealtimeHub> _hubContext;

    public NotificationService(
        AppDbContext context,
        IHubContext<RealtimeHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }   
    
    public async Task CreateAsync(
        Guid userId,
        string message,
        Guid? jobListingId = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Message = message,
            JobListingId = jobListingId
        };
         _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.User(userId.ToString())
            .SendAsync("NotificationCreated", new NotificationDto
            {
                Id = notification.Id,
                JobListingId = notification.JobListingId,
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            });
    }

    public async Task<List<NotificationDto>> GetMyNotificationsAsync(Guid userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return notifications.Select(n => new NotificationDto
        {
            Id = n.Id,
            JobListingId = n.JobListingId,
            Message = n.Message,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        }).ToList();
    }

    public async Task MarkAllAsReadAsync(Guid userId)
    {
        var notifications = await _context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var n in notifications)
            n.IsRead = true;

        await _context.SaveChangesAsync();
        await _hubContext.Clients.User(userId.ToString())
            .SendAsync("NotificationsMarkedRead");
    }

    public async Task MarkAsReadAsync(Guid userId, Guid notificationId)
    {
        var notification = await _context.Notifications .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId)
            ?? throw new InvalidOperationException("Notification not found.");
        notification.IsRead = true;
        await _context.SaveChangesAsync();
        await _hubContext.Clients.User(userId.ToString())
            .SendAsync("NotificationRead", notificationId.ToString());
    }
}
