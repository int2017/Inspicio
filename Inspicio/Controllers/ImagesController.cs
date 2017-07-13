﻿using System;
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

        public enum Status { APPROVED, REJECTED, NEEDSWORK };

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

            var ImageIds = _context.Review.Where(r => r.OwnerId == UserId).Select(i => i.ImageId);
            var Images = new List<Image>();
            foreach ( var Id in ImageIds )
            {
                Images.Add( _context.Images.Where( i => i.ImageID == Id).SingleOrDefault());
            }

            if (!String.IsNullOrEmpty(SearchString))
            {
                Images = Images.Where(s => s.Title.Contains(SearchString)).ToList();
            }
            return View(Images);
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



        public class SelectableUser : ApplicationUser
        {
            public bool IsSelected { get; set; }
        }
        public class CreatePageModel
        {

            public List<SelectableUser> Users { get; set; }
            public Image Image { get; set; }
        }
        // GET: Images/Create
        public IActionResult Create()
        {
            var CreatePageModel = new CreatePageModel();
            CreatePageModel.Users = new List<SelectableUser>();

            var users = _context.Users.Where( u => u.Id != _userManager.GetUserId(HttpContext.User)).ToList();
            foreach( var u in users )
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
                CreatePageModel.Image.OwnerId = _userManager.GetUserId(HttpContext.User);
                _context.Add(CreatePageModel.Image);

                var ReviewOwner = new Review();
                ReviewOwner.ImageId = CreatePageModel.Image.ImageID;
                ReviewOwner.OwnerId = CreatePageModel.Image.OwnerId;
                ReviewOwner.Approved = false;
                ReviewOwner.Rejected = false;
                ReviewOwner.NeedsWork = false;
                _context.Add(ReviewOwner);

                var Reviewees = new List<Review>();
                foreach( var u in CreatePageModel.Users.Where( m => m.IsSelected ))
                {
                    var reviewee = new Review();
                    reviewee.Approved = false;
                    reviewee.Rejected = false;
                    reviewee.NeedsWork = false;

                    reviewee.OwnerId = u.Id;
                    reviewee.ImageId = CreatePageModel.Image.ImageID;
                    _context.Add(reviewee);
                }


                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(CreatePageModel.Image);
        }



        public class FullReviewData
        {
            public string OwnerProfileName { get; set; }
            public Image Image { get; set; }

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
            FullReviewData.Image = Image;

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

        public class RatingBody
        {
            // Integer determines which button has been pressed
            public int ThumbChosen { get; set; }
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

            // If the review has been approved
            if (data.ThumbChosen == (int)Status.APPROVED)
            {
                if (review.Approved == false)
                {
                    if (review.NeedsWork == true)
                    {
                        review.Approved = true;
                        review.NeedsWork = false;
                        image.NoOfApprovals++;

                        if (image.NoOfNeedsWork > 0)
                        {
                            image.NoOfNeedsWork--;
                        }
                    }
                    else if (review.Rejected == true)
                    {
                        review.Rejected = false;
                        review.Approved = true;
                        image.NoOfApprovals++;
                        if (image.NoOfRejections > 0)
                        {
                            image.NoOfRejections--;
                        }
                    }
                    else if ((review.Approved == false) && (review.NeedsWork == false) && (review.Rejected == false))
                    {
                        review.Approved = true;
                        image.NoOfApprovals++;
                    }
                }
            }

            // if the review has been rejected
            if (data.ThumbChosen == (int)Status.REJECTED)
            {
                if (review.Rejected == false)
                {
                    if (review.NeedsWork == true)
                    {
                        review.Rejected = true;
                        review.NeedsWork = false;
                        image.NoOfRejections++;
                        if (image.NoOfNeedsWork > 0)
                        {
                            image.NoOfNeedsWork--;
                        }
                    }
                    else if (review.Approved == true)
                    {
                        review.Approved = false;
                        review.Rejected = true;
                        image.NoOfRejections++;
                        if (image.NoOfApprovals > 0)
                        {
                            image.NoOfApprovals--;
                        }
                    }
                    else if ((review.Approved == false) && (review.NeedsWork == false) && (review.Rejected == false))
                    {
                        review.Rejected = true;
                        image.NoOfRejections++;
                    }
                }
            }

            // if the review needs more work
            if (data.ThumbChosen == (int)Status.NEEDSWORK)
            {
                if (review.NeedsWork == false)
                {
                    if (review.Approved == true)
                    {
                        review.NeedsWork = true;
                        review.Approved = false;
                        image.NoOfNeedsWork++;
                        if (image.NoOfApprovals > 0)
                        {
                            image.NoOfApprovals--;
                        }
                    }
                    else if (review.Rejected == true)
                    {
                        review.Rejected = false;
                        review.NeedsWork = true;
                        image.NoOfNeedsWork++;
                        if (image.NoOfRejections > 0)
                        {
                            image.NoOfRejections--;
                        }
                    }
                    else if ((review.Approved == false) && (review.NeedsWork == false) && (review.Rejected == false))
                    {
                        review.NeedsWork = true;
                        image.NoOfNeedsWork++;
                    }
                }
            }
            await _context.SaveChangesAsync();
            return Ok(1);
        }
    }
}