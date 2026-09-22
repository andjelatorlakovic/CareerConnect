using System.Security.Claims;
using backend.Controllers;
using backend.Domain.DTOs.CandidateProfile;
using backend.Domain.Services;
using Domain.DTOs.CompanyProfile;
using Domain.DTOs.JobApplication;
using Domain.Enums;
using Domain.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CareerConnect.UnitTests;

public class JobApplicationControllerTests
{
    [Fact]
    public async Task Apply_ReturnsOk_AndUsesCurrentCandidatesProfile()
    {
        var userId = Guid.NewGuid();
        var candidateProfileId = Guid.NewGuid();
        var jobId = Guid.NewGuid();

        var candidateService = new Mock<ICandidateService>();
        var companyService = new Mock<ICompanyService>();
        var applicationService = new Mock<IJobApplicationService>();

        candidateService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(new CandidateProfileDto
            {
                Id = candidateProfileId
            });

        var request = new CreateJobApplicationRequest
        {
            CoverLetter = "Motivation letter"
        };

        var expectedApplication = new JobApplicationDto
        {
            Id = Guid.NewGuid(),
            CandidateProfileId = candidateProfileId,
            JobListingId = jobId,
            Status = ApplicationStatus.Pending
        };

        applicationService
            .Setup(service => service.ApplyJobApplicationAsync(
                candidateProfileId,
                jobId,
                request))
            .ReturnsAsync(expectedApplication);

        var controller = CreateController(
            applicationService.Object,
            candidateService.Object,
            companyService.Object,
            userId);

        var result = await controller.Apply(jobId, request);

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedApplication, okResult.Value);

        applicationService.Verify(
            service => service.ApplyJobApplicationAsync(
                candidateProfileId,
                jobId,
                request),
            Times.Once);
    }

    [Fact]
    public async Task Apply_ReturnsBadRequest_WhenApplicationServiceRejectsRequest()
    {
        var userId = Guid.NewGuid();
        var candidateProfileId = Guid.NewGuid();
        var jobId = Guid.NewGuid();

        var candidateService = new Mock<ICandidateService>();
        var companyService = new Mock<ICompanyService>();
        var applicationService = new Mock<IJobApplicationService>();

        candidateService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(new CandidateProfileDto
            {
                Id = candidateProfileId
            });

        var request = new CreateJobApplicationRequest();

        applicationService
            .Setup(service => service.ApplyJobApplicationAsync(
                candidateProfileId,
                jobId,
                request))
            .ThrowsAsync(
                new InvalidOperationException(
                    "You already applied for this job."));

        var controller = CreateController(
            applicationService.Object,
            candidateService.Object,
            companyService.Object,
            userId);

        var result = await controller.Apply(jobId, request);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task GetMyApplications_ReturnsApplicationsForCurrentCandidate()
    {
        var userId = Guid.NewGuid();
        var candidateProfileId = Guid.NewGuid();

        var candidateService = new Mock<ICandidateService>();
        var companyService = new Mock<ICompanyService>();
        var applicationService = new Mock<IJobApplicationService>();

        candidateService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(new CandidateProfileDto
            {
                Id = candidateProfileId
            });

        var expectedApplications = new List<JobApplicationDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                CandidateProfileId = candidateProfileId,
                Status = ApplicationStatus.Pending
            }
        };

        applicationService
            .Setup(service =>
                service.GetMyApplicationsAsync(candidateProfileId))
            .ReturnsAsync(expectedApplications);

        var controller = CreateController(
            applicationService.Object,
            candidateService.Object,
            companyService.Object,
            userId);

        var result = await controller.GetMyApplications();

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedApplications, okResult.Value);
    }

    [Fact]
    public async Task UpdateStatus_ReturnsOk_WhenCompanyUpdatesItsApplication()
    {
        var userId = Guid.NewGuid();
        var companyProfileId = Guid.NewGuid();
        var applicationId = Guid.NewGuid();

        var candidateService = new Mock<ICandidateService>();
        var companyService = new Mock<ICompanyService>();
        var applicationService = new Mock<IJobApplicationService>();

        companyService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(new CompanyProfileDto
            {
                Id = companyProfileId
            });

        var request = new UpdateJobApplicationRequest
        {
            Status = ApplicationStatus.Accepted
        };

        var expectedApplication = new JobApplicationDto
        {
            Id = applicationId,
            Status = ApplicationStatus.Accepted
        };

        applicationService
            .Setup(service => service.UpdateStatusAsync(
                companyProfileId,
                applicationId,
                request))
            .ReturnsAsync(expectedApplication);

        var controller = CreateController(
            applicationService.Object,
            candidateService.Object,
            companyService.Object,
            userId);

        var result = await controller.UpdateStatus(
            applicationId,
            request);

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedApplication, okResult.Value);
    }

    private static JobApplicationController CreateController(
        IJobApplicationService applicationService,
        ICandidateService candidateService,
        ICompanyService companyService,
        Guid userId)
    {
        var controller = new JobApplicationController(
            applicationService,
            candidateService,
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