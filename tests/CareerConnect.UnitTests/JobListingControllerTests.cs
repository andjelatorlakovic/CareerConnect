using System.Security.Claims;
using Domain.DTOs.CompanyProfile;
using Domain.DTOs.JobListing;
using Domain.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CareerConnect.UnitTests;

public class JobListingControllerTests
{
    [Fact]
    public async Task GetAll_ReturnsJobs_AndUsesEmptySkillsListWhenSkillsAreNotProvided()
    {
        var jobService = new Mock<IJobService>();
        var companyService = new Mock<ICompanyService>();

        var expectedJobs = new List<JobListingDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Title = "Backend Developer"
            }
        };

        jobService
            .Setup(service => service.GetAllAsync(
                null,
                null,
                It.IsAny<List<backend.Domain.Enums.Skill>>()))
            .ReturnsAsync(expectedJobs);

        var controller = new JobListingController(
            jobService.Object,
            companyService.Object);

        var result = await controller.GetAll(
            null,
            null,
            null);

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedJobs, okResult.Value);

        jobService.Verify(
            service => service.GetAllAsync(
                null,
                null,
                It.Is<List<backend.Domain.Enums.Skill>>(
                    skills => skills.Count == 0)),
            Times.Once);
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenJobDoesNotExist()
    {
        var jobService = new Mock<IJobService>();
        var companyService = new Mock<ICompanyService>();
        var jobId = Guid.NewGuid();

        jobService
            .Setup(service => service.GetByIdAsync(jobId))
            .ThrowsAsync(
                new InvalidOperationException("Job not found."));

        var controller = new JobListingController(
            jobService.Object,
            companyService.Object);

        var result = await controller.GetById(jobId);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Create_ReturnsCreatedAtAction_AndUsesCurrentCompanyProfile()
    {
        var userId = Guid.NewGuid();
        var companyProfileId = Guid.NewGuid();

        var jobService = new Mock<IJobService>();
        var companyService = new Mock<ICompanyService>();

        companyService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(new CompanyProfileDto
            {
                Id = companyProfileId
            });

        var request = new CreateJobListingRequest();

        var expectedJob = new JobListingDto
        {
            Id = Guid.NewGuid(),
            CompanyProfileId = companyProfileId,
            Title = "Backend Developer"
        };

        jobService
            .Setup(service => service.CreateAsync(
                companyProfileId,
                request))
            .ReturnsAsync(expectedJob);

        var controller = CreateController(
            jobService.Object,
            companyService.Object,
            userId);

        var result = await controller.Create(request);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);

        Assert.Same(expectedJob, createdResult.Value);

        jobService.Verify(
            service => service.CreateAsync(
                companyProfileId,
                request),
            Times.Once);
    }

    [Fact]
    public async Task Close_ReturnsNotFound_WhenJobDoesNotBelongToCompany()
    {
        var userId = Guid.NewGuid();
        var companyProfileId = Guid.NewGuid();
        var jobId = Guid.NewGuid();

        var jobService = new Mock<IJobService>();
        var companyService = new Mock<ICompanyService>();

        companyService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(new CompanyProfileDto
            {
                Id = companyProfileId
            });

        jobService
            .Setup(service => service.CloseAsync(
                companyProfileId,
                jobId))
            .ReturnsAsync(false);

        var controller = CreateController(
            jobService.Object,
            companyService.Object,
            userId);

        var result = await controller.Close(jobId);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    private static JobListingController CreateController(
        IJobService jobService,
        ICompanyService companyService,
        Guid userId)
    {
        var controller = new JobListingController(
            jobService,
            companyService);

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