using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class renameReviewStatusToScreenStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReviewStatus",
                table: "Screens");

            migrationBuilder.AddColumn<int>(
                name: "ScreenStatus",
                table: "Screens",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScreenStatus",
                table: "Screens");

            migrationBuilder.AddColumn<int>(
                name: "ReviewStatus",
                table: "Screens",
                nullable: false,
                defaultValue: 0);
        }
    }
}
