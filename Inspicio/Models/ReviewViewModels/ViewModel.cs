using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Inspicio.Models;

namespace Inspicio.Models.ReviewViewModels
{
    public class ViewModel
    {
        public Review Review { get; set; }

        public List<int> ScreenIds { get; set; }

        public List<Access> Reviewees = new List<Access>();

        public ScreenData Screen { get; set; }
        public ScreenData screenData { get; set; }

        public List<ScreenData> ScreenIds { get; set; }

        public int ScreenId { get; set; }
    }
}