namespace HappyMoleTyping.API.DTOs.Level;

public class LevelDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Difficulty { get; set; }
    public string DifficultyName { get; set; } = string.Empty;
    public int MaxMoles { get; set; }
    public decimal MoleSpeed { get; set; }
    public int TimeLimit { get; set; }
    public int TargetScore { get; set; }
    public int? UnlockLevel { get; set; }
    public string CharacterSet { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool IsUnlocked { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class LevelRequirementsDto
{
    public int LevelId { get; set; }
    public string LevelName { get; set; } = string.Empty;
    public int RequiredLevel { get; set; }
    public int RequiredScore { get; set; }
    public List<int> PrerequisiteLevels { get; set; } = new();
    public bool IsUnlocked { get; set; }
    public string UnlockMessage { get; set; } = string.Empty;
}

public class LevelUnlockStatusDto
{
    public int LevelId { get; set; }
    public bool IsUnlocked { get; set; }
    public int CurrentUserLevel { get; set; }
    public int RequiredLevel { get; set; }
    public long CurrentUserScore { get; set; }
    public int RequiredScore { get; set; }
    public List<int> CompletedPrerequisites { get; set; } = new();
    public List<int> MissingPrerequisites { get; set; } = new();
    public string UnlockMessage { get; set; } = string.Empty;
}