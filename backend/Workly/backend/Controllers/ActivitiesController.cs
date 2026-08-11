using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/activities")]
public class ActivitiesController : ControllerBase
{
    private readonly WorklyDbContext _context;

    public ActivitiesController(WorklyDbContext context)
    {
        _context = context;
    }

    // GET: api/activities
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
    {
        var activities = await _context.Activities
            .OrderByDescending(a => a.Date)
            .ThenBy(a => a.CreatedAt)
            .ToListAsync();

        return Ok(activities);
    }

    // GET: api/activities/date/2026-08-11
    [HttpGet("date/{date}")]
    public async Task<ActionResult<IEnumerable<Activity>>> GetByDate(
        DateTime date)
    {
        var activities = await _context.Activities
            .Where(a => a.Date.Date == date.Date)
            .OrderBy(a => a.CreatedAt)
            .ToListAsync();

        return Ok(activities);
    }

    // POST: api/activities
    [HttpPost]
    public async Task<ActionResult<Activity>> Create(
        Activity activity)
    {
        activity.Id = Guid.NewGuid();
        activity.CreatedAt = DateTime.UtcNow;

        _context.Activities.Add(activity);

        await _context.SaveChangesAsync();

        return Ok(activity);
    }

    // PUT: api/activities/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<Activity>> Update(
        Guid id,
        Activity activity)
    {
        var existing = await _context.Activities
            .FirstOrDefaultAsync(a => a.Id == id);

        if (existing == null)
            return NotFound();

        existing.Title = activity.Title;
        existing.Percentage = activity.Percentage;
        existing.Hours = activity.Hours;
        existing.Date = activity.Date;
        existing.ParentId = activity.ParentId;

        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    // DELETE: api/activities/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var activity = await _context.Activities
            .FirstOrDefaultAsync(a => a.Id == id);

        if (activity == null)
            return NotFound();

        _context.Activities.Remove(activity);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}