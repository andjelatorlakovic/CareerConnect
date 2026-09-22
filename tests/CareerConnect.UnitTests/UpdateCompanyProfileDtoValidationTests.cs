using System.ComponentModel.DataAnnotations;
using Domain.DTOs.CompanyProfile;

namespace CareerConnect.UnitTests;

public class UpdateCompanyProfileDtoValidationTests
{
    [Fact]
    public void Validation_ReturnsNoErrors_WhenWebsiteIsEmpty()
    {
        var request = CreateValidRequest();
        request.Website = null;

        var errors = Validate(request);

        Assert.Empty(errors);
    }

    [Fact]
    public void Validation_ReturnsWebsiteError_WhenWebsiteFormatIsInvalid()
    {
        var request = CreateValidRequest();
        request.Website = "nije-validan-url";

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(
                nameof(UpdateCompanyProfileDto.Website)));
    }

    [Fact]
    public void Validation_ReturnsNameError_WhenNameIsEmpty()
    {
        var request = CreateValidRequest();
        request.Name = string.Empty;

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(
                nameof(UpdateCompanyProfileDto.Name)));
    }

    [Fact]
    public void Validation_ReturnsNoErrors_WhenCompanyProfileIsValid()
    {
        var request = CreateValidRequest();

        var errors = Validate(request);

        Assert.Empty(errors);
    }

    private static UpdateCompanyProfileDto CreateValidRequest()
    {
        return new UpdateCompanyProfileDto
        {
            Name = "CareerConnect",
            Description =
                "A company profile with a sufficiently long description.",
            Location = "Novi Sad",
            Website = "https://careerconnect.com",
            Industry = "Software",
            ContactEmail = "contact@careerconnect.com",
            ContactPhone = "+381601234567"
        };
    }

    private static List<ValidationResult> Validate(
        UpdateCompanyProfileDto request)
    {
        var validationContext = new ValidationContext(request);
        var errors = new List<ValidationResult>();

        Validator.TryValidateObject(
            request,
            validationContext,
            errors,
            validateAllProperties: true);

        return errors;
    }
}