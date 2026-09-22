using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using backend.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CareerConnect.IntegrationTests;

public class CompanyProfileIntegrationTests
    : IClassFixture<IntegrationTestWebApplicationFactory>
{
    private readonly IntegrationTestWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public CompanyProfileIntegrationTests(
        IntegrationTestWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCompanyProfile_WithCompanyToken_CreatesProfile()
    {
        var registeredCompany =
            await RegisterCompanyAndGetTokenAsync();

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Get,
            "/api/company-profile/profile",
            registeredCompany.Token);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var user = await dbContext.Users.SingleAsync(
            user => user.Email == registeredCompany.Email);

        var profileExists = await dbContext.CompanyProfiles
            .AnyAsync(profile => profile.UserId == user.Id);

        Assert.True(profileExists);
    }

    [Fact]
    public async Task UpdateCompanyProfile_WithoutWebsite_SavesProfile()
    {
        var registeredCompany =
            await RegisterCompanyAndGetTokenAsync();

        await SendAuthorizedRequestAsync(
            HttpMethod.Get,
            "/api/company-profile/profile",
            registeredCompany.Token);

        var request = new HttpRequestMessage(
            HttpMethod.Put,
            "/api/company-profile/profile");

        request.Headers.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                registeredCompany.Token);

        request.Content = JsonContent.Create(new
        {
            name = "Test Company",
            description = "This is a valid description for a test company.",
            location = "Novi Sad",
            website = (string?)null,
            industry = "Information Technology",
            contactEmail = "contact@testcompany.com",
            contactPhone = "+38160123456"
        });

        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = _factory.Services.CreateScope();

        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var user = await dbContext.Users.SingleAsync(
            user => user.Email == registeredCompany.Email);

        var profile = await dbContext.CompanyProfiles.SingleAsync(
            profile => profile.UserId == user.Id);

        Assert.Equal("Test Company", profile.Name);
        Assert.Equal(string.Empty, profile.Website);
    }

    [Fact]
    public async Task GetCompanyProfile_WithCandidateToken_ReturnsForbidden()
    {
        var candidate = await RegisterCandidateAndGetTokenAsync();

        var response = await SendAuthorizedRequestAsync(
            HttpMethod.Get,
            "/api/company-profile/profile",
            candidate.Token);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    private async Task<HttpResponseMessage> SendAuthorizedRequestAsync(
        HttpMethod method,
        string url,
        string token)
    {
        var request = new HttpRequestMessage(method, url);

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        return await _client.SendAsync(request);
    }

    private async Task<(string Token, string Email)>
        RegisterCompanyAndGetTokenAsync()
    {
        return await RegisterAndGetTokenAsync("Company");
    }

    private async Task<(string Token, string Email)>
        RegisterCandidateAndGetTokenAsync()
    {
        return await RegisterAndGetTokenAsync("Candidate");
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