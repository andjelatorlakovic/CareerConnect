using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using backend.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CareerConnect.IntegrationTests;

public class QuizIntegrationTests
    : IClassFixture<IntegrationTestWebApplicationFactory>
{
    private readonly IntegrationTestWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public QuizIntegrationTests(
        IntegrationTestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ApplyForJob_WithUnansweredQuestion_ReturnsBadRequest()
    {
        var job = await CreateJobAsync();
        await AddQuestionAsync(job.Id, job.CompanyToken);

        var candidate = await RegisterAndGetTokenAsync("Candidate");

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            $"/api/job-applications/jobs/{job.Id}",
            candidate.Token,
            new
            {
                coverLetter = "I would like to apply for this position.",
                answers = Array.Empty<object>()
            });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ApplyForJob_WithAnswerToEveryQuestion_SavesApplication()
    {
        var job = await CreateJobAsync();
        var questionId = await AddQuestionAsync(
            job.Id,
            job.CompanyToken);

        var candidate = await RegisterAndGetTokenAsync("Candidate");

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            $"/api/job-applications/jobs/{job.Id}",
            candidate.Token,
            new
            {
                coverLetter = "I would like to apply for this position.",
                answers = new[]
                {
                    new
                    {
                        questionId,
                        answer = "I have experience with C# and .NET."
                    }
                }
            });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var answerExists = await dbContext.QuizAnswers.AnyAsync(
            answer => answer.JobListingQuestionId == questionId);

        Assert.True(answerExists);
    }

    private async Task<(Guid Id, string CompanyToken)> CreateJobAsync()
    {
        var company = await RegisterAndGetTokenAsync("Company");
        var title = $"Quiz test job {Guid.NewGuid():N}";

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            "/api/jobs",
            company.Token,
            new
            {
                title,
                description =
                    "This is a valid job description used for quiz integration testing.",
                location = "Novi Sad",
                experienceLevel = "Junior",
                jobCategory = "SoftwareDevelopment",
                expiresAt = DateTime.UtcNow.AddDays(14),
                skills = new[] { "CSharp" },
                employmentType = "FullTime",
                salaryMin = 1000,
                salaryMax = 1500
            });

        response.EnsureSuccessStatusCode();

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var job = await dbContext.JobListings.SingleAsync(
            listing => listing.Title == title);

        return (job.Id, company.Token);
    }

    private async Task<Guid> AddQuestionAsync(
        Guid jobId,
        string companyToken)
    {
        var questionText = $"Why are you interested? {Guid.NewGuid():N}";

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            $"/api/quiz/jobs/{jobId}/questions",
            companyToken,
            new
            {
                questionText,
                orderIndex = 1
            });

        response.EnsureSuccessStatusCode();

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var question = await dbContext.JobListingQuestions.SingleAsync(
            item => item.QuestionText == questionText);

        return question.Id;
    }

    private async Task<HttpResponseMessage> SendAuthorizedRequestAsync(
        HttpMethod method,
        string url,
        string token,
        object body)
    {
        var request = new HttpRequestMessage(method, url);

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        request.Content = JsonContent.Create(body);

        return await _client.SendAsync(request);
    }

    private async Task<(string Token, string Email)>
        RegisterAndGetTokenAsync(string role)
    {
        var email = $"{role.ToLower()}-{Guid.NewGuid():N}@example.com";

        var response = await _client.PostAsJsonAsync(
            "/api/auth/register",
            new
            {
                firstName = role == "Company" ? null : "Test",
                lastName = role == "Company" ? null : "User",
                email,
                password = "Password123!",
                role
            });

        response.EnsureSuccessStatusCode();

        var responseText =
            await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(responseText);

        var token = document.RootElement
            .GetProperty("token")
            .GetString()
            ?? throw new InvalidOperationException(
                "Registration response does not contain a token.");

        return (token, email);
    }
}