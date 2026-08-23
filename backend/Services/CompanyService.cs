using backend.Database;
using Domain.DTOs.CompanyProfile;
using Domain.Models;
using Domain.Services;

namespace backend.Services;
public class CompanyService: ICompanyService
{
    private readonly AppDbContext _context;
    public CompanyService(AppDbContext context)
    {
        _context = context;
    }
    public Task<CompanyProfileDto> GetOrCreateAsync(Guid userId)
    {
        var profile = _context.CompanyProfiles.FirstOrDefault(p => p.UserId == userId);
        if(profile == null)
        {
            profile = new CompanyProfile
            {
                UserId = userId,
                Name = string.Empty,
                Description = string.Empty,
                Location = string.Empty,
                Website = string.Empty,
                Industry = string.Empty
            };
            _context.CompanyProfiles.Add(profile);
            _context.SaveChangesAsync();
        }
        return MapToDto(profile);
    }

    public Task<CompanyProfileDto> UpdateCompanyProfileAsync(Guid userId, UpdateCompanyProfileDto profileDto)
    {
        var profile = _context.CompanyProfiles.FirstOrDefault(p => p.UserId == userId) 
            ?? throw new Exception("Company profile not found.");
        
        profile.Name = profileDto.Name;
        profile.Description = profileDto.Description;
        profile.Location = profileDto.Location;
        profile.Website = profileDto.Website;
        profile.Industry = profileDto.Industry;

        _context.SaveChangesAsync();
        return MapToDto(profile);
    }
    private Task<CompanyProfileDto> MapToDto(CompanyProfile profile)
    {
        var dto = new CompanyProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            Name = profile.Name,
            Description = profile.Description,
            Location = profile.Location,
            Website = profile.Website,
            Industry = profile.Industry
        };
        return Task.FromResult(dto);
    }
}