using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HappyMoleTyping.Core.Entities;

public class Score
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public int LevelId { get; set; }

    [Required]
    public int Value { get; set; }

    [Required]
    [Column(TypeName = "decimal(5,2)")]
    public decimal Accuracy { get; set; }

    [Required]
    [Column(TypeName = "decimal(6,2)")]
    public decimal WPM { get; set; }

    [Required]
    public int Duration { get; set; }

    public int MaxCombo { get; set; } = 0;

    public DateTime AchievedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(LevelId))]
    public virtual Level Level { get; set; } = null!;
}