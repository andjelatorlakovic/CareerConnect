using System.Net;
using System.Net.Http.Json;
using backend.Database;
using backend.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CareerConnect.IntegrationTests;

public class AuthIntegrationTests
    : IClassFixture<IntegrationTestWebApplicationFactory>
{
    private readonly IntegrationTestWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public AuthIntegrationTests(
        IntegrationTestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_WithValidCandidate_ReturnsOkAndSavesUser()
    {
        var email = $"test-{Guid.NewGuid():N}@example.com";

        var request = new
        {
            firstName = "Test",
            lastName = "Candidate",
            email,
            password = "Password123!",
            role = "Candidate"
        };

        var response = await _client.PostAsJsonAsync(
            "/api/auth/register",
            request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var savedUser = await dbContext.Users
            .SingleOrDefaultAsync(user => user.Email == email);

        Assert.NotNull(savedUser);
        Assert.Equal(UserRole.Candidate, savedUser.Role);
        Assert.Equal("Test", savedUser.FirstName);
        Assert.Equal("Candidate", savedUser.LastName);
    }

    [Fact]
    public async Task Register_WithInvalidEmail_ReturnsBadRequest()
    {
        var request = new
        {
            firstName = "Test",
            lastName = "Candidate",
            email = "nije-ispravan-email",
            password = "Password123!",
            role = "Candidate"
        };

        var response = await _client.PostAsJsonAsync(
            "/api/auth/register",
            request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithDuplicateEmail_ReturnsBadRequest()
    {
        var email = $"duplicate-{Guid.NewGuid():N}@example.com";

        var request = new
        {
            firstName = "Test",
            lastName = "Candidate",
            email,
            password = "Password123!",
            role = "Candidate"
        };

        await _client.PostAsJsonAsync("/api/auth/register", request);

        var response = await _client.PostAsJsonAsync(
            "/api/auth/register",
            request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
    [Fact]
public async Task Login_WithCorrectCredentials_ReturnsOkAndToken()
{
    var email = $"login-{Guid.NewGuid():N}@example.com";
    var password = "Password123!";

    await _client.PostAsJsonAsync("/api/auth/register", new
    {
        firstName = "Test",
        lastName = "User",
        email,
        password,
        role = "Candidate"
    });

    var response = await _client.PostAsJsonAsync(
        "/api/auth/login",
        new
        {
            email,
            password
        });

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var responseText = await response.Content.ReadAsStringAsync();

    Assert.Contains("token", responseText, StringComparison.OrdinalIgnoreCase);
    Assert.Contains(email, responseText);
}

[Fact]
public async Task Login_WithWrongPassword_ReturnsBadRequest()
{
    var email = $"wrong-password-{Guid.NewGuid():N}@example.com";

    await _client.PostAsJsonAsync("/api/auth/register", new
    {
        firstName = "Test",
        lastName = "User",
        email,
        password = "Password123!",
        role = "Candidate"
    });

    var response = await _client.PostAsJsonAsync(
        "/api/auth/login",
        new
        {
            email,
            password = "WrongPassword123!"
        });

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
}
}