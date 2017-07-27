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
                var approvals = 0;
                var needsWorks = 0;
                var rejections = 0;

                var screenIds = _context.Screens.Where(x => x.ReviewId == a.ReviewId).Select(s => s.ScreenId).ToList();
                foreach( var i in screenIds )
                {
                    approvals += _context.ScreenStatus.Count(x => (x.ScreenId == i) && x.Status == ScreenStatus.PossibleStatus.Approved);
                    needsWorks += _context.ScreenStatus.Count(x => (x.ScreenId == i) && x.Status == ScreenStatus.PossibleStatus.NeedsWork);
                    rejections += _context.ScreenStatus.Count(x => (x.ScreenId == i) && x.Status == ScreenStatus.PossibleStatus.Rejected);
                }

                Reviews.Add(new IndexModel
                {
                    Review = a,
                    approvals = approvals,
                    needsWorks = needsWorks,
                    rejections = rejections
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
            CreatePageModel.Reviewers = _context.Users.Where(u => u.Id != _userManager.GetUserId(HttpContext.User)).ToList();
            return View(CreatePageModel);
        }

        // POST: Images/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreatePageModel CreatePageModel)
        {
            if (ModelState.IsValid)
            {
                    // Review creation
                var Review = new Review();
                //Review.ReviewId = ?
                Review.CreatorId = _userManager.GetUserId(HttpContext.User);
                Review.ReviewState = Review.States.Open;
                Review.ReviewStatus = Review.Status.Undecided;
                Review.Title = CreatePageModel.ReviewTitle;
                Review.Description = CreatePageModel.ReviewDescription;
                Review.Thumbnail = CreatePageModel.ReviewThumbnail;
                _context.Add(Review);


                foreach( var s in CreatePageModel.Screens )
                {
                        // Screen creation
                    s.OwnerId = _userManager.GetUserId(HttpContext.User);
                    s.ScreenStatus = Screen.Status.Undecided;
                    s.ReviewId = Review.ReviewId;
                    _context.Add(s);
                }

                // Access creation
                var OwnerEntry = new Access();
                OwnerEntry.ReviewId = Review.ReviewId;
                OwnerEntry.UserId = _userManager.GetUserId(HttpContext.User);
                _context.Add(OwnerEntry);

                if (CreatePageModel.Reviewers != null)
                {
                    foreach (var u in CreatePageModel.Reviewers)
                    {
                        var ReviewerEntry = new Access();

                        ReviewerEntry.UserId = u.Id;
                        ReviewerEntry.ReviewId = Review.ReviewId;
                        _context.Add(ReviewerEntry);

                        foreach (var s in CreatePageModel.Screens)
                        {
                            var ScreenStatus = new ScreenStatus();
                            ScreenStatus.ScreenId = s.ScreenId;
                            ScreenStatus.UserId = u.Id;
                            ScreenStatus.Status = ScreenStatus.PossibleStatus.Undecided;
                            _context.Add(ScreenStatus);
                        }
                    }
                }

                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(CreatePageModel.Screens);
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
                              select new ScreenData()
                              {
                                  Screen = screen,
                                  Comments = (from comment in _context.Comments
                                              where comment.ScreenId == screen.ScreenId
                                              select comment).ToList(),

                                  Num_Approvals = _context.ScreenStatus.Count(x => (x.ScreenId == screen.ScreenId) && x.Status == ScreenStatus.PossibleStatus.Approved),
                                  Num_NeedsWorks = _context.ScreenStatus.Count(x => (x.ScreenId == screen.ScreenId) && x.Status == ScreenStatus.PossibleStatus.NeedsWork),
                                  Num_Rejections = _context.ScreenStatus.Count(x => (x.ScreenId == screen.ScreenId) && x.Status == ScreenStatus.PossibleStatus.Rejected)
                              });


           // ViewModel.ScreensList = allScreens.ToList();

            ViewModel.Reviewees = _context.Access.Where(u => u.ReviewId == Id).ToList();

            return View(ViewModel);
        }


        // GET: Images/View/?/screen
        public async Task<IActionResult> GetScreenData(ViewModel viewModel)
        {
            var s = (from screen in _context.Screens
                     where screen.ScreenId == viewModel.ScreenId
                     select new ScreenData()
                              {
                                  Screen = screen,
                                  Comments = (from comment in _context.Comments
                                              where comment.ScreenId == screen.ScreenId
                                              select comment).ToList(),

                                  Num_Approvals = _context.ScreenStatus.Count(x => (x.ScreenId == screen.ScreenId) && x.Status == ScreenStatus.PossibleStatus.Approved),
                                  Num_NeedsWorks = _context.ScreenStatus.Count(x => (x.ScreenId == screen.ScreenId) && x.Status == ScreenStatus.PossibleStatus.NeedsWork),
                                  Num_Rejections = _context.ScreenStatus.Count(x => (x.ScreenId == screen.ScreenId) && x.Status == ScreenStatus.PossibleStatus.Rejected)
                              }).FirstOrDefault();
            viewModel.Screen = s;

            return View(viewModel);
        }




        public JsonResult GetRating(int? id)
        {
            var userId = _userManager.GetUserId(HttpContext.User);

            //TODO stop this running/update the ui for the over
            //TODO owner shouldn't be allowed to vote but needs the results
            if( !(_context.Screens.Where(s => s.ScreenId == id ).Select( u => u.OwnerId).SingleOrDefault() == userId) )
            {
                var ScreenStatus = _context.ScreenStatus.Where(u => u.UserId == userId).Where(i => i.ScreenId == id).SingleOrDefault();
                return Json(ScreenStatus.Status);
            }
            return Json("");
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
            var ScreenStatus = _context.ScreenStatus.Where(u => u.UserId == userId).Where(i => i.ScreenId == data.ScreenId).SingleOrDefault();

            if (ScreenStatus == null)
            {
                return NotFound();
            }


            int id = data.ScreenId;
            var image = await _context.Screens.SingleOrDefaultAsync(m => m.ScreenId == id);

            if (data.state == State.Approved)
            {
                ScreenStatus.Status = ScreenStatus.PossibleStatus.Approved;
            }
            else if (data.state == State.NeedsWork)
            {
                ScreenStatus.Status = ScreenStatus.PossibleStatus.NeedsWork;
            }
            else if (data.state == State.Rejected)
            {
                ScreenStatus.Status = ScreenStatus.PossibleStatus.Rejected;
            }

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