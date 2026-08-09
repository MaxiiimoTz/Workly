namespace backend.Models;

public class Record
{
    public Guid Id { get; set; }

    public string Title { get; set; } = "";

    public string Description { get; set; } = "";

    public string Type { get; set; } = "";

    public bool Favorite { get; set; }

    public string Status { get; set; } = "Pendiente";

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}