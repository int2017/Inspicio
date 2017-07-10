using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models
{
    public class Review
    {

        public string OwnerId { get; set; }

        public int ImageId { get; set; }

        public Boolean Liked { get; set; }

        public Boolean Disliked { get; set; }

        [ForeignKey("OwnerId"), Column(Order = 0)]
        public ApplicationUser ApplicationUser { get; set; }

        [ForeignKey("ImageId"), Column(Order = 1)]
        public Image Images { get; set; }

    }
}

