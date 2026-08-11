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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
    {
        var activities = await _context.Activities
            .OrderByDescending(a => a.Date)
            .ThenBy(a => a.CreatedAt)
            .ToListAsync();

        return Ok(activities);
    }

    [HttpGet("date/{date}")]
    public async Task<ActionResult<IEnumerable<Activity>>> GetByDate(
        DateTime date)
    {
        var startDate = DateTime.SpecifyKind(
            date.Date,
            DateTimeKind.Utc
        );

        var endDate = startDate.AddDays(1);

        var activities = await _context.Activities
            .Where(a =>
                a.Date >= startDate &&
                a.Date < endDate
            )
            .OrderBy(a => a.CreatedAt)
            .ToListAsync();

        return Ok(activities);
    }

    [HttpPost]
    public async Task<ActionResult<Activity>> Create(
        Activity activity)
    {
        activity.Id = Guid.NewGuid();

        activity.Date = DateTime.SpecifyKind(
            activity.Date.Date,
            DateTimeKind.Utc
        );

        activity.CreatedAt = DateTime.UtcNow;

        _context.Activities.Add(activity);

        await _context.SaveChangesAsync();

        return Ok(activity);
    }

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

        existing.Date = DateTime.SpecifyKind(
            activity.Date.Date,
            DateTimeKind.Utc
        );

        existing.ParentId = activity.ParentId;

        await _context.SaveChangesAsync();

        return Ok(existing);
    }

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