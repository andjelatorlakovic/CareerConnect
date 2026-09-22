using System.Security.Claims;
using backend.Controllers;
using Domain.Dto.Quiz;
using Domain.DTOs.CompanyProfile;
using Domain.Models.Quiz;
using Domain.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace CareerConnect.UnitTests;

public class QuizControllerTests
{
    [Fact]
    public async Task GetQuestions_ReturnsQuestionsForJob()
    {
        var quizService = new Mock<IQuizService>();
        var companyService = new Mock<ICompanyService>();
        var jobId = Guid.NewGuid();

        var expectedQuestions = new List<JobListingQuestionDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                QuestionText = "Do you have experience with C#?",
                OrderIndex = 1
            }
        };

        quizService
            .Setup(service => service.GetQuestionsAsync(jobId))
            .ReturnsAsync(expectedQuestions);

        var controller = new QuizController(
            quizService.Object,
            companyService.Object);

        var result = await controller.GetQuestions(jobId);

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedQuestions, okResult.Value);
    }

    [Fact]
    public async Task AddQuestion_ReturnsOk_AndUsesCurrentCompanyProfile()
    {
        var userId = Guid.NewGuid();
        var companyProfileId = Guid.NewGuid();
        var jobId = Guid.NewGuid();

        var quizService = new Mock<IQuizService>();
        var companyService = new Mock<ICompanyService>();

        companyService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(new CompanyProfileDto
            {
                Id = companyProfileId
            });

        var request = new AddQuestionRequest
        {
            QuestionText = "Do you have experience with C#?",
            OrderIndex = 1
        };

        var expectedQuestion = new JobListingQuestionDto
        {
            Id = Guid.NewGuid(),
            QuestionText = request.QuestionText,
            OrderIndex = request.OrderIndex
        };

        quizService
            .Setup(service => service.AddQuestionAsync(
                companyProfileId,
                jobId,
                request))
            .ReturnsAsync(expectedQuestion);

        var controller = CreateController(
            quizService.Object,
            companyService.Object,
            userId);

        var result = await controller.AddQuestion(jobId, request);

        var okResult = Assert.IsType<OkObjectResult>(result);

        Assert.Same(expectedQuestion, okResult.Value);
    }

    [Fact]
    public async Task RemoveQuestion_ReturnsNotFound_WhenQuestionDoesNotExist()
    {
        var userId = Guid.NewGuid();
        var companyProfileId = Guid.NewGuid();
        var jobId = Guid.NewGuid();
        var questionId = Guid.NewGuid();

        var quizService = new Mock<IQuizService>();
        var companyService = new Mock<ICompanyService>();

        companyService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(new CompanyProfileDto
            {
                Id = companyProfileId
            });

        quizService
            .Setup(service => service.RemoveQuestionAsync(
                companyProfileId,
                jobId,
                questionId))
            .ReturnsAsync(false);

        var controller = CreateController(
            quizService.Object,
            companyService.Object,
            userId);

        var result = await controller.RemoveQuestion(
            jobId,
            questionId);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetAnswers_ReturnsBadRequest_WhenCompanyCannotAccessApplication()
    {
        var userId = Guid.NewGuid();
        var companyProfileId = Guid.NewGuid();
        var applicationId = Guid.NewGuid();

        var quizService = new Mock<IQuizService>();
        var companyService = new Mock<ICompanyService>();

        companyService
            .Setup(service => service.GetOrCreateAsync(userId))
            .ReturnsAsync(new CompanyProfileDto
            {
                Id = companyProfileId
            });

        quizService
            .Setup(service => service.GetAnswersForApplicationAsync(
                companyProfileId,
                applicationId))
            .ThrowsAsync(
                new InvalidOperationException(
                    "Nemate dozvolu za pregled ove prijave."));

        var controller = CreateController(
            quizService.Object,
            companyService.Object,
            userId);

        var result = await controller.GetAnswers(applicationId);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    private static QuizController CreateController(
        IQuizService quizService,
        ICompanyService companyService,
        Guid userId)
    {
        var controller = new QuizController(
            quizService,
            companyService);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(
                    new ClaimsIdentity(
                    [
                        new Claim(
                            ClaimTypes.NameIdentifier,
                            userId.ToString())
                    ],
                    "TestAuthentication"))
            }
        };

        return controller;
    }
}