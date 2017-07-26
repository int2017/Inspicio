using Microsoft.AspNetCore.Mvc;
using Inspicio.Models;

namespace Inspicio.Models.ReviewViewModels
{
    public class SelectableUser : ApplicationUser
    {
        public bool IsSelected { get; set; }
    }
}