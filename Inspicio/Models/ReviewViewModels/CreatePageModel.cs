using System.Collections.Generic;
using Inspicio.Models;

namespace Inspicio.Models.ReviewViewModels
{
    public class CreatePageModel
    {
        public List<SelectableUser> Users { get; set; }
        public Screen Screen { get; set; }
    }
}