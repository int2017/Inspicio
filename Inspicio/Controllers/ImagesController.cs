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
        private readonly IHostingEnvironment _environment;
        private readonly ApplicationDbContext _context;

        public enum Status { Approved, NeedsWork, Rejected };

        public ImagesController(ApplicationDbContext _context, IHostingEnvironment _environment, UserManager<ApplicationUser> _userManager)
        {
            this._environment = _environment;
            this._context = _context;
            this._userManager = _userManager;
        }

        // GET: Images
        public class ImageDataModel
        {
            public Image Image { get; set; }
            public int approvals { get; set; }
            public int rejections { get; set; }
            public int needsWorks { get; set; }
        }

        public async Task<IActionResult> Index(string SearchString)
        {

            // Only images with the user id set as the owner should be passed into the view
            var UserID = _userManager.GetUserId(HttpContext.User);

            // Changed from getting all images then working out which we want to only getting the ones we want.

            List<ImageDataModel> ImageEntries = new List<ImageDataModel>();
            var AllImages = _context.Images.Where(i => i.OwnerId == UserID).ToList();

            if (!String.IsNullOrEmpty(SearchString))
            {
                AllImages = AllImages.Where(s => s.Title.Contains(SearchString)).ToList();
            }

            foreach (var a in AllImages)
            {
                ImageEntries.Add(new ImageDataModel {
                    Image = a,
                    approvals = _context.Review.Count(x => (x.ImageId == a.ImageID) && x.State == Review.States.Approved),
                    needsWorks = _context.Review.Count(x => (x.ImageId == a.ImageID) && x.State == Review.States.NeedsWork),
                    rejections = _context.Review.Count(x => (x.ImageId == a.ImageID) && x.State == Review.States.Rejected)
                });
            }

            await _context.SaveChangesAsync();
            return View(ImageEntries);
        }

        // GET: Images/Details/5
        public async Task<IActionResult> Details(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            var Image = await _context.Images.SingleOrDefaultAsync(m => m.ImageID == Id);
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
        public async Task<IActionResult> Create([Bind("ImageID,Content,DownRating,UpRating,Description,Title")] Image image)
        {
            if (ModelState.IsValid)
            {
                image.OwnerId = _userManager.GetUserId(HttpContext.User);
                _context.Add(image);

                var review = new Review();
                review.ImageId = image.ImageID;
                review.OwnerId = image.OwnerId;
                review.State = Review.States.Undecided;
                _context.Add(review);

                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(image);
        }


        public class FullReviewData
        {
            public string OwnerProfileName { get; set; }
      
            public class ImageData
            {
                public Image Image { get; set; }
                public int approvals { get; set; }
                public int rejections { get; set; }
                public int needsWorks { get; set; }
            }
            public ImageData Info { get; set; }

            public List<CommentInfo> Comments { get; set; }
            public class CommentInfo
            {
                public String PosterProfileName { get; set; }
                public Comment comment { get; set; }
            }
        }


        // GET: Images/View/5
        public async Task<IActionResult> View(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            // Fetch the image by the id pass in '/5'
            var Image = await _context.Images.SingleOrDefaultAsync(m => m.ImageID == Id);
            if (Image == null)
            {
                return NotFound();
            }

            // Create a new FullReview object
            // This will be passed into the view as the model.
            var FullReviewData = new FullReviewData();
            FullReviewData.Comments = new List<FullReviewData.CommentInfo>();

            // Added OwnerProfileName to be passed into the model.
            ApplicationUser User = await _userManager.FindByIdAsync(Image.OwnerId);

            FullReviewData.OwnerProfileName = User.ProfileName;

            FullReviewData.Info = new FullReviewData.ImageData();
            FullReviewData.Info.Image = Image;
            FullReviewData.Info.approvals = _context.Review.Count(x => x.ImageId == Id && x.State == Review.States.Approved);
            FullReviewData.Info.rejections = _context.Review.Count(x => x.ImageId == Id && x.State == Review.States.Rejected);
            FullReviewData.Info.needsWorks = _context.Review.Count(x => x.ImageId == Id && x.State == Review.States.NeedsWork);

            // Changed from getting all comments then working out which we want to only getting the ones we want.
            var AllComments = _context.Comments.Where(c => c.ImageId == Id);
            foreach (Comment SingleComment in AllComments)
            {
                // add it and query the user table for the profilename.

                // add it and query the user table for the profilename.
                var CommentInfo = new FullReviewData.CommentInfo();
                CommentInfo.PosterProfileName = _context.Users.Where(u => u.Id == SingleComment.OwnerId).Select(u => u.ProfileName).SingleOrDefault();
                CommentInfo.comment = SingleComment;

                FullReviewData.Comments.Add(CommentInfo);
            }

            // FullReview model to the View.
            return View(FullReviewData);
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
                    _context.Update(Image);
                    await _context.SaveChangesAsync();
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

            var Image = await _context.Images.SingleOrDefaultAsync(m => m.ImageID == Id);
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
            var Image = await _context.Images.SingleOrDefaultAsync(m => m.ImageID == Id);
            _context.Images.Remove(Image);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool ImageExists(int Id)
        {
            return _context.Images.Any(e => e.ImageID == Id);
        }

        public class DataFromBody
        {
            public String Message { get; set; }
            public int ImageId { get; set; }
            public float Lat { get; set; }
            public float Lng { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Comment([FromBody] DataFromBody DataFromBody)
        {
            Comment comment = new Comment();

            var userId = _userManager.GetUserId(HttpContext.User);
            comment.OwnerId = userId;
            comment.ImageId = DataFromBody.ImageId;
            comment.Message = DataFromBody.Message;
            comment.Timestamp = System.DateTime.Now;
            comment.Lat = DataFromBody.Lat;
            comment.Lng = DataFromBody.Lng;
            _context.Add(comment);

            await _context.SaveChangesAsync();
            return Ok(1);
        }
        public enum States
        {
            Approved,
            NeedsWork,
            Rejected
        };
        public class RatingBody
        {
            // Integer determines which button has been pressed
            public States state { get; set; }
            public int ImageID { get; set; }

        }

        [HttpPost]
        public async Task<IActionResult> ChangeRating([FromBody] RatingBody data)
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            var review = _context.Review.Where(u => u.OwnerId == userId).Where(i => i.ImageId == data.ImageID).SingleOrDefault();

            if (review == null)
            {
                return NotFound();
            }


            int id = data.ImageID;
            var image = await _context.Images.SingleOrDefaultAsync(m => m.ImageID == id);

            if (data.state == States.Approved)
            {
                if (review.State != Review.States.Approved)
                {
                    review.State = Review.States.Approved;
                }
            }

            if ( data.state == States.NeedsWork )
            {
                 if (review.State != Review.States.NeedsWork)
                 {
                    review.State = Review.States.NeedsWork;
                 }
            }

            if (data.state == States.Rejected)
            {

                if (review.State != Review.States.Rejected)
                {
                    review.State = Review.States.Rejected;
                }
            }  
            await _context.SaveChangesAsync();
            return Ok(1);
        }
    }
}
