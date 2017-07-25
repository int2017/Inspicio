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

        public DbSet<Comment> Comments { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<AccessTable> AccessTable { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AccessTable>().HasKey(r => new { r.UserId, r.ImageId });
            modelBuilder.Entity<ApplicationUser>().HasMany(a => a.Images);
            modelBuilder.Entity<ApplicationUser>().HasMany(a => a.Comments);
            modelBuilder.Entity<Image>().HasMany(i => i.Comments).WithOne(i => i.Images);

            base.OnModelCreating(modelBuilder);
        }
    }
}