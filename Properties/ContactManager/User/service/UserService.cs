public class UserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public IEnumerable<User> GetAllUsers() => _context.Users.ToList();

    public User GetUserById(int id) => _context.Users.Find(id);

    public void CreateUser(User user)
    {
        if (_context.Users.Any(c => c.Email == user.Email))
        {
            throw new InvalidOperationException("User already exists!!!!");
        }

        _context.Users.Add(user);
        _context.SaveChanges();
    }

    public void UpdateUser(int id, User updatedUser)
    {
        var existingUser = _context.Users.Find(id);

        if (existingUser == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        if (_context.Users.Any(c => c.Email == updatedUser.Email && c.Id != id))
        {
            throw new InvalidOperationException("Email already exists.");
        }

        existingUser.FirstName = updatedUser.FirstName;
        existingUser.LastName = updatedUser.LastName;
        existingUser.Email = updatedUser.Email;
        existingUser.Password = updatedUser.Password;

        _context.SaveChanges();
    }


    public void DeleteUser(int id)
    {
        var user = _context.Users.Find(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }
    }
}
