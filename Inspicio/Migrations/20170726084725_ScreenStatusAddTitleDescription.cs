using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class ScreenStatusAddTitleDescription : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Review",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Review",
                maxLength: 150,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Review");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Review");
        }
    }
}
