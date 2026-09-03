namespace Domain.Services;
using Domain.DTOs.CompanyProfile;
public interface ICompanyService
{
    Task<CompanyProfileDto> GetOrCreateAsync(Guid userId);
    Task<CompanyProfileDto> UpdateCompanyProfileAsync(Guid userId, UpdateCompanyProfileDto profileDto);
    Task <bool> DeleteAsync(Guid companyProfileId);
}