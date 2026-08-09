using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class WorklyDbContext : DbContext
{
    public WorklyDbContext(DbContextOptions<WorklyDbContext> options)
        : base(options)
    {
    }

    public DbSet<Record> Records => Set<Record>();
    public DbSet<Credential> Credentials => Set<Credential>();
    public DbSet<User> Users => Set<User>();
}