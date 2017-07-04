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
        //public int ImageID { get; set; }
        // public string UserId { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public string ParentId { get; set; }
        public string ChildId { get; set; }

        [ForeignKey("Id")]
        public ApplicationUser ApplicationUser { get; set; }

        [ForeignKey("ImageID")]
        public Image Images { get; set; }

    }

}