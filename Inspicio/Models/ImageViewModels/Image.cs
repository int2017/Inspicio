using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models.ImageViewModels
{
    public class Image
    {
        public int ID { get; set; }
        public int UpRating { get; set; }
        public int DownRating { get; set; }
        public string ImageData { get; set; }
        public string Description { get; set; }
    }
}
