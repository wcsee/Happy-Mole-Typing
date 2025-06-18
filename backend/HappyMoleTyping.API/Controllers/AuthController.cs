using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HappyMoleTyping.Core.Interfaces;
using HappyMoleTyping.API.DTOs.Auth;
using System.Security.Claims;

namespace HappyMoleTyping.API.Controllers;

/// <summary>
/// 认证控制器 - 处理用户注册、登录、登出等认证相关操作
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : BaseController
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// 用户注册
    /// </summary>
    /// <param name="request">注册请求信息，包含用户名、邮箱、密码等</param>
    /// <returns>注册成功返回访问令牌和用户信息</returns>
    /// <response code="200">注册成功</response>
    /// <response code="400">请求参数无效或用户已存在</response>
    /// <response code="500">服务器内部错误</response>
    [HttpPost("register")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(typeof(string), 400)]
    [ProducesResponseType(typeof(string), 500)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request.Username, request.Email, request.Password, request.AgreeToTerms);
            return Ok(new { AccessToken = result.AccessToken, RefreshToken = result.RefreshToken, User = result.User });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, "Registration failed");
        }
    }

    /// <summary>
    /// 用户登录
    /// </summary>
    /// <param name="request">登录请求信息，包含用户名/邮箱、密码、记住我选项</param>
    /// <returns>登录成功返回访问令牌和用户信息</returns>
    /// <response code="200">登录成功</response>
    /// <response code="400">用户名或密码错误</response>
    /// <response code="500">服务器内部错误</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(typeof(string), 400)]
    [ProducesResponseType(typeof(string), 500)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var result = await _authService.LoginAsync(request.UsernameOrEmail, request.Password, request.RememberMe);
            return Ok(new { AccessToken = result.AccessToken, RefreshToken = result.RefreshToken, User = result.User });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, "Login failed");
        }
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);
            return Ok(new { AccessToken = result.AccessToken, RefreshToken = result.RefreshToken });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return StatusCode(500, "Token refresh failed");
        }
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
    {
        try
        {
            await _authService.ForgotPasswordAsync(request.Email);
            return Ok(new { Message = "Password reset email sent" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password");
            return StatusCode(500, "Failed to send password reset email");
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
    {
        try
        {
            await _authService.ResetPasswordAsync(request.Token, request.NewPassword);
            return Ok(new { Message = "Password reset successful" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset");
            return StatusCode(500, "Password reset failed");
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        try
        {
            var userId = GetCurrentUserId();
            await _authService.LogoutAsync(userId);
            return Ok(new { Message = "Logout successful" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, "Logout failed");
        }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userId = GetCurrentUserId();
            var user = await _authService.GetCurrentUserAsync(userId);
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return StatusCode(500, "Failed to get user information");
        }
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequestDto request)
    {
        try
        {
            await _authService.VerifyEmailAsync(request.Token);
            return Ok(new { Message = "Email verified successfully" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during email verification");
            return StatusCode(500, "Email verification failed");
        }
    }

    [HttpPost("resend-verification")]
    [Authorize]
    public async Task<IActionResult> ResendVerificationEmail()
    {
        try
        {
            var userId = GetCurrentUserId();
            await _authService.ResendVerificationEmailAsync(userId);
            return Ok(new { Message = "Verification email sent" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resending verification email");
            return StatusCode(500, "Failed to send verification email");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token");
        }
        return userId;
    }
}