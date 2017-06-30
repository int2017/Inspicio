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
        public int ImageID { get; set; }
        // public string UserId { get; set; }
        public string Message { get; set; }


        [ForeignKey("Id")]
        public ApplicationUser User { get; set; }
        [ForeignKey("ImageID")]
        public Image Image { get; set; }
    }

}