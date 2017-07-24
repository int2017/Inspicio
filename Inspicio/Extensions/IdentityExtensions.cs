
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
        public static string GetProfileEmail(this ClaimsPrincipal user)
        {
            // Email returning the ProfilePicture
            return user.FindFirst("Email").Value;
        }

        public static string GetProfileId(this ClaimsPrincipal user)
        {
            // Id returning the ProfileId
            return user.FindFirst("Id").Value;
        }
    }
}