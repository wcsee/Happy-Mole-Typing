using Microsoft.AspNetCore.Mvc;

namespace HappyMoleTyping.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected IActionResult HandleResult<T>(T result)
    {
        if (result == null)
            return NotFound();
        
        return Ok(result);
    }

    protected IActionResult HandleResult<T>(T result, string errorMessage)
    {
        if (result == null)
            return BadRequest(errorMessage);
        
        return Ok(result);
    }

    protected string GetUserId()
    {
        return User.FindFirst("userId")?.Value ?? string.Empty;
    }

    protected bool IsAuthenticated()
    {
        return User.Identity?.IsAuthenticated ?? false;
    }
}