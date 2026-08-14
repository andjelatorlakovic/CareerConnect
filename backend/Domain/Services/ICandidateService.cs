namespace backend.Domain.Services;
using backend.Domain.DTOs.CandidateProfile;
public interface ICandidateService
{
    Task<CandidateProfileDto> GetOrCreateAsync(Guid userId);
    Task<CandidateProfileDto> UpdateCandidateProfileAsync(Guid userId, UpdateCandidateProfileRequest request);
    Task<WorkExperienceDto> AddWorkExperienceAsync(Guid userId, AddWorkExperienceRequest request);
    Task<bool> RemoveWorkExperienceAsync(Guid userId, Guid workExperienceId);
    Task<EducationDto> AddEducationAsync(Guid userId, AddEducationRequest request);
    Task<bool> RemoveEducationAsync(Guid userId, Guid educationId);
}