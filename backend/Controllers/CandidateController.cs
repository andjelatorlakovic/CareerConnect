namespace backend.Controllers;
using backend.Domain.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Domain.DTOs.CandidateProfile;
[ApiController]
[Route("api/candidate-profile")]
[Authorize(Roles = "Candidate")]
public class CandidateController : ControllerBase
{
    private readonly ICandidateService _candidateService;

    public CandidateController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }
    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = GetUserId();
        var profile = await _candidateService.GetOrCreateAsync(userId);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(profile);
    }
        
    [HttpPut]
    public async Task<IActionResult> Update(UpdateCandidateProfileRequest request)
    {
        var userId = GetUserId();
        var updatedProfile = await _candidateService.UpdateCandidateProfileAsync(userId, request);
        if (updatedProfile == null)
        {
            return NotFound();
        }
        return Ok(updatedProfile);
    }
    [HttpPost("education")]
    public async Task<IActionResult> AddEducation(AddEducationRequest request)
    {
        var userId = GetUserId();
        var addedEducation = await _candidateService.AddEducationAsync(userId, request);
        if (addedEducation == null)
        {
            return NotFound();
        }
        return Ok(addedEducation);
    }
    [HttpDelete("education/{educationId}")]
    public async Task<IActionResult> DeleteEducation(Guid educationId)
    {
        var userId = GetUserId();
        var deletedEducation = await _candidateService.RemoveEducationAsync(userId, educationId);
        if (deletedEducation == null)
        {
            return NotFound();
        }
        return Ok(deletedEducation);
    }
    [HttpPost("work-experience")]
    public async Task<IActionResult> AddWorkExperience(AddWorkExperienceRequest request)
    {
        var userId = GetUserId();
        var addedWorkExperience = await _candidateService.AddWorkExperienceAsync(userId, request);
        if (addedWorkExperience == null)
        {
            return NotFound();
        }
        return Ok(addedWorkExperience);
    }
    [HttpDelete("work-experience/{workExperienceId}")]
    public async Task<IActionResult> DeleteWorkExperience(Guid workExperienceId)
    {
        var userId = GetUserId();
        var deletedWorkExperience = await _candidateService.RemoveWorkExperienceAsync(userId, workExperienceId);
        if (deletedWorkExperience == null)  
        {
            return NotFound();
        }
        return Ok(deletedWorkExperience);
    }

}