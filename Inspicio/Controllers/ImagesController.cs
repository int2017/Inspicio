using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Inspicio.Models;
using Inspicio.Data;
using Inspicio.Models.ImageViewModels;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;

namespace Inspicio.Controllers
{
    [Authorize]
    public class ImagesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ImagesController(ApplicationDbContext context)
        {
            _context = context;
            _environment = env;
        }
        // Method below saves the uploaded image to 'wwwroot/uploads'
        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            var uploads = Path.Combine(_environment.WebRootPath, "uploads");
            if (file.Length > 0)
            {
                using (var fileStream = new FileStream(Path.Combine(uploads, file.FileName), FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
            }
            return RedirectToAction("Index");
            _context = context;    
        }

        // GET: Images
        public async Task<IActionResult> Index()
        {
            return View(await _context.Image.ToListAsync());
        }

        // GET: Images/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var image = await _context.Image
                .SingleOrDefaultAsync(m => m.ID == id);
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
        public IActionResult ViewImage()
        {
            return View();
        }

        // POST: Images/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,ImageTitle,ImageData,ImageDescription,ImageUpRating,ImageDownRating")] Image image)
        {
            if (ModelState.IsValid)
            {
                _context.Add(image);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(image);
        }

        // GET: Images/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var image = await _context.Image.SingleOrDefaultAsync(m => m.ID == id);
            if (image == null)
            {
                return NotFound();
            }
            return View(image);
        }

        // POST: Images/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,ImageTitle,ImageData,ImageDescription,ImageUpRating,ImageDownRating")] Image image)
        {
            if (id != image.ID)
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
                    if (!ImageExists(image.ID))
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

            var image = await _context.Image
                .SingleOrDefaultAsync(m => m.ID == id);
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
            var image = await _context.Image.SingleOrDefaultAsync(m => m.ID == id);
            _context.Image.Remove(image);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool ImageExists(int id)
        {
            return _context.Image.Any(e => e.ID == id);
        }
    }
}
