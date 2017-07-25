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

        public int NextScreenId { get; set; }

        public int NextVersionId { get; set; }

        [EnumDataType(typeof(States))]
        public States ScreenState { get; set; }

        public enum States { Approved, NeedsWork, Rejected, Undecided };

        [ForeignKey("ScreenId")]
        public Screen Screens { get; set; }

        [ForeignKey("NextScreenId")]
        public Screen NextScreens { get; set; }

        [ForeignKey("NextVersionId")]
        public Screen NextScreenVersions { get; set; }
    }
}