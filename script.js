const API_URL = "https://oncall-e3it.azurewebsites.net/api/oncall_tickets";

async function fetchOnCallTickets() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch tickets");

        const data = await response.json();
        displayTickets(data);
        updateTicketCount(data.length); 
    } catch (error) {
        document.getElementById("tickets").innerHTML = `<p class="error">⚠️ Failed to load tickets. Please try again later.</p>`;
    }
}

function updateTicketCount(count) {
    document.getElementById("ticket-count").textContent = count;
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

        let description = ticket["Description"] || "No description provided.";
        let shortDescription = description.length > 350 ? description.substring(0, 350) + "..." : description;

        ticketElement.innerHTML = `
            <label>
                <input type="radio" name="selected_ticket" value="${ticket["Ticket ID"]}">
                #${ticket["Ticket Number"]} - ${ticket["Title"]}
            </label>
            <div class="ticket-company">📍 ${ticket["Company Name"]}</div>
            <div class="ticket-meta">🆔 <strong>Ticket ID:</strong> ${ticket["Ticket ID"]} | 🏷 <strong>Status:</strong> ${ticket["Status"]}</div>
            <div class="ticket-meta">🚀 <strong>Priority:</strong> ${ticket["Priority"]} | 👤 <strong>Assigned:</strong> ${ticket["Assigned Resource"]}</div>
            <div class="ticket-meta">📅 <strong>Created:</strong> ${new Date(ticket["Created Date"]).toLocaleString()}</div>
            <div class="ticket-description">
                ✍️ <span class="desc-text">${shortDescription}</span>
                ${description.length > 350 ? `<button class="show-more" data-short="${shortDescription}" data-full="${description}">Show More</button>` : ""}
            </div>
        `;

        ticketContainer.appendChild(ticketElement);
    });

    document.querySelectorAll(".show-more").forEach(button => {
        button.addEventListener("click", function () {
            const descText = this.parentElement.querySelector(".desc-text");
            const isExpanded = this.textContent === "Show Less";

            if (isExpanded) {
                descText.textContent = this.getAttribute("data-short");
                this.textContent = "Show More";
            } else {
                descText.textContent = this.getAttribute("data-full");
                this.textContent = "Show Less";
            }
        });
    });
}

fetchOnCallTickets();
setInterval(fetchOnCallTickets, 60000);
