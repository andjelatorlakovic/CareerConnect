using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace CareerConnect.IntegrationTests;

public class UserAccountIntegrationTests
    : IClassFixture<IntegrationTestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public UserAccountIntegrationTests(
        IntegrationTestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ChangePassword_WithCorrectCurrentPassword_ChangesLoginPassword()
    {
        var email = $"account-{Guid.NewGuid():N}@example.com";
        const string oldPassword = "Password123!";
        const string newPassword = "NewPassword456!";

        var token = await RegisterCandidateAndGetTokenAsync(
            email,
            oldPassword);

        var request = new HttpRequestMessage(
            HttpMethod.Patch,
            "/api/users/me/password");

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        request.Content = JsonContent.Create(new
        {
            currentPassword = oldPassword,
            newPassword
        });

        var changePasswordResponse = await _client.SendAsync(request);

        Assert.Equal(
            HttpStatusCode.NoContent,
            changePasswordResponse.StatusCode);

        var oldPasswordLoginResponse =
            await _client.PostAsJsonAsync(
                "/api/auth/login",
                new
                {
                    email,
                    password = oldPassword
                });

        Assert.Equal(
            HttpStatusCode.BadRequest,
            oldPasswordLoginResponse.StatusCode);

        var newPasswordLoginResponse =
            await _client.PostAsJsonAsync(
                "/api/auth/login",
                new
                {
                    email,
                    password = newPassword
                });

        Assert.Equal(
            HttpStatusCode.OK,
            newPasswordLoginResponse.StatusCode);
    }

    [Fact]
    public async Task ChangePassword_WithWrongCurrentPassword_ReturnsBadRequest()
    {
        var email = $"wrong-current-{Guid.NewGuid():N}@example.com";
        const string password = "Password123!";

        var token = await RegisterCandidateAndGetTokenAsync(
            email,
            password);

        var request = new HttpRequestMessage(
            HttpMethod.Patch,
            "/api/users/me/password");

        request.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        request.Content = JsonContent.Create(new
        {
            currentPassword = "WrongPassword123!",
            newPassword = "NewPassword456!"
        });

        var response = await _client.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    private async Task<string> RegisterCandidateAndGetTokenAsync(
        string email,
        string password)
    {
        var response = await _client.PostAsJsonAsync(
            "/api/auth/register",
            new
            {
                firstName = "Test",
                lastName = "User",
                email,
                password,
                role = "Candidate"
            });

        response.EnsureSuccessStatusCode();

        var responseText =
            await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(responseText);

        return document.RootElement
            .GetProperty("token")
            .GetString()
            ?? throw new InvalidOperationException(
                "Registration response does not contain a token.");
    }
}