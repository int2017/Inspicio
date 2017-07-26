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

        public string CreatorId { get; set; }

        [Required]
        [StringLength(150, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 5)]
        public string Title { get; set; }

        public string Description { get; set; }

        public int ScreenId { get; set; }

        public int NextScreenId { get; set; }
        public int NextVersionId { get; set; }

        [EnumDataType(typeof(States))]
        public States ReviewState { get; set; }
        public enum States { Open, Closed };

        [EnumDataType(typeof(Status))]
        public Status ReviewStatus { get; set; }
        public enum Status { Approved, NeedsWork, Rejected, Undecided };

        public ICollection<Access> Access { get; set; }

        [ForeignKey("ScreenId")]
        public Screen Screens { get; set; }

        [ForeignKey("CreatorId")]
        public ApplicationUser ApplicationUsers { get; set; }
    }
}