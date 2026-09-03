namespace CareerConnect.Domain.Models;
public class Notification
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Notification()
    {
    }
    public Notification(Guid userId, string message)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Message = message;
        IsRead = false;
        CreatedAt = DateTime.UtcNow;
    }
}