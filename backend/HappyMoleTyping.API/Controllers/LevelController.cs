using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HappyMoleTyping.Core.Interfaces;
using HappyMoleTyping.API.DTOs.Level;

namespace HappyMoleTyping.API.Controllers;

public class LevelController : BaseController
{
    private readonly ILevelService _levelService;
    private readonly ILogger<LevelController> _logger;

    public LevelController(ILevelService levelService, ILogger<LevelController> logger)
    {
        _levelService = levelService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetLevels([FromQuery] int? difficulty = null, [FromQuery] bool includeInactive = false)
    {
        // TODO: Implement get levels logic
        throw new NotImplementedException();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetLevel(int id)
    {
        // TODO: Implement get level by id logic
        throw new NotImplementedException();
    }

    [HttpGet("{id}/requirements")]
    [Authorize]
    public async Task<IActionResult> GetLevelRequirements(int id)
    {
        // TODO: Implement get level requirements logic
        throw new NotImplementedException();
    }

    [HttpGet("{id}/unlock-status")]
    [Authorize]
    public async Task<IActionResult> GetLevelUnlockStatus(int id)
    {
        // TODO: Implement get level unlock status logic
        throw new NotImplementedException();
    }

    [HttpGet("recommended")]
    [Authorize]
    public async Task<IActionResult> GetRecommendedLevels()
    {
        // TODO: Implement get recommended levels logic
        throw new NotImplementedException();
    }
}