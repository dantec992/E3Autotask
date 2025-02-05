const API_URL = "https://oncall-e3it.azurewebsites.net/api/oncall_tickets";

async function fetchOnCallTickets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch tickets");

        const data = await response.json();
        displayTickets(data);
    } catch (error) {
        document.getElementById("tickets").innerHTML = `<p class="error">⚠️ Failed to load tickets. Please try again later.</p>`;
    }
}

function displayTickets(tickets) {
    const ticketContainer = document.getElementById("tickets");
    ticketContainer.innerHTML = ""; 

    if (tickets.length === 0) {
        ticketContainer.innerHTML = `<p>No on-call tickets at the moment. 🎉</p>`;
        return;
    }

    tickets.forEach(ticket => {
        const ticketElement = document.createElement("div");
        ticketElement.classList.add("ticket");

        ticketElement.innerHTML = `
            <div class="ticket-title">${ticket["Title"]}</div>
            <div class="ticket-company">📍 ${ticket["Company Name"]}</div>
            <div class="ticket-meta">🆔 Ticket ID: ${ticket["Ticket ID"]} | 🏷 Status: ${ticket["Status"]}</div>
            <div class="ticket-meta">🚀 Priority: ${ticket["Priority"]} | 👤 Assigned: ${ticket["Assigned Resource"]}</div>
            <div class="ticket-meta">📅 Created: ${new Date(ticket["Created Date"]).toLocaleString()}</div>
            <div class="ticket-description">✍️ ${ticket["Description"] || "No description provided."}</div>
        `;

        ticketContainer.appendChild(ticketElement);
    });
}

// Fetch tickets on page load and refresh every 60 seconds
fetchOnCallTickets();
setInterval(fetchOnCallTickets, 60000);
