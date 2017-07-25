using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class ReMappedState : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NextScreenId",
                table: "Screens");

            migrationBuilder.DropColumn(
                name: "NextVersionId",
                table: "Screens");

            migrationBuilder.AddColumn<int>(
                name: "ReviewStatus",
                table: "Review",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReviewStatus",
                table: "Review");

            migrationBuilder.AddColumn<int>(
                name: "NextScreenId",
                table: "Screens",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NextVersionId",
                table: "Screens",
                nullable: false,
                defaultValue: 0);
        }
    }
}
