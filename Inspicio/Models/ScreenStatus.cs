using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models
{
    public class ScreenStatus
    {
        [Key]
        [Column(Order = 1)]
        public string UserId { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ScreenId { get; set; }

        [EnumDataType(typeof(PossibleStatus))]
        public PossibleStatus Status { get; set; }
        public enum PossibleStatus { Approved, NeedsWork, Rejected, Undecided };

        [ForeignKey("UserId")]
        public ApplicationUser ApplicationUsers { get; set; }

        [ForeignKey("ScreenId")]
        public Screen Screen { get; set; }
    }
}
