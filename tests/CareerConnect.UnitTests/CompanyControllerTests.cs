using System.Security.Claims;
using backend.Controllers;
using Domain.DTOs.CompanyProfile;
using Domain.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CareerConnect.UnitTests;

public class CompanyControllerTests
{
    [Fact]
    public async Task GetOrCreateCompanyProfile_ReturnsProfileForCurrentUser()
    {
        var userId = Guid.NewGuid();
        var companyService = new Mock<ICompanyService>();

        var expectedProfile = new CompanyProfileDto
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = "CareerConnect",
            Website = string.Empty
        };

        companyService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(expectedProfile);

        var controller = CreateController(
            companyService.Object,
            userId);

        var result = await controller.GetOrCreateCompanyProfile();

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedProfile, okResult.Value);
    }

    [Fact]
    public async Task UpdateCompanyProfile_ReturnsUpdatedProfileForCurrentUser()
    {
        var userId = Guid.NewGuid();
        var companyService = new Mock<ICompanyService>();

        var request = new UpdateCompanyProfileDto
        {
            Name = "CareerConnect",
            Description = "A company profile with a sufficiently long description.",
            Location = "Novi Sad",
            Website = null,
            Industry = "Software",
            ContactEmail = "contact@careerconnect.com",
            ContactPhone = "+381601234567"
        };

        var expectedProfile = new CompanyProfileDto
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = request.Name,
            Website = string.Empty
        };

        companyService
            .Setup(service => service.UpdateCompanyProfileAsync(
                userId,
                request))
            .ReturnsAsync(expectedProfile);

        var controller = CreateController(
            companyService.Object,
            userId);

        var result = await controller.UpdateCompanyProfile(request);

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedProfile, okResult.Value);

        companyService.Verify(
            service => service.UpdateCompanyProfileAsync(
                userId,
                request),
            Times.Once);
    }

    [Fact]
    public async Task GetOrCreateCompanyProfile_ThrowsWhenUserIdClaimIsInvalid()
    {
        var companyService = new Mock<ICompanyService>();

        var controller = new CompanyController(companyService.Object);

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
            () => controller.GetOrCreateCompanyProfile());
    }

    private static CompanyController CreateController(
        ICompanyService companyService,
        Guid userId)
    {
        var controller = new CompanyController(companyService);

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