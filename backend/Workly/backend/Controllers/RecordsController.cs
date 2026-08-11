using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecordsController : ControllerBase
{
    private readonly WorklyDbContext _context;

    public RecordsController(WorklyDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Record>>> GetAll()
    {
        return await _context.Records
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Record>> Create(Record record)
    {
        record.Id = Guid.NewGuid();

        record.CreatedAt = DateTime.UtcNow;
        record.UpdatedAt = DateTime.UtcNow;

        // Si no se envía un estado, se crea como Pendiente
        if (string.IsNullOrWhiteSpace(record.Status))
        {
            record.Status = "Pendiente";
        }

        _context.Records.Add(record);

        await _context.SaveChangesAsync();

        return Ok(record);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Record>> Update(
        Guid id,
        Record record)
    {
        var existing = await _context.Records.FindAsync(id);

        if (existing == null)
            return NotFound();

        existing.Title = record.Title;
        existing.Description = record.Description;
        existing.Type = record.Type;
        existing.Favorite = record.Favorite;

        // Actualizar estado
        existing.Status = string.IsNullOrWhiteSpace(record.Status)
            ? "Pendiente"
            : record.Status;

        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    [HttpPatch("{id}/favorite")]
    public async Task<ActionResult<Record>> ToggleFavorite(Guid id)
    {
        var record = await _context.Records.FindAsync(id);

        if (record == null)
            return NotFound();

        record.Favorite = !record.Favorite;
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(record);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var record = await _context.Records.FindAsync(id);

        if (record == null)
            return NotFound();

        _context.Records.Remove(record);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("count")]
    public async Task<IActionResult> Count()
    {
        return Ok(
            await _context.Records.CountAsync()
        );
    }

    [HttpGet("favorites/count")]
    public async Task<IActionResult> FavoritesCount()
    {
        return Ok(
            await _context.Records.CountAsync(
                r => r.Favorite
            )
        );
    }
}