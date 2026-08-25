using backend.Domain.Enums;
using Domain.Enums;
namespace Domain.DTOs.JobListing;
public class CreateJobListingRequest
{
    public string Title {get; set;}= string.Empty;
    public string Description {get; set;} = string.Empty;
    public string Location {get; set;} = string.Empty;
    public ExperienceLevel ExperienceLevel {get; set;}
    public JobStatus Status {get; set;} = JobStatus.Active;
    public JobCategory JobCategory { get; set; }
    public DateTime ExpiresAt {get; set;}
    public List<Skill> Skills { get; set; } = new();
}
