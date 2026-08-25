using backend.Domain.Enums;

namespace Domain.DTOs.JobListing;
public class JobListingDto
{
    public Guid Id;
    public Guid CompanyProfileId;
    public string Title {get; set;}= string.Empty;
    public string Description {get; set;} = string.Empty;
    public string Location {get; set;} = string.Empty;
    public ExperienceLevel ExperienceLevel {get; set;}
    public JobStatus Status {get; set;} = JobStatus.Active;
    public DateTime CreatedAt {get; set;}= DateTime.UtcNow;
    public DateTime ExpiresAt {get; set;}
    public List<Skill> Skills =new();
}