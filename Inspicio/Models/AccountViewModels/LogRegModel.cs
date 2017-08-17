using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Inspicio.Models.AccountViewModels
{

    public class LogRegModel
    {
        public class LoginViewModel
        {
            [Required]
            [EmailAddress]
            [Display(Name = "email address")]
            public string Email { get; set; }

            [Required]
            [DataType(DataType.Password)]
            [Display(Name = "password")]
            public string Password { get; set; }

            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; }

        }

        public class RegisterViewModel
        {
            // Error message is needed!
            [Required]
            [StringLength(30, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 5)]
            [Remote(action: "VerifyUsername", controller: "Account", AdditionalFields = "ProfileName")]
            [Display(Name = "username")]
            public string ProfileName { get; set; }

            [Required]
            [EmailAddress(ErrorMessage = "The email address is invalid")]
            [Remote(action: "VerifyEmail",controller: "Account", AdditionalFields = "Email")]
            [Display(Name = "email address")]
            public string Email { get; set; }

            [Required]
            [StringLength(int.MaxValue, ErrorMessage = "The {0} must be at least {2} characters long", MinimumLength = 8)]
            [DataType(DataType.Password)]
            [Display(Name = "password")]
            public string Password { get; set; }

            [Required]
            [DataType(DataType.Password)]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
            [Display(Name = "password confirmation")]
            public string ConfirmPassword { get; set; }
        }

        public LoginViewModel Login { get; set; }
        public RegisterViewModel Register { get; set; }
    }  
}
