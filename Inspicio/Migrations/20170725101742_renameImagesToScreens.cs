using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Inspicio.Migrations
{
    public partial class renameImagesToScreens : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccessTable_Images_ImageId",
                table: "AccessTable");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Images_ImageId",
                table: "Comments");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_AccessTable_ImageId_UserId",
                table: "AccessTable");

            migrationBuilder.RenameColumn(
                name: "ImageId",
                table: "AccessTable",
                newName: "ScreenId");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_AccessTable_ScreenId_UserId",
                table: "AccessTable",
                columns: new[] { "ScreenId", "UserId" });

            migrationBuilder.CreateTable(
                name: "Screens",
                columns: table => new
                {
                    ScreenId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Content = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    OwnerId = table.Column<string>(nullable: true),
                    ReviewStatus = table.Column<int>(nullable: false),
                    Title = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Screens", x => x.ScreenId);
                    table.ForeignKey(
                        name: "FK_Screens_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Screens_OwnerId",
                table: "Screens",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_AccessTable_Screens_ScreenId",
                table: "AccessTable",
                column: "ScreenId",
                principalTable: "Screens",
                principalColumn: "ScreenId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Screens_ImageId",
                table: "Comments",
                column: "ImageId",
                principalTable: "Screens",
                principalColumn: "ScreenId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccessTable_Screens_ScreenId",
                table: "AccessTable");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Screens_ImageId",
                table: "Comments");

            migrationBuilder.DropTable(
                name: "Screens");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_AccessTable_ScreenId_UserId",
                table: "AccessTable");

            migrationBuilder.RenameColumn(
                name: "ScreenId",
                table: "AccessTable",
                newName: "ImageId");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_AccessTable_ImageId_UserId",
                table: "AccessTable",
                columns: new[] { "ImageId", "UserId" });

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    ImageID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Content = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    OwnerId = table.Column<string>(nullable: true),
                    ReviewStatus = table.Column<int>(nullable: false),
                    Title = table.Column<string>(maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.ImageID);
                    table.ForeignKey(
                        name: "FK_Images_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Images_OwnerId",
                table: "Images",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_AccessTable_Images_ImageId",
                table: "AccessTable",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "ImageID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Images_ImageId",
                table: "Comments",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "ImageID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
