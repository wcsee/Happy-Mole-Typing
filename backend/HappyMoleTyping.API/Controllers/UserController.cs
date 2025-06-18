using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HappyMoleTyping.Core.Interfaces;
using HappyMoleTyping.API.DTOs.User;

namespace HappyMoleTyping.API.Controllers;

[Authorize]
public class UserController : BaseController
{
    private readonly IUserService _userService;
    private readonly ILogger<UserController> _logger;

    public UserController(IUserService userService, ILogger<UserController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        // TODO: Implement get profile logic
        throw new NotImplementedException();
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto request)
    {
        // TODO: Implement update profile logic
        throw new NotImplementedException();
    }

    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
        // TODO: Implement get statistics logic
        throw new NotImplementedException();
    }

    [HttpGet("achievements")]
    public async Task<IActionResult> GetAchievements()
    {
        // TODO: Implement get achievements logic
        throw new NotImplementedException();
    }

    [HttpPost("avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        // TODO: Implement avatar upload logic
        throw new NotImplementedException();
    }

    [HttpDelete("avatar")]
    public async Task<IActionResult> DeleteAvatar()
    {
        // TODO: Implement avatar deletion logic
        throw new NotImplementedException();
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserById(Guid userId)
    {
        // TODO: Implement get user by id logic
        throw new NotImplementedException();
    }
}