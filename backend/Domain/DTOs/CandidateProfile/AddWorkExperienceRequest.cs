namespace backend.Domain.DTOs.CandidateProfile;
public class AddWorkExperienceRequest
{
    public string Company { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}