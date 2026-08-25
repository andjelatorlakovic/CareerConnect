using Domain.DTOs.JobApplication;

namespace Domain.Services;
public interface IJobApplicationService
{
    Task <JobApplicationDto> ApplyJobApplicationAsync(Guid candidateProfileId, Guid jobListingIg, CreateJobApplicationRequest request);
    Task <JobApplicationDto> UodateJobApplicationStatusAsync(Guid candidateProfileId, Guid jobListingIg, UpdateJobApplicationRequest request);
    Task <JobApplicationDto> GetMyApplicationsAsync(Guid candidateProfileId);
    Task<List<JobApplicationDto>> GetByJobAsync( Guid companyProfileId, Guid jobId);
}