using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ContactService _contactService;

    public ContactController(ContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpGet]
    public IActionResult GetAllContacts() => Ok(_contactService.GetAllContacts());

    [HttpGet("{id}")]
    public IActionResult GetContact(int id)
    {
        var contact = _contactService.GetContactById(id);
        return contact != null ? Ok(contact) : NotFound();
    }

    [HttpPost]
    public IActionResult CreateContact(Contact contact)
    {
        _contactService.CreateContact(contact);
        return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateContact(int id, [FromBody] Contact updatedContact)
    {
        try
        {
            _contactService.UpdateContact(id, updatedContact);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Contact not found.");
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }


    [HttpDelete("{id}")]
    public IActionResult DeleteContact(int id)
    {
        _contactService.DeleteContact(id);
        return NoContent();
    }
}