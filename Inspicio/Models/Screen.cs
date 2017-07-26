using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models
{
    public class Screen
    {
        public int ScreenId { get; set; }

        public int ReviewId { get; set; }

        public int NextScreenId { get; set; }
        public int NextVersionId { get; set; }

        public string OwnerId { get; set; }

        public string Content { get; set; }

        [Required]
        [StringLength(150, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 5)]
        public string Title { get; set; }

        public string Description { get; set; }

        [EnumDataType(typeof(Status))]
        public Status ScreenStatus { get; set; }

        public enum Status { Approved, NeedsWork, Rejected, Undecided }

        public ICollection<Comment> Comments { get; set; }

        public virtual ICollection<Review> Reviews { get; set; }

        [ForeignKey("OwnerId")]
        public ApplicationUser ApplicationUsers { get; set; }
    }
}