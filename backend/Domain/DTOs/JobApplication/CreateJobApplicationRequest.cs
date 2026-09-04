using Domain.Models.Quiz;

namespace Domain.DTOs.JobApplication;
public class CreateJobApplicationRequest
{
    public string CoverLetter {get; set;}= string.Empty;
    public List<SubmitAnswerRequest> Answers { get; set; } = new();
}