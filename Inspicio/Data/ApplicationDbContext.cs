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
        public DbSet<Screen> Screens { get; set; }
        public DbSet<AccessTable> AccessTable { get; set; }
        public DbSet<Review> Review { get; set; }
        public DbSet<ScreenStatus> ScreenStatus { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AccessTable>().HasKey(a => new { a.UserId, a.ReviewId });
            modelBuilder.Entity<ScreenStatus>().HasKey(s => new { s.UserId, s.ScreenId });
            modelBuilder.Entity<ApplicationUser>().HasMany(a => a.Screens);
            modelBuilder.Entity<ApplicationUser>().HasMany(a => a.Comments);
            modelBuilder.Entity<Screen>().HasMany(i => i.Comments).WithOne(i => i.Screens);

            base.OnModelCreating(modelBuilder);
        }
    }
}