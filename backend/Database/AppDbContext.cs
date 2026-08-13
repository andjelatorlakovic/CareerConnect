using backend.Domain.Models;
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
    }
}