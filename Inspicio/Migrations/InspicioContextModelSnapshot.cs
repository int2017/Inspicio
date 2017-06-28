using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Inspicio.Models;

namespace Inspicio.Migrations
{
    [DbContext(typeof(InspicioContext))]
    partial class InspicioContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.2")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Inspicio.Models.ImageViewModels.Image", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<int>("DownRating");

                    b.Property<string>("ImageData");

                    b.Property<int>("UpRating");

                    b.HasKey("ID");

                    b.ToTable("Image");
                });
        }
    }
}
