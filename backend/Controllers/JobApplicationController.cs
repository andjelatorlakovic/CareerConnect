using System.Security.Claims;
using backend.Domain.Services;
using Domain.DTOs.CompanyProfile;
using Domain.DTOs.JobApplication;
using Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/job-applications")]
[Authorize]
public class JobApplicationController : ControllerBase
{
    private readonly IJobApplicationService _jobApplicationService;
    private readonly ICandidateService _candidateService;
    private readonly ICompanyService _companyService;

    public JobApplicationController(
        IJobApplicationService jobApplicationService,
        ICandidateService candidateService,
        ICompanyService companyService)
    {
        _jobApplicationService = jobApplicationService;
        _candidateService = candidateService;
        _companyService = companyService;
    }

    [HttpPost("jobs/{jobId}")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> Apply(
        Guid jobId,
        CreateJobApplicationRequest request)
    {
        try
        {
            var candidateProfile = await GetCandidateProfileAsync();

            var application = await _jobApplicationService.ApplyJobApplicationAsync(
                candidateProfile.Id,
                jobId,
                request
            );

            return Ok(application);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [HttpGet("my")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> GetMyApplications()
    {
        var candidateProfile = await GetCandidateProfileAsync();

        var applications =
            await _jobApplicationService.GetMyApplicationsAsync(
                candidateProfile.Id
            );

        return Ok(applications);
    }

    [HttpGet("jobs/{jobId}")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> GetApplicationsForJob(Guid jobId)
    {
        try
        {
            var companyProfile = await GetCompanyProfileAsync();

            var applications = await _jobApplicationService.GetByJobAsync(
                companyProfile.Id,
                jobId
            );

            return Ok(applications);
        }
        catch (InvalidOperationException exception)
        {
            return NotFound(new { message = exception.Message });
        }
    }

    [HttpPatch("{applicationId}/status")]
    [Authorize(Roles = "Company")]
    public async Task<IActionResult> UpdateStatus(
        Guid applicationId,
        UpdateJobApplicationRequest request)
    {
        try
        {
            var companyProfile = await GetCompanyProfileAsync();

            var application =
                await _jobApplicationService.UpdateStatusAsync(
                    companyProfile.Id,
                    applicationId,
                    request
                );

            return Ok(application);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    private Guid GetUserId()
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            throw new UnauthorizedAccessException(
                "Korisnik nije validan."
            );
        }

        return userId;
    }

    private async Task<
        backend.Domain.DTOs.CandidateProfile.CandidateProfileDto>
        GetCandidateProfileAsync()
    {
        return await _candidateService.GetOrCreateAsync(GetUserId());
    }

    private async Task<CompanyProfileDto>
        GetCompanyProfileAsync()
    {
        return await _companyService.GetOrCreateAsync(GetUserId());
    }
}