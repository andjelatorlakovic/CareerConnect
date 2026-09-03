using backend.Database;
using CareerConnect.Domain.Models;
using Domain.DTOs.Notification;
using Domain.Services;
using Microsoft.EntityFrameworkCore;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;
    public NotificationService(AppDbContext context)
    {
        _context = context;
    }   
    
    public async Task CreateAsync(Guid userId, string message)
    {
        var notification = new Notification
        {
            UserId = userId,
            Message = message
        };
         _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
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
    }

    public async Task MarkAsReadAsync(Guid userId, Guid notificationId)
    {
        var notification = await _context.Notifications .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId)
            ?? throw new InvalidOperationException("Notification not found.");
        notification.IsRead = true;
        await _context.SaveChangesAsync();
    }
}