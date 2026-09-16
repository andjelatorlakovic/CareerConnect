using System.ComponentModel.DataAnnotations;

namespace backend.Domain.DTOs.CandidateProfile;
public class AddWorkExperienceRequest
{
    [Required, StringLength(150, MinimumLength = 2)]
    public string Company { get; set; } = string.Empty;
    [Required, StringLength(150, MinimumLength = 2)]
    public string Position { get; set; } = string.Empty;
    [StringLength(2000)]
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }     public DateTime? EndDate { get; set; }
}
