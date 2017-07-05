using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class NewMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "Images",
                newName: "UpRating");

            migrationBuilder.AddColumn<int>(
                name: "DownRating",
                table: "Images",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DownRating",
                table: "Images");

            migrationBuilder.RenameColumn(
                name: "UpRating",
                table: "Images",
                newName: "Rating");
        }
    }
}
