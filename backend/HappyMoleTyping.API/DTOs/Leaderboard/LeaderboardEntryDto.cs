namespace HappyMoleTyping.API.DTOs.Leaderboard;

public class LeaderboardEntryDto
{
    public int Rank { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public int Level { get; set; }
    public long Score { get; set; }
    public decimal Accuracy { get; set; }
    public decimal WPM { get; set; }
    public int MaxCombo { get; set; }
    public DateTime AchievedAt { get; set; }
    public int? LevelId { get; set; }
    public string? LevelName { get; set; }
}

public class RankingDto
{
    public int GlobalRank { get; set; }
    public int LevelRank { get; set; }
    public int DailyRank { get; set; }
    public int WeeklyRank { get; set; }
    public int MonthlyRank { get; set; }
    public long TotalPlayers { get; set; }
    public long LevelPlayers { get; set; }
}

public class LeaderboardResponseDto
{
    public List<LeaderboardEntryDto> Entries { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
    public RankingDto? UserRanking { get; set; }
}