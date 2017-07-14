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
        [Key]
        [Column(Order = 1)]
        public string OwnerId { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ImageId { get; set; }

        [EnumDataType(typeof(States))]
        public States State { get; set; }

        public enum States { Approved,
                            NeedsWork,
                            Rejected,
                            Undecided};

        public bool NeedsWork { get; set; }

        [ForeignKey("OwnerId")]
        public ApplicationUser ApplicationUsers { get; set; }

        [ForeignKey("ImageId")]
        public Image Images { get; set; }
    }
}