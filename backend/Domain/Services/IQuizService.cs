using Domain.Dto.Quiz;
using Domain.Models.Quiz;

public interface IQuizService
{
    Task <JobListingQuestionDto> AddQuestionAsync(Guid companyProfileId,Guid jobId, AddQuestionRequest request);
    Task<bool> RemoveQuestionAsync(Guid companyProfileId, Guid jobId, Guid questionId);
     Task<List<JobListingQuestionDto>> GetQuestionsAsync(Guid jobId);
    Task<List<QuizAnswerDto>> GetAnswersForApplicationAsync(Guid companyProfileId, Guid applicationId);
    Task SaveAnswersAsync(Guid applicationId, List<SubmitAnswerRequest> answers);
}