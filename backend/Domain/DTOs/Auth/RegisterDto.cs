namespace backend.Domain.DTOs;
using backend.Domain.Enums;
public class RegisterDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Email { get; set; }= string.Empty;
    public string Password { get; set; }= string.Empty;
    public UserRole Role { get; set; }= UserRole.Candidate;
}
