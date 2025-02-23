using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _net_AGC.Migrations
{
    /// <inheritdoc />
    public partial class agetasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "age",
                table: "Contacts",
                newName: "Age");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Age",
                table: "Contacts",
                newName: "age");
        }
    }
}
