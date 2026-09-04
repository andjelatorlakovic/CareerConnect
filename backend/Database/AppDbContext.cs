using backend.Domain.Models;
using CareerConnect.Domain.Models;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<CandidateProfile> CandidateProfiles
        => Set<CandidateProfile>();

    public DbSet<Education> Educations
        => Set<Education>();

    public DbSet<WorkExperience> WorkExperiences
        => Set<WorkExperience>();

    public DbSet<CandidateSkill> CandidateSkills
        => Set<CandidateSkill>();
    public DbSet<CandidateDesiredJobCategory> CandidateDesiredJobCategories
        => Set<CandidateDesiredJobCategory>();
    public DbSet<CompanyProfile> CompanyProfiles
        => Set<CompanyProfile>();   
    public DbSet<JobListing>JobListings
        =>Set<JobListing>();
    public DbSet<JobSkill>JobSkills
        =>Set<JobSkill>();
    public DbSet<JobApplication> JobApplications
        =>Set<JobApplication>();
    public DbSet<Notification> Notifications
        =>Set<Notification>();
    public DbSet<JobListingQuestion> JobListingQuestions
        => Set<JobListingQuestion>();
    public DbSet<QuizAnswer> QuizAnswers
        => Set<QuizAnswer>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // USER
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();


        // CANDIDATE PROFILE -> EDUCATION
        modelBuilder.Entity<CandidateProfile>()
            .HasMany(p => p.Education)
            .WithOne()
            .HasForeignKey(e => e.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);


        // CANDIDATE PROFILE -> WORK EXPERIENCE
        modelBuilder.Entity<CandidateProfile>()
            .HasMany(p => p.WorkExperience)
            .WithOne()
            .HasForeignKey(w => w.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);


        // CANDIDATE PROFILE -> SKILLS
        modelBuilder.Entity<CandidateProfile>()
            .HasMany(p => p.Skills)
            .WithOne()
            .HasForeignKey(s => s.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);


        // COMPOSITE PRIMARY KEY
        modelBuilder.Entity<CandidateSkill>()
            .HasKey(s => new
            {
                s.CandidateProfileId,
                s.Skill
            });

        modelBuilder.Entity<CandidateProfile>()
            .HasMany(p => p.DesiredJobCategories)
            .WithOne()
            .HasForeignKey(c => c.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CandidateDesiredJobCategory>()
            .HasKey(c => new
            {
                c.CandidateProfileId,
                c.JobCategory
            });
        modelBuilder.Entity<CompanyProfile>()
            .HasIndex(c => c.UserId)
            .IsUnique();
        modelBuilder.Entity<JobSkill>()
            .HasKey(s=> new {s.JobListingId, s.Skill});
        modelBuilder.Entity<JobListing>()
            .HasMany(j=> j.JobSkills)
            .WithOne()
            .HasForeignKey(s=>s.JobListingId)
            .OnDelete(DeleteBehavior.Cascade);
        //JobApplication part
        modelBuilder.Entity<JobApplication>()
        .HasIndex(a => new
        {
            a.CandidateProfileId,
            a.JobListingId
        })
        .IsUnique();

        modelBuilder.Entity<JobApplication>()
            .HasOne<CandidateProfile>()
            .WithMany()
            .HasForeignKey(a => a.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JobApplication>()
            .HasOne<JobListing>()
            .WithMany()
            .HasForeignKey(a => a.JobListingId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Notification>()
            .HasOne<backend.Domain.Models.User>()
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<JobListingQuestion>()
            .HasOne<JobListing>()
            .WithMany()
            .HasForeignKey(q => q.JobListingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<QuizAnswer>()
            .HasOne<JobApplication>()
            .WithMany()
            .HasForeignKey(a => a.JobApplicationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
