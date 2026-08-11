namespace backend.Models;

public class Activity
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public decimal Percentage { get; set; }

    public decimal Hours { get; set; }

    public DateTime Date { get; set; }

    public Guid? ParentId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Activity? Parent { get; set; }

    public ICollection<Activity> Children { get; set; }
        = new List<Activity>();
}