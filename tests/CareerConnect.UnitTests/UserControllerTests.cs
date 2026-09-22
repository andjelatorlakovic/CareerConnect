using System.Security.Claims;
using backend.Domain.DTOs.User;
using backend.Domain.Enums;
using backend.Domain.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CareerConnect.UnitTests;

public class UserControllerTests
{
    [Fact]
    public async Task GetMe_ReturnsCurrentUser()
    {
        var userId = Guid.NewGuid();
        var userService = new Mock<IUserService>();

        var expectedUser = new UserDto
        {
            Id = userId,
            FirstName = "Ana",
            LastName = "Anic",
            Email = "ana@example.com",
            Role = UserRole.Candidate
        };

        userService
            .Setup(service => service.GetByIdAsync(userId))
            .ReturnsAsync(expectedUser);

        var controller = CreateController(
            userService.Object,
            userId);

        var result = await controller.GetMe();

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedUser, okResult.Value);
    }

    [Fact]
    public async Task ChangePassword_ReturnsNoContent_WhenPasswordIsChanged()
    {
        var userId = Guid.NewGuid();
        var userService = new Mock<IUserService>();

        var request = new ChangePasswordRequest
        {
            CurrentPassword = "old-password",
            NewPassword = "new-password"
        };

        userService
            .Setup(service => service.ChangePasswordAsync(
                userId,
                request))
            .Returns(Task.CompletedTask);

        var controller = CreateController(
            userService.Object,
            userId);

        var result = await controller.ChangePassword(request);

        Assert.IsType<NoContentResult>(result);

        userService.Verify(
            service => service.ChangePasswordAsync(
                userId,
                request),
            Times.Once);
    }

    [Fact]
    public async Task ChangePassword_ReturnsBadRequest_WhenCurrentPasswordIsIncorrect()
    {
        var userId = Guid.NewGuid();
        var userService = new Mock<IUserService>();

        var request = new ChangePasswordRequest
        {
            CurrentPassword = "wrong-password",
            NewPassword = "new-password"
        };

        userService
            .Setup(service => service.ChangePasswordAsync(
                userId,
                request))
            .ThrowsAsync(
                new InvalidOperationException(
                    "Current password is incorrect."));

        var controller = CreateController(
            userService.Object,
            userId);

        var result = await controller.ChangePassword(request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task DeactivateUser_ReturnsNoContent_WhenAdminOperationSucceeds()
    {
        var userId = Guid.NewGuid();
        var targetUserId = Guid.NewGuid();
        var userService = new Mock<IUserService>();

        userService
            .Setup(service => service.DeactivateUserAsync(targetUserId))
            .Returns(Task.CompletedTask);

        var controller = CreateController(
            userService.Object,
            userId);

        var result = await controller.DeactivateUser(targetUserId);

        Assert.IsType<NoContentResult>(result);

        userService.Verify(
            service => service.DeactivateUserAsync(targetUserId),
            Times.Once);
    }

    private static UserController CreateController(
        IUserService userService,
        Guid userId)
    {
        var controller = new UserController(userService);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(
                    new ClaimsIdentity(
                    [
                        new Claim(
                            ClaimTypes.NameIdentifier,
                            userId.ToString())
                    ],
                    "TestAuthentication"))
            }
        };

        return controller;
    }
}