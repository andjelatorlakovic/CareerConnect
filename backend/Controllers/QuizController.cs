using System.Security.Claims;
using Domain.DTOs.CompanyProfile;
using Domain.Models.Quiz;
using Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers;
[ApiController]
[Route("api/quiz")]
[Authorize]
public class QuizController : ControllerBase
{
    private readonly IQuizService _quizService;
    private readonly ICompanyService _companyService;
    public QuizController(IQuizService quizService, ICompanyService companyService)
    {
        _quizService = quizService;
        _companyService = companyService;
    }
    [HttpGet("jobs/{jobId}/questions")]
    public async Task<IActionResult> GetQuestions(Guid jobId)
    {
        var questions = await _quizService.GetQuestionsAsync(jobId);
        return Ok(questions);
    }
    [HttpPost("jobs/{jobId}/questions")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> AddQuestion(Guid jobId, AddQuestionRequest request)
    {
        try
        {
            var profile = await GetCompanyProfileAsync();
            var question = await _quizService.AddQuestionAsync(profile.Id, jobId, request);
            return Ok(question);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    [HttpDelete("jobs/{jobId}/questions/{questionId}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> RemoveQuestion(Guid jobId, Guid questionId)
    {
        try
        {
            var profile = await GetCompanyProfileAsync();
            var removed = await _quizService.RemoveQuestionAsync(profile.Id, jobId, questionId);
            if (!removed) return NotFound(new { message = "Question not found." });
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    [HttpGet("applications/{applicationId}/answers")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetAnswers(Guid applicationId)
    {
        try
        {
            var profile = await GetCompanyProfileAsync();
            var answers = await _quizService.GetAnswersForApplicationAsync(profile.Id, applicationId);
            return Ok(answers);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
     private async Task<CompanyProfileDto> GetCompanyProfileAsync()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(value, out var userId))
            throw new UnauthorizedAccessException("Korisnik nije validan.");
        return await _companyService.GetOrCreateAsync(userId);
    }
}
