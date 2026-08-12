using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeetingsController : ControllerBase
{
    private readonly WorklyDbContext _context;

    public MeetingsController(WorklyDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Meeting>>> GetAll()
    {
        return await _context.Meetings
            .OrderByDescending(m => m.Date)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Meeting>> Create(Meeting meeting)
    {
        meeting.Id = Guid.NewGuid();

        meeting.Date = DateTime.SpecifyKind(
            meeting.Date,
            DateTimeKind.Utc
        );

        meeting.CreatedAt = DateTime.UtcNow;
        meeting.UpdatedAt = DateTime.UtcNow;

        if (string.IsNullOrWhiteSpace(meeting.Status))
        {
            meeting.Status = "Pendiente";
        }

        _context.Meetings.Add(meeting);

        await _context.SaveChangesAsync();

        return Ok(meeting);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Meeting>> Update(
        Guid id,
        Meeting meeting)
    {
        var existing = await _context.Meetings.FindAsync(id);

        if (existing == null)
            return NotFound();

        existing.Title = meeting.Title;
        existing.Notes = meeting.Notes;

        existing.Date = DateTime.SpecifyKind(
            meeting.Date,
            DateTimeKind.Utc
        );

        existing.Status = string.IsNullOrWhiteSpace(
            meeting.Status
        )
            ? "Pendiente"
            : meeting.Status;

        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var meeting = await _context.Meetings.FindAsync(id);

        if (meeting == null)
            return NotFound();

        _context.Meetings.Remove(meeting);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}