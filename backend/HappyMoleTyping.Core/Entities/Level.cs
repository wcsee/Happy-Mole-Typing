using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HappyMoleTyping.Core.Entities;

public class Level
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public int Difficulty { get; set; }

    [Required]
    public int MaxMoles { get; set; }

    [Required]
    [Column(TypeName = "decimal(5,2)")]
    public decimal MoleSpeed { get; set; }

    [Required]
    public int TimeLimit { get; set; }

    [Required]
    public int TargetScore { get; set; }

    public int? UnlockLevel { get; set; }

    [Required]
    [StringLength(255)]
    public string CharacterSet { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<GameSession> GameSessions { get; set; } = new List<GameSession>();
    public virtual ICollection<Score> Scores { get; set; } = new List<Score>();
}