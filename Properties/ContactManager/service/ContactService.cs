public class ContactService
{
    private readonly AppDbContext _context;

    public ContactService(AppDbContext context)
    {
        _context = context;
    }

    public IEnumerable<Contact> GetAllContacts() => _context.Contacts.ToList();

    public Contact GetContactById(int id) => _context.Contacts.Find(id);

    public void CreateContact(Contact contact)
    {
        if (_context.Contacts.Any(c => c.Email == contact.Email))
        {
            throw new InvalidOperationException("Email already exists.");
        }

        _context.Contacts.Add(contact);
        _context.SaveChanges();
    }

    public void UpdateContact(int id, Contact updatedContact)
    {
        var existingContact = _context.Contacts.Find(id);

        if (existingContact == null)
        {
            throw new KeyNotFoundException("Contact not found.");
        }

        // Check if the new email already exists in another contact
        if (_context.Contacts.Any(c => c.Email == updatedContact.Email && c.Id != id))
        {
            throw new InvalidOperationException("Email already exists.");
        }

        // Update the contact fields
        existingContact.Name = updatedContact.Name;
        existingContact.Email = updatedContact.Email;
        existingContact.Phone = updatedContact.Phone;
        existingContact.Address = updatedContact.Address;
        existingContact.City = updatedContact.City;
        existingContact.Job = updatedContact.Job;
        existingContact.Department = updatedContact.Department;

        _context.SaveChanges();
    }


    public void DeleteContact(int id)
    {
        var contact = _context.Contacts.Find(id);
        if (contact != null)
        {
            _context.Contacts.Remove(contact);
            _context.SaveChanges();
        }
    }
}
