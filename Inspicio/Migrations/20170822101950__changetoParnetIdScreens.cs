using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class _changetoParnetIdScreens : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NextScreenId",
                table: "Screens");

            migrationBuilder.RenameColumn(
                name: "NextVersionId",
                table: "Screens",
                newName: "ParentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ParentId",
                table: "Screens",
                newName: "NextVersionId");

            migrationBuilder.AddColumn<int>(
                name: "NextScreenId",
                table: "Screens",
                nullable: false,
                defaultValue: 0);
        }
    }
}
