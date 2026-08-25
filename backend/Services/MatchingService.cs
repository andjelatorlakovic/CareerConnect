using backend.Database;
using backend.Domain.Enums;
using Domain.DTOs.Matching;
using Domain.Models;
using Domain.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class MatchingService : IMatchingService
{
    private readonly AppDbContext _context;

    public MatchingService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<MatchResultDto>> GetMatchingJobsAsync(
        Guid candidateProfileId)
    {
        var candidateProfile = await _context.CandidateProfiles
            .Include(profile => profile.Skills)
            .Include(profile => profile.DesiredJobCategories)
            .FirstOrDefaultAsync(profile =>
                profile.Id == candidateProfileId);

        if (candidateProfile == null)
        {
            throw new InvalidOperationException(
                "Profil kandidata nije pronađen."
            );
        }

        var candidateSkills = candidateProfile.Skills
            .Select(skill => skill.Skill)
            .ToHashSet();

        var desiredCategories = candidateProfile.DesiredJobCategories
            .Select(category => category.JobCategory)
            .ToHashSet();

        var activeJobs = await _context.JobListings
            .Include(job => job.JobSkills)
            .Where(job =>
                job.Status == JobStatus.Active &&
                job.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();

        var matchingJobs = activeJobs
            .Where(job =>
                desiredCategories.Contains(job.JobCategory))
            .Select(job => CreateMatchResult(job, candidateSkills))
            .Where(match => match.MatchPercentage > 0)
            .OrderByDescending(match => match.MatchPercentage)
            .ToList();

        return matchingJobs;
    }

    private static MatchResultDto CreateMatchResult(
        JobListing job,
        HashSet<Skill> candidateSkills)
    {
        var requiredSkills = job.JobSkills
            .Select(jobSkill => jobSkill.Skill)
            .ToList();

        var matchedSkills = requiredSkills
            .Where(skill => candidateSkills.Contains(skill))
            .ToList();

        var missingSkills = requiredSkills
            .Where(skill => !candidateSkills.Contains(skill))
            .ToList();

        decimal matchPercentage = 0;

        if (requiredSkills.Any())
        {
            matchPercentage = Math.Round(
                (decimal)matchedSkills.Count / requiredSkills.Count * 100,
                2
            );
        }

        return new MatchResultDto
        {
            JobId = job.Id,
            Tittle = job.Title,
            Location = job.Location,
            jobCategory = job.JobCategory,
            RequiredSkills = requiredSkills,
            MatchedSkills = matchedSkills,
            MissingSkills = missingSkills,
            MatchPercentage = matchPercentage
        };
    }
}