namespace backend.Domain.DTOs.CandidateProfile;
public class AddEducationRequest
{
    public string Institution { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string FieldOfStudy { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}