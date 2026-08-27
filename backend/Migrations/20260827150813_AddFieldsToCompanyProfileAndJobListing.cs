using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldsToCompanyProfileAndJobListing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EmploymentType",
                table: "JobListings",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "SalaryMax",
                table: "JobListings",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SalaryMin",
                table: "JobListings",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "CompanyProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "CompanyProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmploymentType",
                table: "JobListings");

            migrationBuilder.DropColumn(
                name: "SalaryMax",
                table: "JobListings");

            migrationBuilder.DropColumn(
                name: "SalaryMin",
                table: "JobListings");

            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "CompanyProfiles");

            migrationBuilder.DropColumn(
                name: "ContactPhone",
                table: "CompanyProfiles");
        }
    }
}
