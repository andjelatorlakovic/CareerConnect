using backend.Database;
using backend.Domain.Enums;
using Domain.DTOs.JobApplication;
using Domain.Enums;
using Domain.Models;
using Domain.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using backend.Hubs;

namespace backend.Services;

public class JobApplicationService : IJobApplicationService
{
    private readonly AppDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly IQuizService _quizService;
    private readonly IHubContext<RealtimeHub> _hubContext;

    public JobApplicationService(
        AppDbContext context,
        INotificationService notificationService,
        IQuizService quizService,
        IHubContext<RealtimeHub> hubContext)
    {
        _context = context;
        _notificationService = notificationService;
        _quizService = quizService;
        _hubContext = hubContext;
    }
    //Apliciranje za posao, prijava na oglas
    public async Task<JobApplicationDto> ApplyJobApplicationAsync(Guid candidateProfileId, Guid jobListingId, CreateJobApplicationRequest request)
    {
        var job = await _context.JobListings
            .FirstOrDefaultAsync(j =>
                j.Id == jobListingId &&
                j.ExpiresAt > DateTime.UtcNow);

        if (job == null)
        {
            throw new InvalidOperationException("Job listing not found.");
        }
        var alreadyApplied = await _context.JobApplications.AnyAsync(a=> a.CandidateProfileId==candidateProfileId && a.JobListingId==jobListingId);
        if (alreadyApplied)
        {
            throw new InvalidOperationException("You already applied for this job.");
        }

        var questions = await _quizService.GetQuestionsAsync(jobListingId);
        var answeredQuestionIds = request.Answers
            .Where(answer => !string.IsNullOrWhiteSpace(answer.Answer))
            .Select(answer => answer.QuestionId)
            .ToHashSet();

        if (questions.Any(question => !answeredQuestionIds.Contains(question.Id)))
        {
            throw new InvalidOperationException(
                "Please answer all company questions before submitting your application.");
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
        if (request.Answers.Any())
        {
            await _quizService.SaveAnswersAsync(application.Id, request.Answers);
}
        var applicationDto = MapToDto(application);
        var company = await _context.CompanyProfiles
            .FirstOrDefaultAsync(profile =>
                profile.Id == job.CompanyProfileId);

        if (company != null)
        {
            await _notificationService.CreateAsync(
                company.UserId,
                $"Stigla je nova prijava za oglas: {job.Title}."
            );

            await _hubContext.Clients.User(company.UserId.ToString())
                .SendAsync("ApplicationCreated", applicationDto);
        }

        return applicationDto;
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

        var candidateProfile = await _context.CandidateProfiles
            .FirstOrDefaultAsync(profile =>
                profile.Id == application.CandidateProfileId);
        var job = await _context.JobListings
            .FirstOrDefaultAsync(listing =>
                listing.Id == application.JobListingId);

        if (candidateProfile != null && job != null)
        {
            var statusText = request.Status switch
            {
                ApplicationStatus.Accepted => "prihvaćena",
                ApplicationStatus.Rejected => "odbijena",
                ApplicationStatus.Reviewed => "pregledana",
                _ => "ažurirana"
            };

            await _notificationService.CreateAsync(
                candidateProfile.UserId,
                $"Vaša prijava za oglas „{job.Title}” je {statusText}.",
                job.Id
            );

            await _hubContext.Clients.User(candidateProfile.UserId.ToString())
                .SendAsync("ApplicationStatusChanged", MapToDto(application));
        }
        await _context.SaveChangesAsync();

        return MapToDto(application);
    }
}
