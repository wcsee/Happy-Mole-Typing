using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HappyMoleTyping.Core.Entities;

public class UserAchievement
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    public int AchievementId { get; set; }

    public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;

    public int Progress { get; set; } = 0;

    public bool IsCompleted { get; set; } = false;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(AchievementId))]
    public virtual Achievement Achievement { get; set; } = null!;
}