using Microsoft.AspNetCore.Mvc;

namespace Inspicio.Models.ReviewViewModels
{
    public class DataFromToggle
    {
        public int ReviewId { get; set; }
        public bool Open { get; set; }

    }
}