using System.ComponentModel.DataAnnotations;

namespace HappyMoleTyping.API.DTOs.User;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int Level { get; set; }
    public long TotalScore { get; set; }
    public int Experience { get; set; }
    public bool IsEmailVerified { get; set; }
    public string? Avatar { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}