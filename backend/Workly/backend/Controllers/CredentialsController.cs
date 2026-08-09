using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CredentialsController : ControllerBase
{
    private readonly WorklyDbContext _context;

    public CredentialsController(WorklyDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Credential>>> GetAll()
    {
        return await _context.Credentials
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Credential>> Create(
        Credential credential)
    {
        credential.Id = Guid.NewGuid();
        credential.CreatedAt = DateTime.Now;
        credential.UpdatedAt = DateTime.Now;

        _context.Credentials.Add(credential);
        await _context.SaveChangesAsync();

        return Ok(credential);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Credential>> Update(
        Guid id,
        Credential credential)
    {
        var existing = await _context.Credentials.FindAsync(id);

        if (existing == null)
            return NotFound();

        existing.Name = credential.Name;
        existing.Category = credential.Category;
        existing.System = credential.System;
        existing.Environment = credential.Environment;
        existing.Host = credential.Host;
        existing.Port = credential.Port;
        existing.Database = credential.Database;
        existing.Domain = credential.Domain;
        existing.Username = credential.Username;
        existing.Password = credential.Password;
        existing.Url = credential.Url;
        existing.Notes = credential.Notes;
        existing.Favorite = credential.Favorite;
        existing.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    [HttpPatch("{id}/favorite")]
    public async Task<ActionResult<Credential>> ToggleFavorite(
        Guid id)
    {
        var credential =
            await _context.Credentials.FindAsync(id);

        if (credential == null)
            return NotFound();

        credential.Favorite = !credential.Favorite;
        credential.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();

        return Ok(credential);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var credential =
            await _context.Credentials.FindAsync(id);

        if (credential == null)
            return NotFound();

        _context.Credentials.Remove(credential);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("count")]
    public async Task<IActionResult> Count()
    {
        return Ok(
            await _context.Credentials.CountAsync()
        );
    }

    [HttpGet("favorites/count")]
    public async Task<IActionResult> FavoritesCount()
    {
        return Ok(
            await _context.Credentials
                .CountAsync(c => c.Favorite)
        );
    }
}