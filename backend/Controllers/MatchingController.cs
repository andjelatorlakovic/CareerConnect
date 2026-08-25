using System.Security.Claims;
using backend.Domain.DTOs.CandidateProfile;
using backend.Domain.Services;
using Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/matching")]
[Authorize(Roles = "Candidate")]
public class MatchingController : ControllerBase
{
    private readonly IMatchingService _matchingService;
    private readonly ICandidateService _candidateService;

    public MatchingController(
        IMatchingService matchingService,
        ICandidateService candidateService)
    {
        _matchingService = matchingService;
        _candidateService = candidateService;
    }

    [HttpGet("jobs")]
    public async Task<IActionResult> GetMatchingJobs()
    {
        var candidateProfile = await GetCandidateProfileAsync();

        var matchingJobs = await _matchingService.GetMatchingJobsAsync(
            candidateProfile.Id
        );

        return Ok(matchingJobs);
    }

    private async Task<CandidateProfileDto> GetCandidateProfileAsync()
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

        return await _candidateService.GetOrCreateAsync(userId);
    }
}