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
        public class IndexModel
        {
            public Screen Screen { get; set; }
            public int approvals { get; set; }
            public int rejections { get; set; }
            public int needsWorks { get; set; }
        }

        public async Task<IActionResult> Index(string SearchString)
        {

            // Only images with the user id set as the owner should be passed into the view
            var UserId = _userManager.GetUserId(HttpContext.User);

            var ImageIds = _context.AccessTable.Where(r => r.UserId == UserId).Select(i => i.ScreenId);
            var AllImages = new List<Screen>();
            foreach (var Id in ImageIds)
            {
                AllImages.Add(_context.Screens.Where(i => i.ScreenId == Id).SingleOrDefault());
            }

            var ImageEntries = new List<IndexModel>();
            foreach (var a in AllImages)
            {
                ImageEntries.Add(new IndexModel
                {
                    Screen = a,
                    approvals = _context.AccessTable.Count(x => (x.ScreenId == a.ScreenId) && x.State == AccessTable.States.Approved),
                    needsWorks = _context.AccessTable.Count(x => (x.ScreenId == a.ScreenId) && x.State == AccessTable.States.NeedsWork),
                    rejections = _context.AccessTable.Count(x => (x.ScreenId == a.ScreenId) && x.State == AccessTable.States.Rejected)
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

            var Screen = await _context.Screens.SingleOrDefaultAsync(m => m.ScreenId == Id);
            if (Screen == null)
            {
                return NotFound();
            }

            return View(Screen);
        }



        public class SelectableUser : ApplicationUser
        {
            public bool IsSelected { get; set; }
        }
        public class CreatePageModel
        {

            public List<SelectableUser> Users { get; set; }
            public Screen Screen { get; set; }
        }
        // GET: Images/Create
        public IActionResult Create()
        {
            var CreatePageModel = new CreatePageModel();
            CreatePageModel.Users = new List<SelectableUser>();

            var users = _context.Users.Where(u => u.Id != _userManager.GetUserId(HttpContext.User)).ToList();
            foreach (var u in users)
            {
                // Selectable user constructor
                CreatePageModel.Users.Add(new SelectableUser { Id = u.Id, Email = u.Email, ProfileName = u.ProfileName, IsSelected = false });
            }

            return View(CreatePageModel);
        }

        // POST: Images/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreatePageModel CreatePageModel)
        {
            if (ModelState.IsValid)
            {
                CreatePageModel.Screen.OwnerId = _userManager.GetUserId(HttpContext.User);
                CreatePageModel.Screen.ScreenStatus = Screen.Status.Open;
                _context.Add(CreatePageModel.Screen);

                var ReviewOwner = new AccessTable();
                ReviewOwner.ScreenId = CreatePageModel.Screen.ScreenId;
                ReviewOwner.UserId = CreatePageModel.Screen.OwnerId;
                ReviewOwner.State = AccessTable.States.Undecided;
                _context.Add(ReviewOwner);

                CreatePageModel.Screen.ScreenStatus = Screen.Status.Open;
                var Reviewees = new List<AccessTable>();
                if (CreatePageModel.Users != null)
                {
                    foreach (var u in CreatePageModel.Users.Where(m => m.IsSelected))
                    {
                        var reviewee = new AccessTable();
                        reviewee.State = AccessTable.States.Undecided;

                        reviewee.UserId = u.Id;
                        reviewee.ScreenId = CreatePageModel.Screen.ScreenId;
                        _context.Add(reviewee);
                    }
                }

                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(CreatePageModel.Screen);
        }


        public class ViewModel
        {
            public string OwnerId { get; set; }

            public class ImageData
            {
                public Screen Screen { get; set; }
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
            public List<AccessTable> Reviews = new List<AccessTable>();
        }


        // GET: Images/View/5
        public async Task<IActionResult> View(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            // Fetch the image by the id pass in '/5'
            var Screen = await _context.Screens.SingleOrDefaultAsync(m => m.ScreenId == Id);
            if (Screen == null)
            {
                return NotFound();
            }

            // Create a new FullReview object
            // This will be passed into the view as the model.
            var FullReviewData = new ViewModel();
            FullReviewData.Comments = new List<ViewModel.CommentInfo>();

            // Added OwnerProfileName to be passed into the model.
            ApplicationUser User = await _userManager.FindByIdAsync(Screen.OwnerId);

            FullReviewData.OwnerId = User.Id;

            FullReviewData.Info = new ViewModel.ImageData();
            FullReviewData.Info.Screen = Screen;
            FullReviewData.Info.Screen.ScreenStatus = Screen.ScreenStatus;
            FullReviewData.Info.approvals = _context.AccessTable.Count(x => x.ScreenId == Id && x.State == AccessTable.States.Approved);
            FullReviewData.Info.rejections = _context.AccessTable.Count(x => x.ScreenId == Id && x.State == AccessTable.States.Rejected);
            FullReviewData.Info.needsWorks = _context.AccessTable.Count(x => x.ScreenId == Id && x.State == AccessTable.States.NeedsWork);
            FullReviewData.Reviews = _context.AccessTable.Where(u => u.ScreenId == Id).ToList();
            // Changed from getting all comments then working out which we want to only getting the ones we want.
            var AllComments = _context.Comments.Where(c => c.ScreenId == Id);
            foreach (Comment SingleComment in AllComments)
            {
                // add it and query the user table for the profilename.

                // add it and query the user table for the profilename.
                var CommentInfo = new ViewModel.CommentInfo();
                CommentInfo.PosterProfileName = _context.Users.Where(u => u.Id == SingleComment.OwnerId).Select(u => u.ProfileName).SingleOrDefault();
                CommentInfo.comment = SingleComment;

                FullReviewData.Comments.Add(CommentInfo);
            }

            // FullReview model to the View.
            return View(FullReviewData);
        }

        public JsonResult GetRating(int? id)
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            var review = _context.AccessTable.Where(u => u.UserId == userId).Where(i => i.ScreenId == id).SingleOrDefault();
            return Json(review.State);
        }
        public JsonResult GetComments(int? Id)
        {
            List<ViewModel.CommentInfo> comments = new List<ViewModel.CommentInfo>();
            var AllComments = _context.Comments.Where(c => c.ScreenId == Id);
            foreach (Comment SingleComment in AllComments)
            {
                var CommentInfo = new ViewModel.CommentInfo();
                CommentInfo.comment = SingleComment;
                CommentInfo.PosterProfileName = _context.Users.Where(u => u.Id == SingleComment.OwnerId).Select(u => u.ProfileName).Single();
                comments.Add(CommentInfo);
            }
            return Json(comments);
        }
        // POST: Images/View/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> View(int Id, [Bind("ScreenId,Content,DownRating,UpRating,Description,Title")] Screen Screen)
        {

            if (Id != Screen.ScreenId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(Screen);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ImageExists(Screen.ScreenId))
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
            return View(Screen);
        }

        // GET: Images/Delete/5
        public async Task<IActionResult> Delete(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            var Screen = await _context.Screens.SingleOrDefaultAsync(m => m.ScreenId == Id);
            if (Screen == null)
            {
                return NotFound();
            }

            return View(Screen);
        }

        // POST: Images/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int Id)
        {
            var Screen = await _context.Screens.SingleOrDefaultAsync(m => m.ScreenId == Id);
            _context.Screens.Remove(Screen);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool ImageExists(int Id)
        {
            return _context.Screens.Any(e => e.ScreenId == Id);
        }

        public class DataFromBody
        {
            public String Message { get; set; }
            public int ScreenId { get; set; }
            public float Lat { get; set; }
            public float Lng { get; set; }
            public String ParentId { get; set; }
            public Urgency CommentUrgency { get; set; }
        }
        public enum Urgency
        {
            Default,
            Urgent

        }
        [HttpPost]
        public async Task<IActionResult> Comment([FromBody] DataFromBody DataFromBody)
        {
            Comment comment = new Comment();

            var userId = _userManager.GetUserId(HttpContext.User);
            comment.OwnerId = userId;
            comment.ScreenId = DataFromBody.ScreenId;
            comment.Message = DataFromBody.Message;
            comment.Timestamp = System.DateTime.Now;
            comment.Lat = DataFromBody.Lat;
            comment.Lng = DataFromBody.Lng;
            comment.ParentId = DataFromBody.ParentId;
            if (DataFromBody.CommentUrgency == Urgency.Urgent)
            {
                comment.CommentUrgency = Models.Comment.Urgency.Urgent;
            }
            else comment.CommentUrgency = Models.Comment.Urgency.Default;
            _context.Add(comment);

            await _context.SaveChangesAsync();
            return Ok(1);
        }


        public enum State
        {
            Approved,
            NeedsWork,
            Rejected
        };
        public class RatingBody
        {
            // Integer determines which button has been pressed
            public State state { get; set; }
            public int ScreenId { get; set; }

        }
        [HttpPost]
        public async Task<IActionResult> ChangeRating([FromBody] RatingBody data)
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            var review = _context.AccessTable.Where(u => u.UserId == userId).Where(i => i.ScreenId == data.ScreenId).SingleOrDefault();

            if (review == null)
            {
                return NotFound();
            }


            int id = data.ScreenId;
            var image = await _context.Screens.SingleOrDefaultAsync(m => m.ScreenId == id);

            if (data.state == State.Approved)
            {
                review.State = AccessTable.States.Approved;
            }
            else if (data.state == State.NeedsWork)
            {
                review.State = AccessTable.States.NeedsWork;
            }
            else if (data.state == State.Rejected)
            {
                review.State = AccessTable.States.Rejected;
            }

            await _context.SaveChangesAsync();
            return Ok(1);
        }


        public class DataFromToggle
        {
            public int ScreenId { get; set; }
            public bool Open { get; set; }

        }

        [HttpPost]
        public async Task<IActionResult> CloseReview([FromBody] DataFromToggle data)
        {
            var userId = _userManager.GetUserId(HttpContext.User);

            int id = data.ScreenId;
            var image = await _context.Screens.SingleOrDefaultAsync(m => m.ScreenId == id);

            if (data.Open)
            {
                image.ScreenStatus = Screen.Status.Open;
            }
            else
            {
                image.ScreenStatus = Screen.Status.Closed;
            }
            await _context.SaveChangesAsync();
            return Ok(1);
        }
    }
}