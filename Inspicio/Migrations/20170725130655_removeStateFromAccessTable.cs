using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class removeStateFromAccessTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScreenState",
                table: "Review");

            migrationBuilder.DropColumn(
                name: "State",
                table: "AccessTable");

            migrationBuilder.AddColumn<int>(
                name: "ReviewState",
                table: "Review",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReviewState",
                table: "Review");

            migrationBuilder.AddColumn<int>(
                name: "ScreenState",
                table: "Review",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "State",
                table: "AccessTable",
                nullable: false,
                defaultValue: 0);
        }
    }
}
