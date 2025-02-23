using System.ComponentModel.DataAnnotations;

public class Contact
{
    public int Id { get; set; }
    public string? Name { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    [RegularExpression(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", ErrorMessage = "Invalid email format.")]
    public string? Email { get; set; }

    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Age { get; set; }
    public string? City { get; set; }
    public string? Job { get; set; }
    public string? Department { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
