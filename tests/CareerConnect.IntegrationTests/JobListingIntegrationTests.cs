using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using backend.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CareerConnect.IntegrationTests;

public class JobListingIntegrationTests
    : IClassFixture<IntegrationTestWebApplicationFactory>
{
    private readonly IntegrationTestWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public JobListingIntegrationTests(
        IntegrationTestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateJob_WithValidCompanyToken_SavesJob()
    {
        var company = await RegisterCompanyAndGetTokenAsync();
        var title = $"Backend Developer {Guid.NewGuid():N}";

        var request = CreateAuthorizedRequest(
            HttpMethod.Post,
            "/api/jobs",
            company.Token,
            new
            {
                title,
                description =
                    "We are looking for a backend developer for our team.",
                location = "Novi Sad",
                experienceLevel = "Junior",
                jobCategory = "SoftwareDevelopment",
                expiresAt = DateTime.UtcNow.AddDays(14),
                skills = new[] { "CSharp", "SQL" },
                employmentType = "FullTime",
                salaryMin = 1000,
                salaryMax = 1500
            });

        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var savedJob = await dbContext.JobListings
            .Include(job => job.JobSkills)
            .SingleOrDefaultAsync(job => job.Title == title);

        Assert.NotNull(savedJob);
        Assert.Equal(2, savedJob.JobSkills.Count);
    }

    [Fact]
    public async Task CreateJob_WithPastExpirationDate_ReturnsBadRequest()
    {
        var company = await RegisterCompanyAndGetTokenAsync();

        var request = CreateAuthorizedRequest(
            HttpMethod.Post,
            "/api/jobs",
            company.Token,
            new
            {
                title = "Expired job",
                description =
                    "This job has an invalid expiration date in the past.",
                location = "Novi Sad",
                experienceLevel = "Junior",
                jobCategory = "SoftwareDevelopment",
                expiresAt = DateTime.UtcNow.AddDays(-1),
                skills = new[] { "CSharp" },
                employmentType = "FullTime",
                salaryMin = 1000,
                salaryMax = 1500
            });

        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateJob_WithCandidateToken_ReturnsForbidden()
    {
        var candidate = await RegisterAndGetTokenAsync("Candidate");

        var request = CreateAuthorizedRequest(
            HttpMethod.Post,
            "/api/jobs",
            candidate.Token,
            new
            {
                title = "Unauthorized job",
                description =
                    "A candidate must not be able to create a job listing.",
                location = "Novi Sad",
                experienceLevel = "Junior",
                jobCategory = "SoftwareDevelopment",
                expiresAt = DateTime.UtcNow.AddDays(14),
                skills = new[] { "CSharp" },
                employmentType = "FullTime"
            });

        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task UpdateAnotherCompanyJob_ReturnsNotFound()
    {
        var owner = await RegisterCompanyAndGetTokenAsync();
        var title = $"Owned job {Guid.NewGuid():N}";
        var createResponse = await _client.SendAsync(CreateAuthorizedRequest(
            HttpMethod.Post,
            "/api/jobs",
            owner.Token,
            CreateJobBody(title)));

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();
        var jobId = await dbContext.JobListings
            .Where(job => job.Title == title)
            .Select(job => job.Id)
            .SingleAsync();

        var otherCompany = await RegisterCompanyAndGetTokenAsync();
        var updateResponse = await _client.SendAsync(CreateAuthorizedRequest(
            HttpMethod.Put,
            $"/api/jobs/{jobId}",
            otherCompany.Token,
            CreateJobBody("Attempted change")));

        Assert.Equal(HttpStatusCode.NotFound, updateResponse.StatusCode);
    }

    private static object CreateJobBody(string title) => new
    {
        title,
        description = "A valid description for an integration test job listing.",
        location = "Novi Sad",
        experienceLevel = "Junior",
        jobCategory = "SoftwareDevelopment",
        expiresAt = DateTime.UtcNow.AddDays(14),
        skills = new[] { "CSharp" },
        employmentType = "FullTime",
        salaryMin = 1000,
        salaryMax = 1500
    };

    private static HttpRequestMessage CreateAuthorizedRequest(
        HttpMethod method,
        string url,
        string token,
        object body)
    {
        var request = new HttpRequestMessage(method, url);

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        request.Content = JsonContent.Create(body);

        return request;
    }

    private async Task<(string Token, string Email)>
        RegisterCompanyAndGetTokenAsync()
    {
        return await RegisterAndGetTokenAsync("Company");
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
