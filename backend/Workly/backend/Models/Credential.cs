namespace backend.Models;

public class Credential
{
    public Guid Id { get; set; }

    public string Name { get; set; } = "";

    public string Category { get; set; } = "";

    public string System { get; set; } = "";

    public string Environment { get; set; } = "";

    public string Host { get; set; } = "";

    public string Port { get; set; } = "";

    public string Database { get; set; } = "";

    public string Domain { get; set; } = "";

    public string Username { get; set; } = "";

    public string Password { get; set; } = "";

    public string Url { get; set; } = "";

    public string Notes { get; set; } = "";

    public bool Favorite { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}