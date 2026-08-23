namespace Domain.Models;
public class CompanyProfile
{
    public Guid Id { get; set; } = new Guid();
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;

    public CompanyProfile(Guid userId, string name, string description, string location, string website, string industry)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Name = name;
        Description = description;
        Location = location;
        Website = website;
        Industry = industry;
    }
    public CompanyProfile()
    {
       
    }
}