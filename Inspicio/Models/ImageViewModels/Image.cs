using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models.ImageViewModels
{
    public class Image
    {
        public int ID { get; set; }
        public string ImageTitle { get; set; }
        public string ImageData { get; set; }
        public string ImageDescription { get; set; }
        public int ImageUpRating { get; set; }
        public int ImageDownRating { get; set; }
    }
}