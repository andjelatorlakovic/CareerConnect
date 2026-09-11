using Domain.DTOs.Notification;

namespace Domain.Services;
public interface INotificationService
{
    Task CreateAsync(
        Guid userId,
        string message,
        Guid? jobListingId = null);
    Task<List<NotificationDto>> GetMyNotificationsAsync(Guid userId);
    Task MarkAsReadAsync(Guid userId,Guid notificationId);
    Task MarkAllAsReadAsync(Guid userId);
}
