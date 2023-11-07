const baseURL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const cohortName = "2308-ACC-ET-WEB-PT-B";
const resource = "events";

// Function to fetch all events and render them on the page
async function renderEvents() {
  try {
    const response = await fetch(`${baseURL}/${cohortName}/${resource}`);
    const data = await response.json();
    const events = data.data;

    const eventList = document.getElementById("party-list");
    eventList.innerHTML = ''; // Clear the existing list

    events.forEach((event) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <strong>Name:</strong> ${event.name}<br>
        <strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}<br>
        <strong>Time:</strong> ${new Date(event.date).toLocaleTimeString()}<br>
        <strong>Location:</strong> ${event.location}<br>
        <strong>Description:</strong> ${event.description}<br>
        <button onclick="deleteEvent(${event.id})">Delete</button>
      `;

      eventList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching and rendering events:", error);
  }
}

// Function to delete an event by ID
async function deleteEvent(eventId) {
  try {
    const response = await fetch(`${baseURL}/${cohortName}/${resource}/${eventId}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      // Deletion successful, remove the event from the list
      const eventItem = document.querySelector(`li[data-event-id="${eventId}"]`);
      if (eventItem) {
        eventItem.remove();
      } else {
        console.log("Event not found in the list.");
      }
    } else {
      console.log("Event deletion failed.");
    }
  } catch (error) {
    console.error("Error deleting event by ID:", error);
  }
}

// Initialize the page by rendering events from the API
document.addEventListener("DOMContentLoaded", () => {
  renderEvents();
});

// Function to handle form submission for adding a new event
async function handleEventFormSubmission(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  const newEventData = {
    name,
    description,
    date,
    location,
  };

  try {
    const response = await fetch(`${baseURL}/${cohortName}/${resource}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEventData),
    });

    if (response.status === 201) {
      // Event creation successful, update the list of events and clear the form
      renderEvents(); // Refresh the event list
      document.getElementById("event-form").reset(); // Clear the form fields
    } else {
      console.log("Event creation failed.");
    }
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

// Attach the form submission handler
const eventForm = document.getElementById("event-form");
eventForm.addEventListener("submit", handleEventFormSubmission);
