using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Inspicio.Models.ImageViewModels;

namespace Inspicio.Models
{
    public class InspicioContext : DbContext
    {
        public InspicioContext (DbContextOptions<InspicioContext> options)
            : base(options)
        {
        }

        public DbSet<Inspicio.Models.ImageViewModels.Image> Image { get; set; }
    }
}
