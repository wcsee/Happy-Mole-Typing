using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HappyMoleTyping.Core.Interfaces;
using HappyMoleTyping.API.DTOs.Game;

namespace HappyMoleTyping.API.Controllers;

[Authorize]
public class GameController : BaseController
{
    private readonly IGameService _gameService;
    private readonly ILogger<GameController> _logger;

    public GameController(IGameService gameService, ILogger<GameController> logger)
    {
        _gameService = gameService;
        _logger = logger;
    }

    [HttpPost("start")]
    public async Task<IActionResult> StartGame([FromBody] StartGameRequestDto request)
    {
        // TODO: Implement start game logic
        throw new NotImplementedException();
    }

    [HttpPost("end")]
    public async Task<IActionResult> EndGame([FromBody] EndGameRequestDto request)
    {
        // TODO: Implement end game logic
        throw new NotImplementedException();
    }

    [HttpGet("session/{sessionId}")]
    public async Task<IActionResult> GetGameSession(Guid sessionId)
    {
        // TODO: Implement get game session logic
        throw new NotImplementedException();
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetGameHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        // TODO: Implement get game history logic
        throw new NotImplementedException();
    }

    [HttpPost("validate-result")]
    public async Task<IActionResult> ValidateGameResult([FromBody] ValidateGameResultDto request)
    {
        // TODO: Implement game result validation logic
        throw new NotImplementedException();
    }
}