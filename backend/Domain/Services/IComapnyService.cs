namespace Domain.Services;
using Domain.DTOs.CompanyProfile;
public interface IcompanyService
{
    Task<CompanyProfileDto> GetOrCreateAsync(Guid userId);
    Task<CompanyProfileDto> UpdateCompanyProfileAsync(Guid userId, UpdateCompanyProfileDto profileDto);
}