using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Inspicio.Migrations
{
    public partial class CommentNulls : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "Lng",
                table: "Comments",
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<float>(
                name: "Lat",
                table: "Comments",
                nullable: false,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Lng",
                table: "Comments",
                nullable: false,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<int>(
                name: "Lat",
                table: "Comments",
                nullable: false,
                oldClrType: typeof(float));
        }
    }
}
