using System.ComponentModel.DataAnnotations;

namespace backend.Domain.DTOs.User;
public class ChangePasswordRequest
{
    [Required, StringLength(128, MinimumLength = 6)]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required, StringLength(128, MinimumLength = 6)]
    public string NewPassword { get; set; } = string.Empty;
}
