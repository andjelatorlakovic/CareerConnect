using backend.Database;
using backend.Domain.Enums;
using Domain.DTOs.JobApplication;
using Domain.Enums;
using Domain.Models;
using Domain.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class JobApplicationService : IJobApplicationService
{
    private AppDbContext _context;

    public JobApplicationService(AppDbContext context)
    {
        _context=context;
    }

    //Apliciranje za posao, prijava na oglas
    public async Task<JobApplicationDto> ApplyJobApplicationAsync(Guid candidateProfileId, Guid jobListingId, CreateJobApplicationRequest request)
    {
        var jobExists = await _context.JobListings.AnyAsync(j=> j.Id== jobListingId&& j.ExpiresAt>DateTime.UtcNow);
        if (!jobExists)
        {
            throw new InvalidOperationException("Job listing not found.");
        }
        var alreadyApplied = await _context.JobApplications.AnyAsync(a=> a.CandidateProfileId==candidateProfileId && a.JobListingId==jobListingId);
        if (!alreadyApplied)
        {
            throw new InvalidOperationException("You already applied for this job.");
        }
        var application = new JobApplication
        {
            CandidateProfileId=candidateProfileId,
            JobListingId=jobListingId,
            CoverLetter=request.CoverLetter,
            Status=ApplicationStatus.Pending,
            AppliedAt=DateTime.UtcNow
        };
        _context.JobApplications.Add(application);
        await _context.SaveChangesAsync();
        return MapToDto(application);
    }
    private static JobApplicationDto MapToDto(
            JobApplication application)
        {
            return new JobApplicationDto
            {
                Id = application.Id,
                CandidateProfileId = application.CandidateProfileId,
                JobListingId = application.JobListingId,
                CoverLetter = application.CoverLetter,
                Status = application.Status,
                AppliedAt = application.AppliedAt
            };
        }
    //Vraca sve prijave za neki oglas
    public async Task<List<JobApplicationDto>> GetByJobAsync(Guid companyProfileId, Guid jobId)
    {
        //Da li posao pripada kompaniji
        var jobBelongs= await _context.JobListings.AnyAsync(j=> j.Id==jobId && j.CompanyProfileId==companyProfileId);
        if (!jobBelongs)
        {
            throw new InvalidOperationException("Job not found or dont belongs to your company.");
        }
        var applications = await _context.JobApplications
            .Where(application => application.JobListingId == jobId)
            .OrderByDescending(application => application.AppliedAt)
            .ToListAsync();

        return applications.Select(MapToDto).ToList();
    }

    public async Task<List<JobApplicationDto>> GetMyApplicationsAsync(Guid candidateProfileId)
    {
       var applications = await _context.JobApplications
            .Where(application =>
                application.CandidateProfileId == candidateProfileId)
            .OrderByDescending(application => application.AppliedAt)
            .ToListAsync();

        return applications.Select(MapToDto).ToList();
    }

    
    public async Task<JobApplicationDto> UpdateStatusAsync(
        Guid companyProfileId,
        Guid applicationId,
        UpdateJobApplicationRequest request)
    {
        var application = await _context.JobApplications
            .FirstOrDefaultAsync(application =>
                application.Id == applicationId);

        if (application == null)
        {
            throw new InvalidOperationException("Prijava nije pronađena.");
        }

        var jobBelongsToCompany = await _context.JobListings.AnyAsync(job =>
            job.Id == application.JobListingId &&
            job.CompanyProfileId == companyProfileId
        );

        if (!jobBelongsToCompany)
        {
            throw new InvalidOperationException(
                "Nemate dozvolu za izmenu ove prijave."
            );
        }

        application.Status = request.Status;

        await _context.SaveChangesAsync();

        return MapToDto(application);
    }
}