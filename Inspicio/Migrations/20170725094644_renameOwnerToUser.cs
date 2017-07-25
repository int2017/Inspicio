using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class renameOwnerToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Review_AspNetUsers_OwnerId",
                table: "Review");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Review_ImageId_OwnerId",
                table: "Review");

            migrationBuilder.RenameColumn(
                name: "OwnerId",
                table: "Review",
                newName: "UserId");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Review_ImageId_UserId",
                table: "Review",
                columns: new[] { "ImageId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Review_AspNetUsers_UserId",
                table: "Review",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Review_AspNetUsers_UserId",
                table: "Review");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Review_ImageId_UserId",
                table: "Review");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Review",
                newName: "OwnerId");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Review_ImageId_OwnerId",
                table: "Review",
                columns: new[] { "ImageId", "OwnerId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Review_AspNetUsers_OwnerId",
                table: "Review",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
