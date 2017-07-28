using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Inspicio.Models;

namespace Inspicio.Models.ReviewViewModels
{
    public class ViewModel
    {
        public Review Review { get; set; }

        public class ScreenData
        {
            public Screen Screen { get; set; }

            public List<Comment> Comments { get; set; }

            public int Num_Approvals { get; set; }
            public int Num_Rejections { get; set; }
            public int Num_NeedsWorks { get; set; }
        }
        public ScreenData screenData { get; set; }

        public List<ScreenData> ScreenIds { get; set; }

        public List<Access> Reviewees = new List<Access>();
    }
}