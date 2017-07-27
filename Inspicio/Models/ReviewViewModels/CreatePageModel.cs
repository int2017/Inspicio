using System.Collections.Generic;
using Inspicio.Models;

namespace Inspicio.Models.ReviewViewModels
{
    public class CreatePageModel
    {
        public List<ApplicationUser> Users { get; set; }
        public List<Screen> Screen { get; set; }
    }
}