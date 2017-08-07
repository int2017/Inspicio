using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models.ReviewViewModels
{
    public class CommentUpdateModel
    {
        public String Message { get; set; }
        public float Lat { get; set; }
        public float Lng { get; set; }
        public String ParentId { get; set; }
    }
}
