using System.ComponentModel.DataAnnotations;

namespace HappyMoleTyping.API.DTOs.Game;

public class GameSessionDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int LevelId { get; set; }
    public int Score { get; set; }
    public decimal Accuracy { get; set; }
    public int Duration { get; set; }
    public int HitsCount { get; set; }
    public int MissesCount { get; set; }
    public int MaxCombo { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class StartGameRequestDto
{
    [Required(ErrorMessage = "关卡ID不能为空")]
    [Range(1, int.MaxValue, ErrorMessage = "关卡ID必须大于0")]
    public int LevelId { get; set; }
}

public class EndGameRequestDto
{
    [Required(ErrorMessage = "游戏会话ID不能为空")]
    public Guid SessionId { get; set; }

    [Required(ErrorMessage = "分数不能为空")]
    [Range(0, int.MaxValue, ErrorMessage = "分数不能为负数")]
    public int Score { get; set; }

    [Required(ErrorMessage = "准确率不能为空")]
    [Range(0, 100, ErrorMessage = "准确率必须在0-100之间")]
    public decimal Accuracy { get; set; }

    [Required(ErrorMessage = "游戏时长不能为空")]
    [Range(1, int.MaxValue, ErrorMessage = "游戏时长必须大于0")]
    public int Duration { get; set; }

    [Required(ErrorMessage = "击中次数不能为空")]
    [Range(0, int.MaxValue, ErrorMessage = "击中次数不能为负数")]
    public int HitsCount { get; set; }

    [Required(ErrorMessage = "错过次数不能为空")]
    [Range(0, int.MaxValue, ErrorMessage = "错过次数不能为负数")]
    public int MissesCount { get; set; }

    [Required(ErrorMessage = "最大连击不能为空")]
    [Range(0, int.MaxValue, ErrorMessage = "最大连击不能为负数")]
    public int MaxCombo { get; set; }

    public List<GameActionDto> Actions { get; set; } = new();
}

public class GameActionDto
{
    public DateTime Timestamp { get; set; }
    public string ActionType { get; set; } = string.Empty; // "hit", "miss", "spawn"
    public string Character { get; set; } = string.Empty;
    public int Position { get; set; }
    public int ReactionTime { get; set; }
}

public class ValidateGameResultDto
{
    public Guid SessionId { get; set; }
    public string ValidationHash { get; set; } = string.Empty;
    public List<GameActionDto> Actions { get; set; } = new();
}