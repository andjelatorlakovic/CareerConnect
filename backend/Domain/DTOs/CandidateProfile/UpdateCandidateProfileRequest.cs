using System.ComponentModel.DataAnnotations;
using backend.Domain.Enums;
using Domain.Enums;
namespace backend.Domain.DTOs.CandidateProfile;
public class UpdateCandidateProfileRequest
{
    [Required, StringLength(2000, MinimumLength = 20)]
    public string Bio { get; set; } = string.Empty;

    [Required, StringLength(120, MinimumLength = 2)]
    public string Location { get; set; } = string.Empty;
    public ExperienceLevel ExperienceLevel { get; set; }
    [MinLength(1)]
    public List<Skill> Skills { get; set; } = new();
    [MinLength(1)]
    public List<JobCategory> DesiredJobCategories { get; set; } = new();
}
