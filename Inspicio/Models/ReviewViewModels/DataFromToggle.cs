using Microsoft.AspNetCore.Mvc;

namespace Inspicio.Controllers
{
    public partial class ImagesController : Controller
    {
        public class DataFromToggle
        {
            public int ReviewId { get; set; }
            public bool Open { get; set; }

        }
    }
}