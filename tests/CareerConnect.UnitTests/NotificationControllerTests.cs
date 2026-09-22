using System.Security.Claims;
using Domain.DTOs.Notification;
using Domain.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CareerConnect.UnitTests;

public class NotificationControllerTests
{
    [Fact]
    public async Task GetMine_ReturnsNotificationsForCurrentUser()
    {
        var userId = Guid.NewGuid();
        var notificationService = new Mock<INotificationService>();

        var expectedNotifications = new List<NotificationDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Message = "Your application status has changed."
            }
        };

        notificationService
            .Setup(service => service.GetMyNotificationsAsync(userId))
            .ReturnsAsync(expectedNotifications);

        var controller = CreateController(
            notificationService.Object,
            userId);

        var result = await controller.GetMine();

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedNotifications, okResult.Value);
    }

    [Fact]
    public async Task MarkAsRead_ReturnsNoContent_WhenNotificationBelongsToUser()
    {
        var userId = Guid.NewGuid();
        var notificationId = Guid.NewGuid();
        var notificationService = new Mock<INotificationService>();

        notificationService
            .Setup(service => service.MarkAsReadAsync(
                userId,
                notificationId))
            .Returns(Task.CompletedTask);

        var controller = CreateController(
            notificationService.Object,
            userId);

        var result = await controller.MarkAsRead(notificationId);

        Assert.IsType<NoContentResult>(result);

        notificationService.Verify(
            service => service.MarkAsReadAsync(
                userId,
                notificationId),
            Times.Once);
    }

    [Fact]
    public async Task MarkAsRead_ReturnsNotFound_WhenNotificationDoesNotBelongToUser()
    {
        var userId = Guid.NewGuid();
        var notificationId = Guid.NewGuid();
        var notificationService = new Mock<INotificationService>();

        notificationService
            .Setup(service => service.MarkAsReadAsync(
                userId,
                notificationId))
            .ThrowsAsync(
                new InvalidOperationException(
                    "Notification not found."));

        var controller = CreateController(
            notificationService.Object,
            userId);

        var result = await controller.MarkAsRead(notificationId);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task MarkAllAsRead_ReturnsNoContent_AndUsesCurrentUser()
    {
        var userId = Guid.NewGuid();
        var notificationService = new Mock<INotificationService>();

        notificationService
            .Setup(service => service.MarkAllAsReadAsync(userId))
            .Returns(Task.CompletedTask);

        var controller = CreateController(
            notificationService.Object,
            userId);

        var result = await controller.MarkAllAsRead();

        Assert.IsType<NoContentResult>(result);

        notificationService.Verify(
            service => service.MarkAllAsReadAsync(userId),
            Times.Once);
    }

    private static NotificationController CreateController(
        INotificationService notificationService,
        Guid userId)
    {
        var controller = new NotificationController(
            notificationService);

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