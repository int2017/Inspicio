using Microsoft.AspNetCore.Mvc;

namespace Inspicio.Controllers
{
    public enum State
    {
        Approved,
        NeedsWork,
        Rejected
    };

    public class RatingBody
    {
        // Integer determines which button has been pressed
        public State state { get; set; }
        public int ScreenId { get; set; }

    }
}