using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.Security.Cryptography;
using System.Text;

namespace Inspicio.Classes
{
    public static class Gravatar
    {
        /// Hashes an email with MD5.
        /// Suitable for use with Gravatar profile image urls
        public static string GetLink(string email)
        {
            // Create a new instance of the MD5CryptoServiceProvider object.  
            MD5 md5Hasher = MD5.Create();

            // Convert the input string to a byte array and compute the hash. 
            byte[] data = MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(email.ToLowerInvariant().Trim()));

            // Create a new Stringbuilder to collect the bytes  
            // and create a string.  
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data  
            // and format each one as a hexadecimal string.  
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            return "https://www.gravatar.com/avatar/" + sBuilder.ToString();  // Return the hexadecimal string. 
        }
    } 
}
