using System;
using Microsoft.AspNetCore.Mvc;

namespace Inspicio.Controllers
{
    public enum Urgency
    {
        Default,
        Urgent

    }

    public class DataFromBody
    {
        public String Message { get; set; }
        public int ScreenId { get; set; }
        public float Lat { get; set; }
        public float Lng { get; set; }
        public String ParentId { get; set; }
        public Urgency CommentUrgency { get; set; }
    }
}