using backend.Domain.Enums;
namespace Domain.DTOs.JobListing;
public class UpdateJobListingRequest
{
    public string Title {get; set;}= string.Empty;
    public string Description {get; set;} = string.Empty;
    public string Location {get; set;} = string.Empty;
    public ExperienceLevel ExperienceLevel {get; set;}
    public DateTime ExpiresAt {get; set;}
    public List<Skill> Skills =new();
}