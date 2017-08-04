using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models.ReviewViewModels
{
    public class CommentsViewModel
    {
        public string PosterProfileName { get; set; }
        public int CommentId { get; set; }

        public Urgency CommentUrgency { get; set; }
        public enum Urgency { Default, Urgent }

        public int ScreenId { get; set; }

        public float Lat { get; set; }
        public float Lng { get; set; }

        public string Message { get; set; }

        [DisplayName("Time Posted")]
        public DateTime Timestamp { get; set; }

        public string ParentId { get; set; }
    }
}
