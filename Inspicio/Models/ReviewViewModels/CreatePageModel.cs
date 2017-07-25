using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Inspicio.Models;

namespace Inspicio.Controllers
{
    public partial class ImagesController : Controller
    {
        public class CreatePageModel
        {

            public List<SelectableUser> Users { get; set; }
            public Screen Screen { get; set; }
        }
    }
}