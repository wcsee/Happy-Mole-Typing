namespace HappyMoleTyping.API.DTOs.User;

public class UserStatisticsDto
{
    public int TotalGamesPlayed { get; set; }
    public int TotalWordsTyped { get; set; }
    public double AverageWPM { get; set; }
    public double AverageAccuracy { get; set; }
    public int HighestWPM { get; set; }
    public double HighestAccuracy { get; set; }
    public long TotalScore { get; set; }
    public int Level { get; set; }
    public int Experience { get; set; }
    public int TotalPlayTime { get; set; } // in seconds
    public int LevelsCompleted { get; set; }
    public int AchievementsUnlocked { get; set; }
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public DateTime? LastGameDate { get; set; }
    public DateTime JoinDate { get; set; }
}