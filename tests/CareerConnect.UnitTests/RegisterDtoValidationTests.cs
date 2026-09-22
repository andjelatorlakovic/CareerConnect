using System.ComponentModel.DataAnnotations;
using backend.Domain.DTOs;
using backend.Domain.Enums;

namespace CareerConnect.UnitTests;

public class RegisterDtoValidationTests
{
    [Fact]
    public void Validation_ReturnsError_WhenEmailIsEmpty()
    {
        var request = CreateValidRequest();
        request.Email = string.Empty;

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(nameof(RegisterDto.Email)));
    }

    [Fact]
    public void Validation_ReturnsError_WhenEmailFormatIsInvalid()
    {
        var request = CreateValidRequest();
        request.Email = "ana-mail";

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(nameof(RegisterDto.Email)));
    }

    [Fact]
    public void Validation_ReturnsError_WhenPasswordIsTooShort()
    {
        var request = CreateValidRequest();
        request.Password = "12345";

        var errors = Validate(request);

        Assert.Contains(
            errors,
            error => error.MemberNames.Contains(nameof(RegisterDto.Password)));
    }

    [Fact]
    public void Validation_ReturnsNoErrors_WhenRequestIsValid()
    {
        var request = CreateValidRequest();

        var errors = Validate(request);

        Assert.Empty(errors);
    }

    private static RegisterDto CreateValidRequest()
    {
        return new RegisterDto
        {
            FirstName = "Ana",
            LastName = "Anic",
            Email = "ana@example.com",
            Password = "password123",
            Role = UserRole.Candidate
        };
    }

    private static List<ValidationResult> Validate(RegisterDto request)
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