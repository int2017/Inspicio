using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class ScreenStatusTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ScreenStatus",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    ScreenId = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScreenStatus", x => new { x.UserId, x.ScreenId });
                    table.UniqueConstraint("AK_ScreenStatus_ScreenId_UserId", x => new { x.ScreenId, x.UserId });
                    table.ForeignKey(
                        name: "FK_ScreenStatus_Review_ScreenId",
                        column: x => x.ScreenId,
                        principalTable: "Review",
                        principalColumn: "ReviewId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ScreenStatus_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ScreenStatus");
        }
    }
}
