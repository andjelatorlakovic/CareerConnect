using Domain.DTOs.Matching;

namespace Domain.Services;
public interface IMatchingService
{
    Task<List<MatchResultDto>> GetMatchingJobsAsync(Guid candidateProfileId);
}