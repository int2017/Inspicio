using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class renameImageIdToScreenId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Screens_ImageId",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "ImageId",
                table: "Comments",
                newName: "ScreenId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_ImageId",
                table: "Comments",
                newName: "IX_Comments_ScreenId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Screens_ScreenId",
                table: "Comments",
                column: "ScreenId",
                principalTable: "Screens",
                principalColumn: "ScreenId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Screens_ScreenId",
                table: "Comments");

            migrationBuilder.RenameColumn(
                name: "ScreenId",
                table: "Comments",
                newName: "ImageId");

            migrationBuilder.RenameIndex(
                name: "IX_Comments_ScreenId",
                table: "Comments",
                newName: "IX_Comments_ImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Screens_ImageId",
                table: "Comments",
                column: "ImageId",
                principalTable: "Screens",
                principalColumn: "ScreenId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
