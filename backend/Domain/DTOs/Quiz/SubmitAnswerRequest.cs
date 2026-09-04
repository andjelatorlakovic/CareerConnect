namespace Domain.Models.Quiz;
public class SubmitAnswerRequest
{
    public Guid QuestionId { get; set; }
    public string Answer { get; set; } = string.Empty;
}