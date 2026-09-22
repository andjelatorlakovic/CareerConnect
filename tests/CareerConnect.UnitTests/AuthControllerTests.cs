using backend.Controllers;
using backend.Domain.DTOs;
using backend.Domain.Enums;
using backend.Domain.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CareerConnect.UnitTests;

public class AuthControllerTests
{
    [Fact]
    public async Task Register_ReturnsOk_WhenServiceRegistersUser()
    {
        var authService = new Mock<IAuthService>();

        var request = new RegisterDto
        {
            FirstName = "Ana",
            LastName = "Anic",
            Email = "ana@example.com",
            Password = "password123",
            Role = UserRole.Candidate
        };

        var expectedResponse = new AuthResponseDto
        {
            Token = "test-token",
            Email = request.Email,
            Role = UserRole.Candidate
        };

        authService
            .Setup(service => service.RegisterAsync(request))
            .ReturnsAsync(expectedResponse);

        var controller = new AuthController(authService.Object);

        var result = await controller.Register(request);

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedResponse, okResult.Value);

        authService.Verify(
            service => service.RegisterAsync(request),
            Times.Once);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenServiceRejectsRegistration()
    {
        var authService = new Mock<IAuthService>();

        var request = new RegisterDto
        {
            Email = "ana@example.com",
            Password = "password123",
            Role = UserRole.Candidate
        };

        authService
            .Setup(service => service.RegisterAsync(request))
            .ThrowsAsync(
                new InvalidOperationException(
                    "Ime i prezime su obavezni za kandidata."));

        var controller = new AuthController(authService.Object);

        var result = await controller.Register(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Login_ReturnsOk_WhenCredentialsAreCorrect()
    {
        var authService = new Mock<IAuthService>();

        var request = new LoginDto
        {
            Email = "ana@example.com",
            Password = "password123"
        };

        var expectedResponse = new AuthResponseDto
        {
            Token = "test-token",
            Email = request.Email,
            Role = UserRole.Candidate
        };

        authService
            .Setup(service => service.LoginAsync(request))
            .ReturnsAsync(expectedResponse);

        var controller = new AuthController(authService.Object);

        var result = await controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedResponse, okResult.Value);
    }

    [Fact]
    public async Task Login_ReturnsBadRequest_WhenCredentialsAreInvalid()
    {
        var authService = new Mock<IAuthService>();

        var request = new LoginDto
        {
            Email = "ana@example.com",
            Password = "wrong-password"
        };

        authService
            .Setup(service => service.LoginAsync(request))
            .ThrowsAsync(
                new InvalidOperationException(
                    "Invalid email or password."));

        var controller = new AuthController(authService.Object);

        var result = await controller.Login(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Logout_CallsServiceAndReturnsOk()
    {
        var authService = new Mock<IAuthService>();

        authService
            .Setup(service => service.Logoutasync())
            .Returns(Task.CompletedTask);

        var controller = new AuthController(authService.Object);

        var result = await controller.Logout();

        Assert.IsType<OkObjectResult>(result);

        authService.Verify(
            service => service.Logoutasync(),
            Times.Once);
    }
}