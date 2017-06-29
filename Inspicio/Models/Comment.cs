using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models
{
    public class Comment
    {
        public int CommentID { get; set; }
        public int ImageID { get; set; }
        public string UserId { get; set; }
        public string Message { get; set; }

        public ApplicationUser User { get; set; }
        public Image Image { get; set; }
    }

}