using System.Security.Claims;
using backend.Controllers;
using backend.Domain.DTOs.CandidateProfile;
using backend.Domain.Services;
using Domain.DTOs.Matching;
using Domain.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CareerConnect.UnitTests;

public class MatchingControllerTests
{
    [Fact]
    public async Task GetMatchingJobs_ReturnsJobsForCurrentCandidate()
    {
        var userId = Guid.NewGuid();
        var candidateProfileId = Guid.NewGuid();

        var candidateService = new Mock<ICandidateService>();
        var matchingService = new Mock<IMatchingService>();

        candidateService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(new CandidateProfileDto
            {
                Id = candidateProfileId,
                UserId = userId
            });

        var expectedJobs = new List<MatchResultDto>
        {
            new()
            {
                JobId = Guid.NewGuid(),
                Tittle = "Backend Developer",
                MatchPercentage = 75
            }
        };

        matchingService
            .Setup(service =>
                service.GetMatchingJobsAsync(candidateProfileId))
            .ReturnsAsync(expectedJobs);

        var controller = CreateController(
            matchingService.Object,
            candidateService.Object,
            userId);

        var result = await controller.GetMatchingJobs();

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedJobs, okResult.Value);

        matchingService.Verify(
            service => service.GetMatchingJobsAsync(
                candidateProfileId),
            Times.Once);
    }

    [Fact]
    public async Task GetMatchingJobs_ThrowsWhenUserIdClaimIsInvalid()
    {
        var candidateService = new Mock<ICandidateService>();
        var matchingService = new Mock<IMatchingService>();

        var controller = new MatchingController(
            matchingService.Object,
            candidateService.Object);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(
                    new ClaimsIdentity(
                    [
                        new Claim(
                            ClaimTypes.NameIdentifier,
                            "invalid-id")
                    ],
                    "TestAuthentication"))
            }
        };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => controller.GetMatchingJobs());
    }

    private static MatchingController CreateController(
        IMatchingService matchingService,
        ICandidateService candidateService,
        Guid userId)
    {
        var controller = new MatchingController(
            matchingService,
            candidateService);

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