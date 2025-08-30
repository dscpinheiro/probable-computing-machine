using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TodoApp.Backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedTestData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Todo",
                table: "Todo");

            migrationBuilder.RenameTable(
                name: "Todo",
                newName: "Todos");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Todos",
                table: "Todos",
                column: "Id");

            migrationBuilder.InsertData(
                table: "Todos",
                columns: new[] { "Id", "DueDate", "IsCompleted", "Title" },
                values: new object[,]
                {
                    { new Guid("403b9af9-2341-4723-a434-6330fe7116bf"), new DateOnly(2026, 4, 30), false, "File taxes" },
                    { new Guid("6d055426-cc5a-45b0-a4f5-1744454193a3"), new DateOnly(2024, 12, 25), true, "Go on vacation" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Todos",
                table: "Todos");

            migrationBuilder.DeleteData(
                table: "Todos",
                keyColumn: "Id",
                keyValue: new Guid("403b9af9-2341-4723-a434-6330fe7116bf"));

            migrationBuilder.DeleteData(
                table: "Todos",
                keyColumn: "Id",
                keyValue: new Guid("6d055426-cc5a-45b0-a4f5-1744454193a3"));

            migrationBuilder.RenameTable(
                name: "Todos",
                newName: "Todo");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Todo",
                table: "Todo",
                column: "Id");
        }
    }
}
