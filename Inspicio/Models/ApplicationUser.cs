using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

using System.ComponentModel.DataAnnotations;

namespace Inspicio.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        // ProfileName column in the user table [AspNetUsers]
        [StringLength(16, MinimumLength = 5)]
        public string ProfileName { get; set; }

        // ProfilePicture column in the user table [AspNetUsers]
        public string ProfilePicture { get; set; }

        public bool NotificationFlag { get; set; }

        public DateTime TimeOfLastNotification { get; set; }

        public ICollection<Comment> Comments { get; set; }
        public ICollection<Screen> Screens { get; set; }
        public ICollection<Access> Access { get; set; }
    }
}

