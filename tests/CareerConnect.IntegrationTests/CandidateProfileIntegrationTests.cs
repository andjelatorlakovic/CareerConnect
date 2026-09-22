using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using backend.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CareerConnect.IntegrationTests;

public class CandidateProfileIntegrationTests
    : IClassFixture<IntegrationTestWebApplicationFactory>
{
    private readonly IntegrationTestWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public CandidateProfileIntegrationTests(
        IntegrationTestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCandidateProfile_WithValidToken_CreatesAndReturnsProfile()
    {
        var registeredCandidate =
            await RegisterCandidateAndGetTokenAsync();

        var request = new HttpRequestMessage(
            HttpMethod.Get,
            "/api/candidate-profile");

        request.Headers.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                registeredCandidate.Token);

        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var user = await dbContext.Users.SingleAsync(
            user => user.Email == registeredCandidate.Email);

        var profileExists = await dbContext.CandidateProfiles
            .AnyAsync(profile => profile.UserId == user.Id);

        Assert.True(profileExists);
    }

    [Fact]
    public async Task GetCandidateProfile_WithoutToken_ReturnsUnauthorized()
    {
        var response = await _client.GetAsync(
            "/api/candidate-profile");

        Assert.Equal(
            HttpStatusCode.Unauthorized,
            response.StatusCode);
    }

    private async Task<(string Token, string Email)>
        RegisterCandidateAndGetTokenAsync()
    {
        var email = $"candidate-{Guid.NewGuid():N}@example.com";

        var response = await _client.PostAsJsonAsync(
            "/api/auth/register",
            new
            {
                firstName = "Test",
                lastName = "Candidate",
                email,
                password = "Password123!",
                role = "Candidate"
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