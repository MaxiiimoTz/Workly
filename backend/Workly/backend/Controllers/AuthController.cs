using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly WorklyDbContext _context;

    public AuthController(WorklyDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(User login)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Username == login.Username &&
                u.Password == login.Password);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Usuario o contraseña incorrectos"
            });
        }

        return Ok(new
        {
            id = user.Id,
            username = user.Username,
            name = user.Name
        });
    }
}