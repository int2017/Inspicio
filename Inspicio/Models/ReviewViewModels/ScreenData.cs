using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Inspicio.Models.ReviewViewModels
{
    public class ScreenData
    {
        public Screen Screen { get; set; }

        public List<Comment> Comments { get; set; }

        public int Num_Approvals { get; set; }
        public int Num_Rejections { get; set; }
        public int Num_NeedsWorks { get; set; }
        public List<ScreenStatus> UserVotes { get; set; }
    }
}
