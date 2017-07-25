﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
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

        [Required]
        [StringLength(150, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 5)]
        public string Title { get; set; }

        public string Description { get; set; }

        [EnumDataType(typeof(Status))]
        [DisplayName("Status")]
        public Status ReviewStatus { get; set; }

        public enum Status
        {
           Open,
           Closed
        }

        public ICollection<Comment> Comments { get; set; }
        public ICollection<AccessTable> Reviews { get; set; }

        [ForeignKey("OwnerId")]
        public ApplicationUser ApplicationUsers { get; set; }
    }
}