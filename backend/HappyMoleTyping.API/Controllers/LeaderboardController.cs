using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HappyMoleTyping.Core.Interfaces;
using HappyMoleTyping.API.DTOs.Leaderboard;

namespace HappyMoleTyping.API.Controllers;

public class LeaderboardController : BaseController
{
    private readonly ILeaderboardService _leaderboardService;
    private readonly ILogger<LeaderboardController> _logger;

    public LeaderboardController(ILeaderboardService leaderboardService, ILogger<LeaderboardController> logger)
    {
        _leaderboardService = leaderboardService;
        _logger = logger;
    }

    [HttpGet("global")]
    public async Task<IActionResult> GetGlobalLeaderboard([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        // TODO: Implement global leaderboard logic
        throw new NotImplementedException();
    }

    [HttpGet("level/{levelId}")]
    public async Task<IActionResult> GetLevelLeaderboard(int levelId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        // TODO: Implement level leaderboard logic
        throw new NotImplementedException();
    }

    [HttpGet("daily")]
    public async Task<IActionResult> GetDailyLeaderboard([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        // TODO: Implement daily leaderboard logic
        throw new NotImplementedException();
    }

    [HttpGet("weekly")]
    public async Task<IActionResult> GetWeeklyLeaderboard([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        // TODO: Implement weekly leaderboard logic
        throw new NotImplementedException();
    }

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthlyLeaderboard([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        // TODO: Implement monthly leaderboard logic
        throw new NotImplementedException();
    }

    [HttpGet("user/{userId}/rank")]
    [Authorize]
    public async Task<IActionResult> GetUserRank(Guid userId)
    {
        // TODO: Implement user rank logic
        throw new NotImplementedException();
    }
}