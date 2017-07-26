using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class UserToReviewModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "Review",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Review_CreatorId",
                table: "Review",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Review_AspNetUsers_CreatorId",
                table: "Review",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Review_AspNetUsers_CreatorId",
                table: "Review");

            migrationBuilder.DropIndex(
                name: "IX_Review_CreatorId",
                table: "Review");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Review");
        }
    }
}
