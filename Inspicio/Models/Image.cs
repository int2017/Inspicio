﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models
{
    public class Image
    {
        public int ImageID { get; set; }

        public string OwnerId { get; set; }

        public string Content { get; set; }

        [DisplayName("Dislikes")]
        public int NoOfDislikes { get; set; }

        [DisplayName("Likes")]
        public int NoOfLikes { get; set; }

        public string Description { get; set; }

        public string Title { get; set; }

        public ICollection<Comment>Comments { get; set; }
        public ICollection<Review> Reviews { get; set; }


        public ICollection<Comment>Comments { get; set; }

        [ForeignKey("OwnerId")]
        public ApplicationUser ApplicationUsers { get; set; }
    }
}