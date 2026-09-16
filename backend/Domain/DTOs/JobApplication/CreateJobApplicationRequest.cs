using System.ComponentModel.DataAnnotations;
using Domain.Models.Quiz;

namespace Domain.DTOs.JobApplication;
public class CreateJobApplicationRequest
{
    [StringLength(3000)]
    public string CoverLetter {get; set;}= string.Empty;
    public List<SubmitAnswerRequest> Answers { get; set; } = new();
}
