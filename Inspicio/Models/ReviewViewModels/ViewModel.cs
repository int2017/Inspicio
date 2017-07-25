using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Inspicio.Models;

namespace Inspicio.Controllers
{
    public partial class ImagesController : Controller
    {
        public class ViewModel
        {
            public string OwnerId { get; set; }

            public class ImageData
            {
                public Screen Screen { get; set; }
                public int approvals { get; set; }
                public int rejections { get; set; }
                public int needsWorks { get; set; }
            }
            public ImageData Info { get; set; }

            public List<CommentInfo> Comments { get; set; }
            public class CommentInfo
            {
                public String PosterProfileName { get; set; }
                public Comment comment { get; set; }
            }
            public List<AccessTable> Reviews = new List<AccessTable>();
        }
    }
}