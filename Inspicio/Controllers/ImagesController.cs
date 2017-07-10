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
        private readonly UserManager<ApplicationUser> _userManager;

        IHostingEnvironment _environment;

        private readonly ApplicationDbContext _context;

        public ImagesController(ApplicationDbContext context, IHostingEnvironment _environment, UserManager<ApplicationUser> userManager)
        {
            this._environment = _environment;
            _context = context;
            _userManager = userManager;
        }

        // GET: Images
        public async Task<IActionResult> Index(string SearchString)
        {

            // Only images with the user id set as the owner should be passed into the view
            var UserID = _userManager.GetUserId(HttpContext.User);

            var allImages = from i in _context.Images
                            select i; ;

            List<Image> images = new List<Image>();

            if (!String.IsNullOrEmpty(SearchString))
            {
                allImages = allImages.Where(s => s.Title.Contains(SearchString));
            }

            foreach (Image image in allImages)
            {
                if(image.OwnerId == UserID)
                {
                    images.Add(image);
                }
            }

            return View(images);
        }

        // GET: Images/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var image = await _context.Images
                .SingleOrDefaultAsync(m => m.ImageID == id);
            if (image == null)
            {
                return NotFound();
            }

            return View(image);
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
        public async Task<IActionResult> Create([Bind("ImageID,Content,DownRating,UpRating,Description,Title")] Image image)
        {
            if (ModelState.IsValid)
            {
                image.OwnerId = _userManager.GetUserId(HttpContext.User);
                _context.Add(image);

                var review = new Review();
                review.ImageId = image.ImageID;
                review.OwnerId = image.OwnerId;
                review.Liked = false;
                review.Disliked = false;
                _context.Add(review);

                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(image);
        }


        public class DataToBody
        {
            public Image Image { get; set; }
            public List<Comment> Comments { get; set; }
        }

        // GET: Images/View/5
        public async Task<IActionResult> View(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var image = await _context.Images.SingleOrDefaultAsync(m => m.ImageID == id);
            if (image == null)
            {
                return NotFound();
            }

            DataToBody DataToBody = new DataToBody();
            DataToBody.Image = image;

            var allcomments = _context.Comments;
            List<Comment> comments = new List<Comment>();

            foreach (Comment comment in allcomments)
            {
                if (comment.ImageId == id)
                {
                    comments.Add(comment);
                }
            }

            DataToBody.Comments = comments;
            return View(DataToBody);
        }
        // POST: Images/View/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> View(int id, [Bind("ImageID,Content,DownRating,UpRating,Description,Title")] Image image)
        {

            if (id != image.ImageID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(image);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ImageExists(image.ImageID))
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
            return View(image);
        }

        // GET: Images/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var image = await _context.Images
                .SingleOrDefaultAsync(m => m.ImageID == id);
            if (image == null)
            {
                return NotFound();
            }

            return View(image);
        }

        // POST: Images/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var image = await _context.Images.SingleOrDefaultAsync(m => m.ImageID == id);
            _context.Images.Remove(image);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool ImageExists(int id)
        {
            return _context.Images.Any(e => e.ImageID == id);
        }

        public class DataFromBody
        {
            public String Message { get; set; }
            public int ImageId { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Comment([FromBody] DataFromBody _DataFromBody)
        {
            Comment comment = new Comment();

            var userId = _userManager.GetUserId(HttpContext.User);
            comment.OwnerId = userId;
            comment.ImageId = _DataFromBody.ImageId;
            comment.Message = _DataFromBody.Message;
            comment.Timestamp = System.DateTime.Now;

            _context.Add(comment);
            await _context.SaveChangesAsync();
			return Ok(1);
        }
       
        public class RatingBody
        {
            // Boolean is true, if like button pressed
            public bool boolean { get; set; }
            public int ImageID { get; set; }
        }
        [HttpPost]
        public async Task<IActionResult> ChangeRating([FromBody] RatingBody data) 
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            var review = _context.Review.Where(u => u.OwnerId == userId).Where(i => i.ImageId == data.ImageID).SingleOrDefault();

            if( review == null )
            {
                return NotFound();
            }

            int id = data.ImageID;
            var image = await _context.Images.SingleOrDefaultAsync(m => m.ImageID == id);

            // if the like button has been pressed
            if (data.boolean)
            {
                // if like hasn't already been selected
                if (review.Liked == false)
                {
                    // I
                    if (review.Disliked == true)
                    {
                        review.Liked = true;
                        review.Disliked = false;
                        image.UpRating++;
                        if (image.DownRating > 0)
                        {
                            image.DownRating--;
                        }
                    }
                    // if both buttons are false, increment likes by 1
                    else if (review.Liked == false)
                    {
                        review.Liked = true;
                        review.Disliked = false;
                        image.UpRating++;
                    }
                }
            }

            // if the dislike button has been pressed
            else
            {
                // if dislike button hasn't been pressed before
                if (review.Disliked == false)
                {
                    // if the like button was pressed add 1 to dislikes, minus 1 from likes
                    if (review.Liked == true)
                    {
                        review.Liked = false;
                        review.Disliked = true;
                        image.DownRating++;
                        if (image.UpRating > 0)
                        {
                            image.UpRating--;
                        }
                    }
                    // if neither button has been pressed, add 1 to dislikes
                    else if (review.Liked == false)
                    {
                        review.Disliked = true;
                        image.DownRating++;
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(1);
        }
    }
}
