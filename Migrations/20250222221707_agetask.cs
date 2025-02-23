using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _net_AGC.Migrations
{
    /// <inheritdoc />
    public partial class agetask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "age",
                table: "Contacts",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "age",
                table: "Contacts");
        }
    }
}
