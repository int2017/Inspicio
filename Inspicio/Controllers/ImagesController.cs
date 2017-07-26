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

using Inspicio.Models.ReviewViewModels;

namespace Inspicio.Controllers
{
    [Authorize]
    public partial class ImagesController : Controller
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
        public async Task<IActionResult> Index(string SearchString)
        {

            // Only images with the user id set as the owner should be passed into the view
            var UserId = _userManager.GetUserId(HttpContext.User);

            var ReviewIds = _context.Access.Where(r => r.UserId == UserId).Select(i => i.ReviewId).ToList();
            var allReviews = new List<Review>();

            foreach (var Id in ReviewIds)
            {
                allReviews.Add(_context.Review.Where(i => i.ReviewId == Id).SingleOrDefault());
            }

            var Reviews = new List<IndexModel>();
            foreach (var a in allReviews)
            {
                Reviews.Add(new IndexModel
                {
                    Review = a,
                    approvals = 0,//_context.AccessTable.Count(x => (x.ReviewId == a.ScreenId) && x.State == AccessTable.States.Approved),
                    needsWorks = 0,//_context.AccessTable.Count(x => (x.ReviewId == a.ScreenId) && x.State == AccessTable.States.NeedsWork),
                    rejections = 0//_context.AccessTable.Count(x => (x.ReviewId == a.ScreenId) && x.State == AccessTable.States.Rejected)
                });
            }
            return View(Reviews);
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
                // Screen creation
                CreatePageModel.Screen.OwnerId = _userManager.GetUserId(HttpContext.User);
                CreatePageModel.Screen.ScreenStatus = Screen.Status.Undecided;
                _context.Add(CreatePageModel.Screen);

                // Review creation
                var Review = new Review();
                //Review.ReviewId = ?
                Review.CreatorId = _userManager.GetUserId(HttpContext.User);
                Review.ReviewState = Review.States.Open;
                Review.ReviewStatus = Review.Status.Undecided;
                //Review.NextScreenId = -1;
                //Review.NextVersionId = -1;
                Review.Title = "Default Title HardCoded";
                Review.Description = "Default Description HardCoded";
                _context.Add(Review);

                CreatePageModel.Screen.ReviewId = Review.ReviewId;

                // Access creations
                var OwnerEntry = new Access();
                OwnerEntry.ReviewId = CreatePageModel.Screen.ScreenId;
                OwnerEntry.UserId = CreatePageModel.Screen.OwnerId;
                _context.Add(OwnerEntry);
                
                if (CreatePageModel.Users != null)
                {
                    foreach (var u in CreatePageModel.Users.Where(m => m.IsSelected))
                    {
                        var ReviewerEntry = new Access();

                        ReviewerEntry.UserId = u.Id;
                        ReviewerEntry.ReviewId = CreatePageModel.Screen.ScreenId;
                        _context.Add(ReviewerEntry);
                    }
                }

                // ScreenStatus creation
                if (CreatePageModel.Users != null)
                {
                    foreach (var u in CreatePageModel.Users.Where(m => m.IsSelected))
                    {

                        var ScreenStatus = new ScreenStatus();
                        ScreenStatus.ScreenId = CreatePageModel.Screen.ScreenId;
                        ScreenStatus.UserId = u.Id;
                        _context.Add(ScreenStatus);
                    }
                }

                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(CreatePageModel.Screen);
        }







        // GET: Images/View/5
        public async Task<IActionResult> View(int? Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            // Fetch the review by the id pass in '/5'
            var Review = await _context.Review.SingleOrDefaultAsync(m => m.ReviewId == Id);
            if (Review == null)
            {
                return NotFound();
            }

            // This will be passed into the view as the model.
            var ViewModel = new ViewModel();

            // Added OwnerProfileName to be passed into the model.
            ViewModel.Review = Review;

            var allScreens = (from screen in _context.Screens
                              where screen.ReviewId == Id
                              select new ViewModel.ScreenData()
                              {
                                  Screen = screen,
                                  Comments = (from comment in _context.Comments
                                              where comment.ScreenId == screen.ScreenId
                                              select comment).ToList(),

                                  Num_Approvals = 0,
                                  Num_NeedsWorks = 0,
                                  Num_Rejections = 0
                              });


            ViewModel.ScreensList = allScreens.ToList();

            //FullReviewData.Reviewees = _context.Access.Where(u => u.ReviewId == Id).ToList();

            return View(ViewModel);
        }

        public JsonResult GetRating(int? id)
        {
            var userId = _userManager.GetUserId(HttpContext.User);
           // var review = _context.AccessTable.Where(u => u.UserId == userId).Where(i => i.ReviewId == id).SingleOrDefault();
            return Json(0);// review.State);
        }
        public JsonResult GetComments(int? Id)
        {
            var AllComments = _context.Comments.Where(c => c.ScreenId == Id);
            return Json(AllComments);
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


       
        [HttpPost]
        public async Task<IActionResult> ChangeRating([FromBody] RatingBody data)
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            //var review = _context.AccessTable.Where(u => u.UserId == userId).Where(i => i.ReviewId == data.ScreenId).SingleOrDefault();

            //if (review == null)
            //{
            //    return NotFound();
            //}


            int id = data.ScreenId;
            var image = await _context.Screens.SingleOrDefaultAsync(m => m.ScreenId == id);

            //if (data.state == State.Approved)
            //{
            //    review.State = AccessTable.States.Approved;
            //}
            //else if (data.state == State.NeedsWork)
            //{
            //    review.State = AccessTable.States.NeedsWork;
            //}
            //else if (data.state == State.Rejected)
            //{
            //    review.State = AccessTable.States.Rejected;
            //}

            await _context.SaveChangesAsync();
            return Ok(1);
        }

        [HttpPost]
        public async Task<IActionResult> CloseReview([FromBody] DataFromToggle data)
        {
            var userId = _userManager.GetUserId(HttpContext.User);

            int id = data.ReviewId;
            var review = await _context.Review.SingleOrDefaultAsync(m => m.ReviewId == id);

            if (data.Open)
            {
                review.ReviewState = Review.States.Open;
            }
            else
            {
                review.ReviewState = Review.States.Closed;
            }
            await _context.SaveChangesAsync();
            return Ok(1);
        }
    }
}