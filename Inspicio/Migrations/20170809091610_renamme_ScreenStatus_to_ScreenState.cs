using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class renamme_ScreenStatus_to_ScreenState : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScreenStatus",
                table: "Screens");

            migrationBuilder.AddColumn<int>(
                name: "ScreenState",
                table: "Screens",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScreenState",
                table: "Screens");

            migrationBuilder.AddColumn<int>(
                name: "ScreenStatus",
                table: "Screens",
                nullable: false,
                defaultValue: 0);
        }
    }
}
