using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class WorklyDbContext : DbContext
{
    public WorklyDbContext(
        DbContextOptions<WorklyDbContext> options)
        : base(options)
    {
    }

    public DbSet<Record> Records => Set<Record>();

    public DbSet<Credential> Credentials => Set<Credential>();

    public DbSet<User> Users => Set<User>();

    public DbSet<Activity> Activities => Set<Activity>();

    public DbSet<Meeting> Meetings => Set<Meeting>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Activity>()
            .HasKey(a => a.Id);

        modelBuilder.Entity<Activity>()
            .Property(a => a.Title)
            .IsRequired();

        modelBuilder.Entity<Activity>()
            .Property(a => a.Percentage)
            .HasPrecision(5, 2);

        modelBuilder.Entity<Activity>()
            .Property(a => a.Hours)
            .HasPrecision(5, 2);

        modelBuilder.Entity<Activity>()
            .HasOne(a => a.Parent)
            .WithMany(a => a.Children)
            .HasForeignKey(a => a.ParentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Meeting>()
            .HasKey(m => m.Id);

        modelBuilder.Entity<Meeting>()
            .Property(m => m.Title)
            .IsRequired();

        modelBuilder.Entity<Meeting>()
            .Property(m => m.Notes)
            .HasDefaultValue("");

        modelBuilder.Entity<Meeting>()
            .Property(m => m.Status)
            .HasDefaultValue("Pendiente");
    }
}