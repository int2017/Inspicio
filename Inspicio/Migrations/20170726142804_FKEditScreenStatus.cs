using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class FKEditScreenStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ScreenStatus_Review_ScreenId",
                table: "ScreenStatus");

            migrationBuilder.AddForeignKey(
                name: "FK_ScreenStatus_Screens_ScreenId",
                table: "ScreenStatus",
                column: "ScreenId",
                principalTable: "Screens",
                principalColumn: "ScreenId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ScreenStatus_Screens_ScreenId",
                table: "ScreenStatus");

            migrationBuilder.AddForeignKey(
                name: "FK_ScreenStatus_Review_ScreenId",
                table: "ScreenStatus",
                column: "ScreenId",
                principalTable: "Review",
                principalColumn: "ReviewId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
