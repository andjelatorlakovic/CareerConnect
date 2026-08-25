namespace backend.Services;

using System;
using System.Threading.Tasks;
using backend.Database;
using backend.Domain.DTOs.CandidateProfile;
using backend.Domain.Services;
using Microsoft.EntityFrameworkCore;
using backend.Domain.Models;
using backend.Domain.Enums;

public class CandidateService : ICandidateService
{
    private readonly AppDbContext _context;
    public CandidateService(AppDbContext context)
    {
        _context = context;
    }
    public async Task<EducationDto> AddEducationAsync(Guid userId, AddEducationRequest request)
    {
        var profile = await _context.CandidateProfiles.FirstOrDefaultAsync(p => p.UserId == userId)?? throw new InvalidOperationException("Candidate profile not found.");
        var education = new Education
        {
            Id = Guid.NewGuid(),
            Institution = request.Institution,
            Degree = request.Degree,
            FieldOfStudy = request.FieldOfStudy,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };
        _context.Educations.Add(education);
        await _context.SaveChangesAsync();
        return new EducationDto
        {
            Id = education.Id,
            Institution = education.Institution,
            Degree = education.Degree,
            FieldOfStudy = education.FieldOfStudy,
            StartDate = education.StartDate,
            EndDate = education.EndDate 
        };  
    }

    public  async Task<WorkExperienceDto> AddWorkExperienceAsync(Guid userId, AddWorkExperienceRequest request)
    {
        var profile = await _context.CandidateProfiles.FirstOrDefaultAsync(p => p.UserId == userId) ?? throw new InvalidOperationException("Candidate profile not found.");
        var experience = new WorkExperience
        {
            Id = Guid.NewGuid(),
            CompanyName = request.Company,
            Position = request.Position,
            Description = request.Description,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };
        _context.WorkExperiences.Add(experience);
        await _context.SaveChangesAsync();
        return new WorkExperienceDto
        {
            Id = experience.Id,
            Company = experience.CompanyName,           
            Position = experience.Position,
            Description = experience.Description,
            StartDate = experience.StartDate,
            EndDate = experience.EndDate
        };
    }

    public async Task<CandidateProfileDto> GetOrCreateAsync(Guid userId)
    {
        var profile = await _context.CandidateProfiles
            .Include(p => p.Skills)
            .Include(p => p.Education)
            .Include(p => p.WorkExperience)
            .Include(p => p.DesiredJobCategories)
            .FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                profile = new CandidateProfile
                {
                    UserId = userId,
                    Bio = string.Empty,
                    Location = string.Empty,
                    ExperienceLevel = ExperienceLevel.Student,
                    Skills = new List<CandidateSkill>(),
                    Education = new List<Education>(),
                    WorkExperience = new List<WorkExperience>(),
                    DesiredJobCategories = new List<CandidateDesiredJobCategory>()
                };
                _context.CandidateProfiles.Add(profile);
                await _context.SaveChangesAsync();
            }
            return MapToDto(profile);
    }

    public async Task<bool> RemoveEducationAsync(Guid userId, Guid educationId)
    {
        var profile = _context.CandidateProfiles.FirstOrDefault(p => p.UserId == userId) ?? throw new InvalidOperationException("Candidate profile not found.");
        var education = _context.Educations.FirstOrDefault(e => e.Id == educationId && e.CandidateProfileId == profile.Id);
        if (education == null)
        {
            return false;
        }
        _context.Educations.Remove(education);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveWorkExperienceAsync(Guid userId, Guid workExperienceId)
    {
        var profile = await _context.CandidateProfiles.FirstOrDefaultAsync(p => p.UserId == userId) ?? throw new InvalidOperationException("Candidate profile not found.");
        var experience = await _context.WorkExperiences.FirstOrDefaultAsync(w => w.Id == workExperienceId && w.CandidateProfileId == profile.Id);
        if (experience == null)
        {
            return false;
        }
        _context.WorkExperiences.Remove(experience);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<CandidateProfileDto> UpdateCandidateProfileAsync(Guid userId, UpdateCandidateProfileRequest request)
    {
        var profile = await _context.CandidateProfiles
            .Include(p => p.Skills)
            .Include(p => p.Education)
            .Include(p => p.WorkExperience)
            .Include(p => p.DesiredJobCategories)
            .FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new InvalidOperationException("Candidate profile not found.");
        profile.Bio = request.Bio;
        profile.Location = request.Location;
        profile.ExperienceLevel = request.ExperienceLevel;
        
        _context.CandidateSkills.RemoveRange(profile.Skills);
        profile.Skills = request.Skills.Distinct().Select(s => new CandidateSkill { 
            CandidateProfileId = profile.Id, 
            Skill  = s, 
        }).ToList();

        _context.CandidateDesiredJobCategories.RemoveRange(
            profile.DesiredJobCategories
        );

        profile.DesiredJobCategories = request.DesiredJobCategories
            .Distinct()
            .Select(category => new CandidateDesiredJobCategory
            {
                CandidateProfileId = profile.Id,
                JobCategory = category
            })
            .ToList();
        await _context.SaveChangesAsync();
        return MapToDto(profile);
        
    }
    private static CandidateProfileDto MapToDto(CandidateProfile profile) => new()
    {
        Id = profile.Id,
        UserId = profile.UserId,
        Bio = profile.Bio,
        Location = profile.Location,
        ExperienceLevel = profile.ExperienceLevel,
        Skills = profile.Skills.Select(s => s.Skill).ToList(),
        DesiredJobCategories = profile.DesiredJobCategories
            .Select(category => category.JobCategory)
            .ToList(),
        Education = profile.Education.Select(e => new EducationDto
        {
            Id = e.Id,
            Institution = e.Institution,
            Degree = e.Degree,
            FieldOfStudy = e.FieldOfStudy,
            StartDate = e.StartDate,
            EndDate = e.EndDate
        }).ToList(),
        WorkExperience= profile.WorkExperience.Select(w => new WorkExperienceDto
        {
            Id = w.Id,
            Company = w.CompanyName,
            Position = w.Position,
            Description = w.Description,
            StartDate = w.StartDate,
            EndDate = w.EndDate
        }).ToList()
    };
}
