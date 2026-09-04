using backend.Database;
using Domain.Dto.Quiz;
using Domain.Models;
using Domain.Models.Quiz;
using Microsoft.EntityFrameworkCore;

public class QuizService : IQuizService
{
    private readonly AppDbContext _context;
    public QuizService(AppDbContext context)
    {
        _context = context;
    }

    public async  Task<JobListingQuestionDto> AddQuestionAsync(Guid companyProfileId, Guid jobId, AddQuestionRequest request)
    {
        var jobBelongs = await _context.JobListings.AnyAsync(j => j.CompanyProfileId == companyProfileId && j.Id == jobId);
        if (!jobBelongs)
        {
            throw new InvalidOperationException("Job listing does not exist for the specified company profile.");
        }

        var question = new JobListingQuestion
        {
            JobListingId = jobId,
            QuestionText = request.QuestionText,
            OrderIndex = request.OrderIndex
        };

        _context.JobListingQuestions.Add(question);
        await _context.SaveChangesAsync();

        return new JobListingQuestionDto
        {
            Id = question.Id,
            QuestionText = question.QuestionText,
            OrderIndex = question.OrderIndex
        };
    }

    public async Task<List<QuizAnswerDto>> GetAnswersForApplicationAsync(Guid companyProfileId, Guid applicationId)
    {
        var application = await _context.JobApplications
            .FirstOrDefaultAsync(a => a.Id == applicationId)
            ?? throw new InvalidOperationException("Application not found.");

        var jobBelongs = await _context.JobListings
            .AnyAsync(j => j.Id == application.JobListingId && j.CompanyProfileId == companyProfileId);
        if (!jobBelongs)
            throw new InvalidOperationException("Nemate dozvolu za pregled ove prijave.");

        var answers = await _context.QuizAnswers
            .Where(a => a.JobApplicationId == applicationId)
            .ToListAsync();

        var questionIds = answers.Select(a => a.JobListingQuestionId).ToList();
        var questions = await _context.JobListingQuestions
            .Where(q => questionIds.Contains(q.Id))
            .ToListAsync();

        return answers.Select(a => new QuizAnswerDto
        {
            QuestionId = a.JobListingQuestionId,
            Question = questions.FirstOrDefault(q => q.Id == a.JobListingQuestionId)?.QuestionText ?? "",
            Answer = a.Answer
        }).ToList();
    }

    public async Task<List<JobListingQuestionDto>> GetQuestionsAsync(Guid jobId)
    {
        var questions = await _context.JobListingQuestions
            .Where(q => q.JobListingId == jobId)
            .OrderBy(q => q.OrderIndex)
            .ToListAsync();

        return questions.Select(q => new JobListingQuestionDto
        {
            Id = q.Id,
            QuestionText = q.QuestionText,
            OrderIndex = q.OrderIndex
        }).ToList();
    }



    public async Task<bool> RemoveQuestionAsync(Guid companyProfileId, Guid jobId, Guid questionId)
    {
        var jobBelongs = await _context.JobListings
            .AnyAsync(j => j.Id == jobId && j.CompanyProfileId == companyProfileId);
        if (!jobBelongs)
            throw new InvalidOperationException("Job listing not found.");

        var question = await _context.JobListingQuestions
            .FirstOrDefaultAsync(q => q.Id == questionId && q.JobListingId == jobId);
        if (question == null) return false;

        _context.JobListingQuestions.Remove(question);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task SaveAnswersAsync(Guid applicationId, List<SubmitAnswerRequest> answers)
    {
        var quizAnswers = answers.Select(a => new QuizAnswer
        {
            JobApplicationId = applicationId,
            JobListingQuestionId = a.QuestionId,
            Answer = a.Answer
        }).ToList();

        _context.QuizAnswers.AddRange(quizAnswers);
        await _context.SaveChangesAsync();
    }
}