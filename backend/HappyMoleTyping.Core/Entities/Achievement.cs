using System.ComponentModel.DataAnnotations;

namespace HappyMoleTyping.Core.Entities;

public class Achievement
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Type { get; set; } = string.Empty; // score, accuracy, combo, level, streak, etc.

    [Required]
    public int RequiredValue { get; set; }

    [StringLength(255)]
    public string? Icon { get; set; }

    public int Points { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}