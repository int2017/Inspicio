using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models
{

    public class Comment
    {
        public int CommentId { get; set; }

        public string OwnerId { get; set; }

        public Urgency CommentUrgency { get; set; }
        public enum Urgency { Default, Urgent }

        public int ScreenId { get; set; }

        public float Lat { get; set; }
        public float Lng { get; set; }

        public string Message { get; set; }

        [DisplayName("Time Posted")]
        public DateTime Timestamp { get; set; }

        public string ParentId { get; set; }
        public string ChildId { get; set; }

        [ForeignKey("OwnerId")]
        public ApplicationUser ApplicationUser { get; set; }

        [ForeignKey("ScreenId")]
        public Screen Screens { get; set; }
    }
}