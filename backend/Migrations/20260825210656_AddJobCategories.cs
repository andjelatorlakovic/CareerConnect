using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddJobCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "JobCategory",
                table: "JobListings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "CandidateDesiredJobCategories",
                columns: table => new
                {
                    CandidateProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    JobCategory = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CandidateDesiredJobCategories", x => new { x.CandidateProfileId, x.JobCategory });
                    table.ForeignKey(
                        name: "FK_CandidateDesiredJobCategories_CandidateProfiles_CandidatePr~",
                        column: x => x.CandidateProfileId,
                        principalTable: "CandidateProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CandidateDesiredJobCategories");

            migrationBuilder.DropColumn(
                name: "JobCategory",
                table: "JobListings");
        }
    }
}
