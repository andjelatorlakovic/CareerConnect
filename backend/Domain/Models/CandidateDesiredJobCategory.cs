using Domain.Enums;

namespace backend.Domain.Models;

public class CandidateDesiredJobCategory
{
    public Guid CandidateProfileId { get; set; }

    public JobCategory JobCategory { get; set; }
}
