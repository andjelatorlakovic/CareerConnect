using backend.Domain.Enums;
using Domain.Enums;
namespace backend.Domain.DTOs.CandidateProfile;
public class UpdateCandidateProfileRequest
{
    public string Bio { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public ExperienceLevel ExperienceLevel { get; set; }
    public List<Skill> Skills { get; set; } = new();
    public List<JobCategory> DesiredJobCategories { get; set; } = new();
}
