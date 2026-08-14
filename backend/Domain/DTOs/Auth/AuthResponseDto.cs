namespace backend.Domain.DTOs;
using backend.Domain.Enums;
public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
}