using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class ReviewNextScreens : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AddColumn<int>(
                name: "NextScreenId",
                table: "Review",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NextVersionId",
                table: "Review",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NextScreenId",
                table: "Screens");

            migrationBuilder.DropColumn(
                name: "NextVersionId",
                table: "Screens");

            migrationBuilder.DropColumn(
                name: "NextScreenId",
                table: "Review");

            migrationBuilder.DropColumn(
                name: "NextVersionId",
                table: "Review");
        }
    }
}
