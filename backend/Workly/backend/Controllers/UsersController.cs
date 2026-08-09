using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly WorklyDbContext _context;

    public UsersController(WorklyDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetById(Guid id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        return Ok(new
        {
            id = user.Id,
            username = user.Username,
            name = user.Name,
            createdAt = user.CreatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        Guid id,
        User user)
    {
        var existing = await _context.Users.FindAsync(id);

        if (existing == null)
            return NotFound();

        existing.Username = user.Username;
        existing.Name = user.Name;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = existing.Id,
            username = existing.Username,
            name = existing.Name,
            createdAt = existing.CreatedAt
        });
    }

    [HttpPut("{id}/password")]
    public async Task<IActionResult> ChangePassword(
        Guid id,
        User user)
    {
        var existing = await _context.Users.FindAsync(id);

        if (existing == null)
            return NotFound();

        existing.Password = user.Password;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Contraseña actualizada correctamente"
        });
    }
}