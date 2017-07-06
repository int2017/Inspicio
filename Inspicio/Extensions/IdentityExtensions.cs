    
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

namespace Inspicio.Extensions
{
    public static class IdentityExtensions
    {
        public static string GetProfileName(this ClaimsPrincipal user)
        {
            // Jack Lloyd [06/07/17]
            // ClaimTypes.GivenName returning the ProfileName
            var profileName = user.Claims.FirstOrDefault(v => v.Type == ClaimTypes.GivenName).Value;

            // Jack Lloyd [06/07/17]
            // Do the null check here, will avoid having local issues elsewhere.
            return (profileName != null) ? profileName : String.Empty;
        }


    }
}
