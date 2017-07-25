using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models
{
    public class AccessTable
    {
        [Key]
        [Column(Order = 1)]
        public string UserId { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ImageId { get; set; }

        [EnumDataType(typeof(States))]
        public States State { get; set; }

        public enum States { Approved, NeedsWork, Rejected, Undecided };

        [ForeignKey("UserId")]
        public ApplicationUser ApplicationUsers { get; set; }

        [ForeignKey("ImageId")]
        public Image Images { get; set; }
    }
}