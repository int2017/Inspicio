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
        public int ReviewId { get; set; }

        public int ScreenId { get; set; }

        [EnumDataType(typeof(States))]
        public States ReviewState { get; set; }

        public enum States { Approved, NeedsWork, Rejected, Undecided };

        public ICollection<AccessTable> AccessTable { get; set; }

        [ForeignKey("ScreenId")]
        public Screen Screens { get; set; }
    }
}