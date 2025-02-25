using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly UserService _userService;

    public AuthController(AuthService authService, UserService userService)
    {
        _authService = authService;
        _userService = userService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _userService.GetAllUsers().FirstOrDefault(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var token = _authService.GenerateJwtToken(user);

        return Ok(new
        {
            message = "Login successful",
            token,
            user
        });
    }
}

public class LoginRequest
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}
