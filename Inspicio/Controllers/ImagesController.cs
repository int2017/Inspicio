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
                var screenCount = 0;

                var screenIds = _context.Screens.Where(x => x.ReviewId == a.ReviewId).Select(s => s.ScreenId).ToList();
                foreach( var i in screenIds )
                {
                    approvals += _context.ScreenStatus.Count(x => (x.ScreenId == i) && x.Status == ScreenStatus.PossibleStatus.Approved);
                    needsWorks += _context.ScreenStatus.Count(x => (x.ScreenId == i) && x.Status == ScreenStatus.PossibleStatus.NeedsWork);
                    rejections += _context.ScreenStatus.Count(x => (x.ScreenId == i) && x.Status == ScreenStatus.PossibleStatus.Rejected);
                    screenCount++;
                }

                Reviews.Add(new IndexModel
                {
                    Review = a,
                    approvals = approvals,
                    needsWorks = needsWorks,
                    rejections = rejections,
                    screenCount = screenCount
                });
            }
            return View(Reviews);
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
                if (CreatePageModel.ReviewTitle != null)
                {
                    Review.Title = CreatePageModel.ReviewTitle;
                }
                else
                {
                    Review.Title = CreatePageModel.CommentsAndScreens[0].Screen.Title;
                }
                Review.Description = CreatePageModel.ReviewDescription;
                if (CreatePageModel.ReviewThumbnail != null)
                {
                    Review.Thumbnail = CreatePageModel.ReviewThumbnail;
                }
                else
                {
                    Review.Thumbnail = CreatePageModel.CommentsAndScreens[0].Screen.Content;
                }
                
                _context.Add(Review);

                if (CreatePageModel.CommentsAndScreens != null)
                {
                    foreach (var s in CreatePageModel.CommentsAndScreens)
                    {
                        // Screen creation
                        s.Screen.OwnerId = _userManager.GetUserId(HttpContext.User);
                        s.Screen.ScreenState = Screen.States.Open;
                        s.Screen.ReviewId = Review.ReviewId;
                        _context.Add(s.Screen);

                        if (s.CommentList != null)
                        {
                            foreach (var c in s.CommentList)
                            {
                                var comment = new Comment();
                                comment.ParentId = c.ParentId;
                                comment.Message = c.Message;
                                var userId = _userManager.GetUserId(HttpContext.User);
                                comment.OwnerId = userId;

                                comment.ScreenId = s.Screen.ScreenId;
                                comment.Timestamp = System.DateTime.Now;
                                comment.Lat = c.Lat;
                                comment.Lng = c.Lng;
                                /* if (DataFromBody.CommentUrgency == Urgency.Urgent)
                                 {
                                     comment.CommentUrgency = Models.Comment.Urgency.Urgent;
                                 }
                                 else*/
                                comment.CommentUrgency = Models.Comment.Urgency.Default;
                                _context.Add(comment);
                            }
                        }
                    }
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

                        foreach (var s in CreatePageModel.CommentsAndScreens)
                        {
                            var ScreenStatus = new ScreenStatus();
                            ScreenStatus.ScreenId = s.Screen.ScreenId;
                            ScreenStatus.UserId = u.Id;
                            ScreenStatus.Status = ScreenStatus.PossibleStatus.Undecided;
                            _context.Add(ScreenStatus);
                        }
                    }
                }

                await _context.SaveChangesAsync();
                return Json(Url.Action("Index", "Images"));
            }
            return View(CreatePageModel.CommentsAndScreens);
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

            var ViewModel = new ViewModel();

            ViewModel.Review = Review;

            // TODO: Does this work correctly, order may be off! :|
            ViewModel.screenData = (from screen in _context.Screens
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
                                   
        }).FirstOrDefault();

            ViewModel.Reviewees = _context.Access.Where(u => u.ReviewId == Id).ToList();

            ViewModel.ScreenIds = _context.Screens.Where( s => s.ReviewId == Id ).Select(s => s.ScreenId).ToList();

            if (ViewModel.screenData != null)
            {
                ViewModel.screenData.UserVotes = _context.ScreenStatus.Where(s => s.ScreenId == ViewModel.screenData.Screen.ScreenId).ToList();
            }
            ViewModel.FullPage = true;
            return View(ViewModel);
        }

        public JsonResult GetScreenContentFor(int? id)
        {
            var screen = _context.Screens.Where(s => s.ScreenId == id).Select( c => c.Content).SingleOrDefault();
            var screenTitle = _context.Screens.Where(s => s.ScreenId == id).Select(c => c.Title).SingleOrDefault();
            var screenState = _context.Screens.Where(s => s.ScreenId == id).Select(c => c.ScreenState).SingleOrDefault();
            return Json(new { content = screen, title = screenTitle, state = screenState });
        }
        public PartialViewResult _CreatePartial()
        {
            var CreatePageModel = new CreatePageModel();
            CreatePageModel.Reviewers = _context.Users.Where(u => u.Id != _userManager.GetUserId(HttpContext.User)).ToList();
            return PartialView("_CreatePartial", CreatePageModel);
        }
        // GET: Images/View/?/screen

        public async Task<IActionResult> _ScreenPartial(int RId, int SId, int CommentVisibiltyState)
        {
            var ViewModel = new ViewModel();

            var Review = await _context.Review.SingleOrDefaultAsync(m => m.ReviewId == RId);
            if (Review == null)
            {
                return NotFound();
            }

            ViewModel.Review = Review;

            // TODO: Does this work correctly, order may be off! :|
            ViewModel.screenData = (from screen in _context.Screens
                                    where screen.ReviewId == RId
                                    select new ScreenData()
                                    {
                                        Screen = screen,
                                        Comments = (from comment in _context.Comments
                                                    where comment.ScreenId == screen.ScreenId
                                                    select comment).ToList(),

                                        Num_Approvals = _context.ScreenStatus.Count(x => (x.ScreenId == screen.ScreenId) && x.Status == ScreenStatus.PossibleStatus.Approved),
                                        Num_NeedsWorks = _context.ScreenStatus.Count(x => (x.ScreenId == screen.ScreenId) && x.Status == ScreenStatus.PossibleStatus.NeedsWork),
                                        Num_Rejections = _context.ScreenStatus.Count(x => (x.ScreenId == screen.ScreenId) && x.Status == ScreenStatus.PossibleStatus.Rejected)
                                    }).Where(s => s.Screen.ScreenId == SId).Single();

            ViewModel.Reviewees = _context.Access.Where(u => u.ReviewId == RId).ToList();

            ViewModel.ScreenIds = _context.Screens.Where(s => s.ReviewId == RId).Select(s => s.ScreenId).ToList();
            ViewModel.screenData.UserVotes = _context.ScreenStatus.Where(s => s.ScreenId == ViewModel.screenData.Screen.ScreenId).ToList();
            ViewModel.ScreenId = SId;

            ViewModel.FullPage = (CommentVisibiltyState == 0) ? false : true;
            return PartialView(ViewModel);
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
            List<CommentsViewModel> comments = new List<CommentsViewModel>();
            var AllComments = _context.Comments.Where(c => c.ScreenId == Id).ToList(); 
            foreach (Comment SingleComment in AllComments)
            {
                var CommentsViewModel = new CommentsViewModel();
                var userName = _context.Users.Where(i => i.Id == SingleComment.OwnerId).SingleOrDefault();
                CommentsViewModel.PosterProfileName = userName.ProfileName;
                CommentsViewModel.CommentId = SingleComment.CommentId;
                CommentsViewModel.CommentUrgency = (CommentsViewModel.Urgency)SingleComment.CommentUrgency;
                CommentsViewModel.ScreenId = SingleComment.ScreenId;
                CommentsViewModel.Lat = SingleComment.Lat;
                CommentsViewModel.Lng = SingleComment.Lng;
                CommentsViewModel.Message = SingleComment.Message;
                CommentsViewModel.Timestamp = SingleComment.Timestamp;
                CommentsViewModel.ParentId = SingleComment.ParentId;
                comments.Add(CommentsViewModel);
            }
            return Json(comments);
        }

        // POST: Images/Delete/5
        [HttpPost]
        public async Task<JsonResult> Delete(int Id)
        {
            var Screen = await _context.Screens.SingleOrDefaultAsync(m => m.ScreenId == Id);
            _context.Screens.Remove(Screen);
            await _context.SaveChangesAsync();

            return Json( "deleted:"+Id );
        }

        [HttpPost]
        public async Task<JsonResult> DeleteReview(int Id)
        {
            var review = await _context.Review.SingleOrDefaultAsync(m => m.ReviewId == Id);
            _context.Review.Remove(review);
            await _context.SaveChangesAsync();

            return Json(Url.Action("Index", "Images"));
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
            return PartialView("_CommentPartial",comment);
        }
        [HttpPost]
        public async Task<IActionResult> UpdateCommentLocation([FromBody] CommentUpdateModel CommentUpdateModel)
        {
            var parentComment = _context.Comments.Where(c => c.CommentId.ToString().Equals(CommentUpdateModel.ParentId)).SingleOrDefault();
            if (CommentUpdateModel.Message != null)
            {
                parentComment.Message = CommentUpdateModel.Message;
            }
            else if (CommentUpdateModel.Lat != 0) { 
                var childComments = _context.Comments.Where(c => c.ParentId == CommentUpdateModel.ParentId).ToList();
                parentComment.Lat = CommentUpdateModel.Lat;
                parentComment.Lng = CommentUpdateModel.Lng;
                foreach(var c in childComments)
                {
                    c.Lat= CommentUpdateModel.Lat;
                    c.Lng= CommentUpdateModel.Lng;
                }
            }
            await _context.SaveChangesAsync();
            return Ok();
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
            return Json((await _userManager.FindByIdAsync(userId)).ProfileName);
        }

        [HttpPost]
        public JsonResult CloseReview([FromBody] DataFromToggle data)
        {
            var review = _context.Review.SingleOrDefault(s => s.ReviewId == data.ReviewId );
            review.ReviewState = (review.ReviewState == Review.States.Open) ? Review.States.Closed : Review.States.Open;

            _context.SaveChangesAsync();
            return Json(review.ReviewState);
        }

        [HttpPost]
        public JsonResult Toggle_ScreenState(int? id)
        {
            var screen = _context.Screens.SingleOrDefault(s => s.ScreenId == id);
            screen.ScreenState = (screen.ScreenState == Screen.States.Open) ? Screen.States.Closed : Screen.States.Open;

            _context.SaveChangesAsync();
            return Json( screen.ScreenState );
        }



        public class UpdatingUser
        {
            public int ScreenId { get; set; }
            public int ReviewId { get; set; }
            public string[] ToRemove { get; set; }
            public string[] ToAdd { get; set; }
        }
        [HttpPost]
        public async Task<JsonResult> Update_Reviewers([FromBody] UpdatingUser users)
        {
            var accessList = _context.Access.Where(r => r.ReviewId == users.ReviewId).ToList();
            var userScreenList = _context.ScreenStatus.Where(s => s.ScreenId == users.ScreenId).ToList();
            foreach (var uId in users.ToRemove)
            {
                var user = accessList.Find(r => r.UserId == uId);
                _context.Access.Remove(user);
                
                var status = userScreenList.Find(r => r.UserId == uId);
                _context.ScreenStatus.Remove(status);
            }

            foreach (var uId in users.ToAdd)
            {
                var ReviewerEntry = new Access();

                ReviewerEntry.UserId = uId;
                ReviewerEntry.ReviewId = users.ReviewId;
                _context.Access.Add(ReviewerEntry);

                var ScreenStatus = new ScreenStatus();
                ScreenStatus.ScreenId = users.ScreenId;
                ScreenStatus.UserId = uId;
                ScreenStatus.Status = ScreenStatus.PossibleStatus.Undecided;
                _context.Add(ScreenStatus);
            }

            await _context.SaveChangesAsync();

            accessList = _context.Access.Where(r => r.ReviewId == users.ReviewId).ToList();
            var reviewers = new List<object>();
            foreach (var u in accessList)
            {
                var user = (await _userManager.FindByIdAsync(u.UserId));
                var currentrating = _context.ScreenStatus.Where(s => s.ScreenId == users.ScreenId && s.UserId == u.UserId).FirstOrDefault();
                reviewers.Add(new
                {
                    profileName = user.ProfileName,
                    avatar = user.ProfilePicture,
                    rating = (currentrating == null ? "null" : currentrating.Status.ToString())
                });
            }

            return Json(reviewers);
        }

    }
}