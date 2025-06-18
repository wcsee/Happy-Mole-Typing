using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HappyMoleTyping.Core.Entities;

public class GameSession
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public int LevelId { get; set; }

    public int Score { get; set; } = 0;

    [Column(TypeName = "decimal(5,2)")]
    public decimal Accuracy { get; set; } = 0;

    public int Duration { get; set; } = 0;

    public int HitsCount { get; set; } = 0;

    public int MissesCount { get; set; } = 0;

    public int MaxCombo { get; set; } = 0;

    public bool IsCompleted { get; set; } = false;

    [StringLength(1000)]
    public string? GameData { get; set; }

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(LevelId))]
    public virtual Level Level { get; set; } = null!;
}