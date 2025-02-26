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
    const ticketCount = document.getElementById("ticket-count");
    
    ticketContainer.innerHTML = ""; 
    ticketCount.textContent = tickets.length; 

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
                ${description.length > 350 ? `<button class="show-more">Show More</button>` : ""}
            </div>
        `;

        ticketContainer.appendChild(ticketElement);
    });

    // Add event listener to "Show More" buttons
    document.querySelectorAll(".show-more").forEach(button => {
        button.addEventListener("click", function () {
            const parent = this.parentElement;
            const descText = parent.querySelector(".desc-text");

            if (this.textContent === "Show More") {
                descText.textContent = tickets.find(ticket => ticket["Description"] === descText.textContent.slice(0, 350) + "...")["Description"];
                this.textContent = "Show Less";
            } else {
                descText.textContent = descText.textContent.substring(0, 350) + "...";
                this.textContent = "Show More";
            }
        });
    });
}
