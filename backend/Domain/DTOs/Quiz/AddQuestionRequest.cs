namespace Domain.Models.Quiz;
public class AddQuestionRequest
{
    public string QuestionText { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}