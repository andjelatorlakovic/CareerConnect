using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace CareerConnect.IntegrationTests;

public class MatchingIntegrationTests
    : IClassFixture<IntegrationTestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public MatchingIntegrationTests(
        IntegrationTestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetMatchingJobs_ReturnsCorrectMatchPercentage()
    {
        var company = await RegisterAndGetTokenAsync("Company");
        var jobId = await CreateJobAsync(company.Token);

        var candidate = await RegisterAndGetTokenAsync("Candidate");

        await SendAuthorizedRequestAsync(
            HttpMethod.Get,
            "/api/candidate-profile",
            candidate.Token);

        var updateProfileResponse = await SendAuthorizedRequestAsync(
            HttpMethod.Put,
            "/api/candidate-profile",
            candidate.Token,
            new
            {
                bio = "I am a junior developer interested in backend development.",
                location = "Novi Sad",
                experienceLevel = "Junior",
                skills = new[] { "CSharp", "SQL" },
                desiredJobCategories = new[]
                {
                    "SoftwareDevelopment"
                }
            });

        Assert.Equal(HttpStatusCode.OK, updateProfileResponse.StatusCode);

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Get,
            "/api/matching/jobs",
            candidate.Token);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var responseText = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(responseText);

        var matchingJob = document.RootElement
            .EnumerateArray()
            .Single(item =>
                item.GetProperty("jobId").GetGuid() == jobId);

        var matchPercentage = matchingJob
            .GetProperty("matchPercentage")
            .GetDecimal();

        Assert.Equal(66.67m, matchPercentage);
    }

    private async Task<Guid> CreateJobAsync(string companyToken)
    {
        var title = $"Matching test job {Guid.NewGuid():N}";

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Post,
            "/api/jobs",
            companyToken,
            new
            {
                title,
                description =
                    "A software developer position used for matching integration testing.",
                location = "Novi Sad",
                experienceLevel = "Junior",
                jobCategory = "SoftwareDevelopment",
                expiresAt = DateTime.UtcNow.AddDays(14),
                skills = new[] { "CSharp", "SQL", "React" },
                employmentType = "FullTime",
                salaryMin = 1000,
                salaryMax = 1500
            });

        response.EnsureSuccessStatusCode();

        var jobsResponse = await SendAuthorizedRequestAsync(
            HttpMethod.Get,
            "/api/jobs/my",
            companyToken);

        jobsResponse.EnsureSuccessStatusCode();

        var responseText = await jobsResponse.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(responseText);

        return document.RootElement
            .EnumerateArray()
            .Single(item =>
                item.GetProperty("title").GetString() == title)
            .GetProperty("id")
            .GetGuid();
    }

    private async Task<HttpResponseMessage> SendAuthorizedRequestAsync(
        HttpMethod method,
        string url,
        string token,
        object? body = null)
    {
        var request = new HttpRequestMessage(method, url);

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        if (body is not null)
        {
            request.Content = JsonContent.Create(body);
        }

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