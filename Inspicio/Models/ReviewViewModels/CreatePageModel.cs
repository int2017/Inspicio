using System.Collections.Generic;
using Inspicio.Models;

namespace Inspicio.Models.ReviewViewModels
{
    public class CreatePageModel
    {

        public string ReviewTitle { get; set; }

        public string ReviewDescription { get; set; }

        public string ReviewThumbnail { get; set; }

        public List<ApplicationUser> Reviewers { get; set; }
        public List<Screen> Screens { get; set; }
    }
}