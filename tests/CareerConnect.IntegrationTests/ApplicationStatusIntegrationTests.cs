using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using backend.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CareerConnect.IntegrationTests;

public class ApplicationStatusIntegrationTests
    : IClassFixture<IntegrationTestWebApplicationFactory>
{
    private readonly IntegrationTestWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public ApplicationStatusIntegrationTests(
        IntegrationTestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task UpdateApplicationStatus_CreatesNotificationForCandidate()
    {
        var company = await RegisterAndGetTokenAsync("Company");
        var jobId = await CreateJobAsync(company.Token);
        var candidate = await RegisterAndGetTokenAsync("Candidate");

        var applicationId = await ApplyForJobAsync(
            jobId,
            candidate.Token);

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Patch,
            $"/api/job-applications/{applicationId}/status",
            company.Token,
            new
            {
                status = "Accepted"
            });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var application = await dbContext.JobApplications
            .SingleAsync(item => item.Id == applicationId);

        Assert.Equal("Accepted", application.Status.ToString());

        var candidateUser = await dbContext.Users.SingleAsync(
            user => user.Email == candidate.Email);

        var notification = await dbContext.Notifications
            .FirstOrDefaultAsync(item =>
                item.UserId == candidateUser.Id &&
                item.Message.Contains("prihvaćena"));

        Assert.NotNull(notification);
        Assert.False(notification.IsRead);
    }

    [Fact]
    public async Task UpdateApplicationStatus_WithCandidateToken_ReturnsForbidden()
    {
        var company = await RegisterAndGetTokenAsync("Company");
        var jobId = await CreateJobAsync(company.Token);
        var candidate = await RegisterAndGetTokenAsync("Candidate");
        var applicationId = await ApplyForJobAsync(jobId, candidate.Token);

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Patch,
            $"/api/job-applications/{applicationId}/status",
            candidate.Token,
            new { status = "Accepted" });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    private async Task<Guid> CreateJobAsync(string companyToken)
    {
        var title = $"Status test job {Guid.NewGuid():N}";

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            "/api/jobs",
            companyToken,
            new
            {
                title,
                description =
                    "This is a valid job description for status integration testing.",
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

        return job.Id;
    }

    private async Task<Guid> ApplyForJobAsync(
        Guid jobId,
        string candidateToken)
    {
        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            $"/api/job-applications/jobs/{jobId}",
            candidateToken,
            new
            {
                coverLetter =
                    "I am applying for this position through an integration test.",
                answers = Array.Empty<object>()
            });

        response.EnsureSuccessStatusCode();

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var application = await dbContext.JobApplications
            .SingleAsync(item => item.JobListingId == jobId);

        return application.Id;
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
