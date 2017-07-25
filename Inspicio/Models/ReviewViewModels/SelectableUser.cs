using Microsoft.AspNetCore.Mvc;
using Inspicio.Models;

namespace Inspicio.Controllers
{
    public partial class ImagesController : Controller
    {
        public class SelectableUser : ApplicationUser
        {
            public bool IsSelected { get; set; }
        }
    }
}