using backend.Domain.Enums;
using Domain.Enums;

namespace Domain.DTOs.Matching;
public class MatchResultDto
{
    public Guid JobId {get;set;}
    public string Tittle {get; set;} = string.Empty;
    public string Location {get; set;} = string.Empty;
    public JobCategory jobCategory {get; set;}
    public List<Skill> RequiredSkills {get; set;}= new();
    public List<Skill> MatchedSkills {get; set;}=new();
    public List<Skill> MissingSkills {get; set;}= new();
    public decimal MatchPercentage {get; set;}
}