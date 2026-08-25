using Domain.Enums;

namespace Domain.DTOs.JobApplication;
public class UpdateJobApplicationRequest
{
    public ApplicationStatus Status {get; set;}
}