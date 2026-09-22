using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using backend.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CareerConnect.IntegrationTests;

public class JobApplicationIntegrationTests
    : IClassFixture<IntegrationTestWebApplicationFactory>
{
    private readonly IntegrationTestWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public JobApplicationIntegrationTests(
        IntegrationTestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ApplyForJob_WithValidCandidate_SavesApplication()
    {
        var jobId = await CreateJobAsync();
        var candidate = await RegisterAndGetTokenAsync("Candidate");

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            $"/api/job-applications/jobs/{jobId}",
            candidate.Token,
            new
            {
                coverLetter =
                    "I am interested in this position and would like to apply.",
                answers = Array.Empty<object>()
            });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var applicationExists = await dbContext.JobApplications
            .AnyAsync(application =>
                application.JobListingId == jobId);

        Assert.True(applicationExists);
    }

    [Fact]
    public async Task ApplyForJob_TwiceForSameJob_ReturnsBadRequest()
    {
        var jobId = await CreateJobAsync();
        var candidate = await RegisterAndGetTokenAsync("Candidate");

        await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            $"/api/job-applications/jobs/{jobId}",
            candidate.Token,
            new
            {
                coverLetter = "My first application.",
                answers = Array.Empty<object>()
            });

        var duplicateResponse = await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            $"/api/job-applications/jobs/{jobId}",
            candidate.Token,
            new
            {
                coverLetter = "My duplicate application.",
                answers = Array.Empty<object>()
            });

        Assert.Equal(
            HttpStatusCode.BadRequest,
            duplicateResponse.StatusCode);
    }

    private async Task<Guid> CreateJobAsync()
    {
        var company = await RegisterAndGetTokenAsync("Company");
        var title = $"Test job {Guid.NewGuid():N}";

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            "/api/jobs",
            company.Token,
            new
            {
                title,
                description =
                    "This is a valid job description for integration testing.",
                location = "Novi Sad",
                experienceLevel = "Junior",
                jobCategory = "SoftwareDevelopment",
                expiresAt = DateTime.UtcNow.AddDays(14),
                skills = new[] { "CSharp", "SQL" },
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