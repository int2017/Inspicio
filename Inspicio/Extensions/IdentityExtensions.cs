    
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
            // ClaimTypes.GivenName returning the ProfileName
            // avoiding null issues locally
            return user.Claims.FirstOrDefault(v => v.Type == ClaimTypes.GivenName).Value ?? string.Empty;
        }


        public static string GetProfileRole(this ClaimsPrincipal user)
        {
            // ClaimTypes.GivenName returning the ProfileName
            // avoiding null issues locally
            return user.Claims.FirstOrDefault(v => v.Type == ClaimTypes.Role).Value ?? string.Empty;
        }
    }
}
