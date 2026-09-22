using System.Security.Claims;
using backend.Controllers;
using backend.Domain.DTOs.CandidateProfile;
using backend.Domain.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CareerConnect.UnitTests;

public class CandidateControllerTests
{
    [Fact]
    public async Task Get_ReturnsCurrentCandidatesProfile()
    {
        var userId = Guid.NewGuid();
        var candidateService = new Mock<ICandidateService>();

        var expectedProfile = new CandidateProfileDto
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Bio = "I am a software developer with experience.",
            Location = "Novi Sad"
        };

        candidateService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(expectedProfile);

        var controller = CreateController(
            candidateService.Object,
            userId);

        var result = await controller.Get();

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedProfile, okResult.Value);
    }

    [Fact]
    public async Task Update_ReturnsUpdatedProfile_ForCurrentUser()
    {
        var userId = Guid.NewGuid();
        var candidateService = new Mock<ICandidateService>();

        var request = new UpdateCandidateProfileRequest
        {
            Bio = "I am a software developer with more than enough text.",
            Location = "Novi Sad"
        };

        var expectedProfile = new CandidateProfileDto
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Bio = request.Bio,
            Location = request.Location
        };

        candidateService
            .Setup(service => service.UpdateCandidateProfileAsync(
                userId,
                request))
            .ReturnsAsync(expectedProfile);

        var controller = CreateController(
            candidateService.Object,
            userId);

        var result = await controller.Update(request);

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedProfile, okResult.Value);

        candidateService.Verify(
            service => service.UpdateCandidateProfileAsync(
                userId,
                request),
            Times.Once);
    }

    [Fact]
    public async Task DeleteEducation_ReturnsNotFound_WhenEducationDoesNotExist()
    {
        var userId = Guid.NewGuid();
        var educationId = Guid.NewGuid();
        var candidateService = new Mock<ICandidateService>();

        candidateService
            .Setup(service => service.RemoveEducationAsync(
                userId,
                educationId))
            .ReturnsAsync(false);

        var controller = CreateController(
            candidateService.Object,
            userId);

        var result = await controller.DeleteEducation(educationId);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeleteWorkExperience_ReturnsOk_WhenExperienceIsDeleted()
    {
        var userId = Guid.NewGuid();
        var workExperienceId = Guid.NewGuid();
        var candidateService = new Mock<ICandidateService>();

        candidateService
            .Setup(service => service.RemoveWorkExperienceAsync(
                userId,
                workExperienceId))
            .ReturnsAsync(true);

        var controller = CreateController(
            candidateService.Object,
            userId);

        var result = await controller.DeleteWorkExperience(
            workExperienceId);

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Equal(true, okResult.Value);
    }

    private static CandidateController CreateController(
        ICandidateService candidateService,
        Guid userId)
    {
        var controller = new CandidateController(
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