using System.ComponentModel.DataAnnotations;
using backend.Domain.DTOs.CandidateProfile;
using backend.Domain.Enums;
using Domain.Enums;

namespace CareerConnect.UnitTests;

public class UpdateCandidateProfileRequestValidationTests
{
    [Fact]
    public void Validation_ReturnsBioError_WhenBioIsTooShort()
    {
        var request = CreateValidRequest();
        request.Bio = "Short bio";

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(
                nameof(UpdateCandidateProfileRequest.Bio)));
    }

    [Fact]
    public void Validation_ReturnsLocationError_WhenLocationIsEmpty()
    {
        var request = CreateValidRequest();
        request.Location = string.Empty;

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(
                nameof(UpdateCandidateProfileRequest.Location)));
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
                nameof(UpdateCandidateProfileRequest.Skills)));
    }

    [Fact]
    public void Validation_ReturnsCategoryError_WhenNoDesiredCategoryIsSelected()
    {
        var request = CreateValidRequest();
        request.DesiredJobCategories = [];

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(
                nameof(UpdateCandidateProfileRequest.DesiredJobCategories)));
    }

    [Fact]
    public void Validation_ReturnsNoErrors_WhenCandidateProfileIsValid()
    {
        var request = CreateValidRequest();

        var errors = Validate(request);

        Assert.Empty(errors);
    }

    private static UpdateCandidateProfileRequest CreateValidRequest()
    {
        return new UpdateCandidateProfileRequest
        {
            Bio =
                "I am a software developer interested in backend development.",
            Location = "Novi Sad",
            ExperienceLevel = ExperienceLevel.Junior,
            Skills = [Skill.CSharp],
            DesiredJobCategories =
                [JobCategory.SoftwareDevelopment]
        };
    }

    private static List<ValidationResult> Validate(
        UpdateCandidateProfileRequest request)
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