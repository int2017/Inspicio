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
        public async Task<IActionResult> Index()
        {

            // Only images with the user id set as the owner should be passed into the view
            var UserID = _userManager.GetUserId(HttpContext.User);

            var allImages =  _context.Images;
            List<Image> images = new List<Image>();

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
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(image);
        }


        public class FullReview
        {
            public Image Image { get; set; }
            public List<Tuple<Comment, String>> Comments { get; set; }
        }


        // GET: Images/View/5
        public async Task<IActionResult> View(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            // Jack Lloyd 
            // Fetch the image by the id pass in '/5'
            var image = await _context.Images.SingleOrDefaultAsync(m => m.ImageID == id);
            if (image == null)
            {
                return NotFound();
            }

            // Jack Lloyd 
            // Create a new FullReview object
            // This will be passed into the view as the model.
            FullReview FullReview = new FullReview();
            FullReview.Image = image;

            // Jack Lloyd 
            // Fetch all the comments 
            // This may not be the best way to do this...
            var allcomments = _context.Comments;

            // Jack Lloyd 
            // The FullReview comments holds a tuple holding one comment and one username.
            List<Tuple<Comment, String>> comments = new List<Tuple<Comment, String>>();

            foreach (Comment comment in allcomments)
            {
                // Jack Lloyd 
                // We only care about the comments for this image
                if (comment.ImageId == id)
                {
                    // Jack Lloyd 
                    // add it and query the user table for the profilename.
                    comments.Add( new Tuple<Comment, String>(comment, _context.Users.SingleOrDefault(u => u.Id == comment.OwnerId).ProfileName));
                }
            }

            // Jack Lloyd 
            // add the tuple comments to the model to pass in.
            FullReview.Comments = comments;

            // FullReview model to the View.
            return View(FullReview);
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
            public bool boolean { get; set; }
            public int ImageID { get; set; }
        }
        [HttpPost]
        public async Task<IActionResult> ChangeRating([FromBody] RatingBody data)
        {
            int id = data.ImageID;
            
            var image = await _context.Images.SingleOrDefaultAsync(m => m.ImageID == id);
            if (data.boolean)
            {
                image.UpRating += 1;
                Console.Write("");
            }
            else
            {
                image.DownRating++;
            }

            await _context.SaveChangesAsync();
            return Ok(1);
        }

        

    }
}
