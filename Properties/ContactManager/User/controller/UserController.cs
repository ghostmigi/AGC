using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAllUsers() => Ok(_userService.GetAllUsers());

    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetUser(int id)
    {
        var user = _userService.GetUserById(id);
        return user != null ? Ok(user) : NotFound();
    }

    [HttpPost]
    public IActionResult CreateUser(User user)
    {
        _userService.CreateUser(user);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult UpdateUser(int id, [FromBody] User updatedUser)
    {
        try
        {
            _userService.UpdateUser(id, updatedUser);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound("User not found.");
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }


    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteUser(int id)
    {
        _userService.DeleteUser(id);
        return NoContent();
    }
}