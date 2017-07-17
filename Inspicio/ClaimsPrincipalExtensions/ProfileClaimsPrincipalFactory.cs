
    // Jack Lloyd [06/07/17]
/*
    Overriding the UserClaimsprincipalFactory
    in order to add a 'ProfileName' claim 
    into Claims of Authenticated Users
 */

using Inspicio.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;

using System.Threading.Tasks;

namespace Inspicio.ClaimsPrincipalExtensions
{
    public class ProfileClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, IdentityRole>
    {
        public ProfileClaimsPrincipalFactory (
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IOptions<IdentityOptions> optionsAccessor ) : base( userManager, roleManager, optionsAccessor )
        {

        }

        public async override Task<ClaimsPrincipal> CreateAsync( ApplicationUser user )
        {
            // First call the base we originally were calling
            var principal = await base.CreateAsync(user);

            // Adding the ProfileName property to Claims.
            ((ClaimsIdentity)principal.Identity).AddClaims(new[]
            {
                // ClaimTypes.GivenName, this will be how we access our property when needed
                new Claim(ClaimTypes.GivenName, user.ProfileName),
                new Claim(ClaimTypes.Role, user.Id)
            });

            return principal;
        }
    }
}