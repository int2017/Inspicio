using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Inspicio.Data;
using Inspicio.Models;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
namespace Inspicio.Controllers
{
    [Authorize]
    public class ImagesController : Controller
    {
        private readonly UserManager<ApplicationUser> UserManager;   
        private readonly IHostingEnvironment Environment;
        private readonly ApplicationDbContext Context;

        public ImagesController(ApplicationDbContext Context, IHostingEnvironment Environment, UserManager<ApplicationUser> UserManager)
        {
            this.Environment = Environment;
            this.Context = Context;
            this.UserManager = UserManager;
        }

        // GET: Images
        public async Task<IActionResult> Index()
        {

            // Only images with the user id set as the owner should be passed into the view
            var UserID = UserManager.GetUserId(HttpContext.User);

            // Jack Lloyd [06/07/17]
            // Chnaged from getting all images then working out which we want to only getting the ones we want.
            var AllImages =  Context.Images.Where( i => i.OwnerId == UserID).ToList();
            return View(AllImages);
        }

        // GET: Images/Details/5
        public async Task<IActionResult> Details(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            var Image = await Context.Images.SingleOrDefaultAsync(m => m.ImageID == Id);
            if (Image == null)
            {
                return NotFound();
            }

            return View(Image);
        }

        // GET: Images/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Images/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ImageID,Content,DownRating,UpRating,Description,Title")] Image Image)
        {
            if (ModelState.IsValid)
            {
                Image.OwnerId = UserManager.GetUserId(HttpContext.User);
                Context.Add(Image);
                await Context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(Image);
        }


        public class FullReview
        {
            public string OwnerProfileName { get; set; }
            public Image Image { get; set; }
            public List<Tuple<Comment, String>> Comments { get; set; }
        }


        // GET: Images/View/5
        public async Task<IActionResult> View(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            // Jack Lloyd 
            // Fetch the image by the id pass in '/5'
            var Image = await Context.Images.SingleOrDefaultAsync(m => m.ImageID == Id);
            if (Image == null)
            {
                return NotFound();
            }

            // Jack Lloyd 
            // Create a new FullReview object
            // This will be passed into the view as the model.
            FullReview FullReview = new FullReview();

            // Jack Lloyd 
            // Added OwnerProfileName to be passed into the model.
            ApplicationUser User = await UserManager.FindByIdAsync(Image.OwnerId);
            FullReview.OwnerProfileName = User.ProfileName;

            FullReview.Image = Image;

            // Jack Lloyd
            // Chnaged from getting all comments then working out which we want to only getting the ones we want.
            var AllComments = Context.Comments.Where(c => c.ImageId == Id);

            // Jack Lloyd 
            // The FullReview comments holds a tuple holding one comment and one username.
            List<Tuple<Comment, String>> Comments = new List<Tuple<Comment, String>>();

            foreach (Comment SingleComment in AllComments)
            {
                // Jack Lloyd 
                // add it and query the user table for the profilename.
                Comments.Add( new Tuple<Comment, String>(SingleComment, Context.Users.SingleOrDefault(u => u.Id == SingleComment.OwnerId).ProfileName));
            }

            // Jack Lloyd 
            // add the tuple comments to the model to pass in.
            FullReview.Comments = Comments;

            // FullReview model to the View.
            return View(FullReview);
        }



        // POST: Images/View/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> View(int Id, [Bind("ImageID,Content,DownRating,UpRating,Description,Title")] Image Image)
        {

            if (Id != Image.ImageID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    Context.Update(Image);
                    await Context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ImageExists(Image.ImageID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index");
            }
            return View(Image);
        }

        // GET: Images/Delete/5
        public async Task<IActionResult> Delete(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            var Image = await Context.Images.SingleOrDefaultAsync(m => m.ImageID == Id);
            if (Image == null)
            {
                return NotFound();
            }

            return View(Image);
        }

        // POST: Images/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int Id)
        {
            var Image = await Context.Images.SingleOrDefaultAsync(m => m.ImageID == Id);
            Context.Images.Remove(Image);
            await Context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool ImageExists(int Id)
        {
            return Context.Images.Any(e => e.ImageID == Id);
        }

        public class DataFromBody
        {
            public String Message { get; set; }
            public int ImageId { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Comment([FromBody] DataFromBody DataFromBody)
        {
            Comment Comment = new Comment();

            String UserId = UserManager.GetUserId(HttpContext.User);
            Comment.OwnerId = UserId;
            Comment.ImageId = DataFromBody.ImageId;
            Comment.Message = DataFromBody.Message;
            Comment.Timestamp = System.DateTime.Now;

            Context.Add(Comment);
            await Context.SaveChangesAsync();
			return Ok(1);
        }
       
        public class RatingBody
        {
            public bool boolean { get; set; }
            public int ImageID { get; set; }
        }
        [HttpPost]
        public async Task<IActionResult> ChangeRating([FromBody] RatingBody RatingBody)
        {            
            var Image = await Context.Images.SingleOrDefaultAsync(m => m.ImageID == RatingBody.ImageID);
            if (RatingBody.boolean)
            {
                Image.NoOfLikes += 1;
            }
            else
            {
                Image.NoOfDislikes++;
            }

            await Context.SaveChangesAsync();
            return Ok(1);
        }
    }
}