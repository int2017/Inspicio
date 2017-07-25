using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models.ReviewViewModels
{
    public class IndexModel
    {
        public Screen Screen { get; set; }
        public int approvals { get; set; }
        public int rejections { get; set; }
        public int needsWorks { get; set; }
    }
}
