using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Inspicio.Models;


namespace Inspicio.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // public DbSet<ApplicationUser> User { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Image> Images { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Review>().HasKey(r => new { r.OwnerId, r.ImageId });
            modelBuilder.Entity<ApplicationUser>().HasMany(a => a.Images);
            modelBuilder.Entity<ApplicationUser>().HasMany(a => a.Comments);
            modelBuilder.Entity<Image>().HasMany(i => i.Comments).WithOne(i => i.Images);

            //modelBuilder.Entity<Comment>().ToTable("Comment");
            //modelBuilder.Entity<Image>().ToTable("Image");

            base.OnModelCreating(modelBuilder);
        }
    }
}