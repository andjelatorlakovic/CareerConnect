using System.ComponentModel.DataAnnotations;
using backend.Domain.Enums;
using Domain.DTOs.JobListing;
using Domain.Enums;

namespace CareerConnect.UnitTests;

public class CreateJobListingRequestValidationTests
{
    [Fact]
    public void Validation_ReturnsTitleError_WhenTitleIsEmpty()
    {
        var request = CreateValidRequest();
        request.Title = string.Empty;

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(
                nameof(CreateJobListingRequest.Title)));
    }

    [Fact]
    public void Validation_ReturnsDescriptionError_WhenDescriptionIsTooShort()
    {
        var request = CreateValidRequest();
        request.Description = "Short text";

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(
                nameof(CreateJobListingRequest.Description)));
    }

    [Fact]
    public void Validation_ReturnsSkillsError_WhenNoSkillIsSelected()
    {
        var request = CreateValidRequest();
        request.Skills = [];

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(
                nameof(CreateJobListingRequest.Skills)));
    }

    [Fact]
    public void Validation_ReturnsSalaryError_WhenSalaryIsNegative()
    {
        var request = CreateValidRequest();
        request.SalaryMin = -1;

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(
                nameof(CreateJobListingRequest.SalaryMin)));
    }

    [Fact]
    public void Validation_ReturnsNoErrors_WhenJobRequestIsValid()
    {
        var request = CreateValidRequest();

        var errors = Validate(request);

        Assert.Empty(errors);
    }

    private static CreateJobListingRequest CreateValidRequest()
    {
        return new CreateJobListingRequest
        {
            Title = "Backend Developer",
            Description =
                "We are looking for a backend developer with C# experience.",
            Location = "Novi Sad",
            ExperienceLevel = ExperienceLevel.MidLevel,
            JobCategory = JobCategory.SoftwareDevelopment,
            EmploymentType = EmploymentType.FullTime,
            ExpiresAt = DateTime.UtcNow.AddDays(14),
            Skills = [Skill.CSharp],
            SalaryMin = 1000,
            SalaryMax = 2000
        };
    }

    private static List<ValidationResult> Validate(
        CreateJobListingRequest request)
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