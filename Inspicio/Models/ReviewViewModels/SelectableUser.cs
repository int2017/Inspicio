using Microsoft.AspNetCore.Mvc;
using Inspicio.Models;

namespace Inspicio.Controllers
{
    public class SelectableUser : ApplicationUser
    {
        public bool IsSelected { get; set; }
    }
}