using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class ReviewIdToScreenFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Screens_ReviewId",
                table: "Screens",
                column: "ReviewId");

            migrationBuilder.AddForeignKey(
                name: "FK_Screens_Review_ReviewId",
                table: "Screens",
                column: "ReviewId",
                principalTable: "Review",
                principalColumn: "ReviewId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Screens_Review_ReviewId",
                table: "Screens");

            migrationBuilder.DropIndex(
                name: "IX_Screens_ReviewId",
                table: "Screens");
        }
    }
}
