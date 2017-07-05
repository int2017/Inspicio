using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models
{

    public class Comment
    {
        public int CommentID { get; set; }

        public string OwnerId { get; set; }
        public int ImageId { get; set; }

        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public string ParentId { get; set; }
        public string ChildId { get; set; }

        [ForeignKey("OwnerId")]
        public ApplicationUser ApplicationUser { get; set; }

        [ForeignKey("ImageId")]
        public Image Images { get; set; }

    }

}