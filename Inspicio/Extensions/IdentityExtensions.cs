    
    // Jack Lloyd [06/07/17]
/*
    Extension methods for the Identity. (ApplicationUser additional columns)
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

using Inspicio.Classes;

namespace Inspicio.Extensions
{
    public static class IdentityExtensions
    {
        public static string GetProfileName(this ClaimsPrincipal user)
        {
            // ClaimTypes.GivenName returning the ProfileName
            return user.FindFirst("Name").Value ?? string.Empty;
        }

        public static string GetProfilePicture(this ClaimsPrincipal user, int size = 80)
        {
            // ClaimTypes.Webpage returning the ProfilePicture
            return user.FindFirst("Picture").Value == "" ? Gravatar.GetLink(user.GetProfileEmail(), size) : "";
        }

        public static string GetProfileEmail(this ClaimsPrincipal user)
        {
            // ClaimTypes.Webpage returning the ProfilePicture
            return user.FindFirst("Email").Value;
        }
    }
}
