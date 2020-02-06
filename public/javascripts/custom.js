// Custom JavaScript

/**
 * Checkbox tickets
 */

//  Selektovanje elementa
let checkBox = document.querySelectorAll(".checkbox-custom");
let ticketNumDiv = document.getElementById("tickets_number");
let ticketPriceDiv = document.getElementById("tickets_price");
let hiddenPrice = document.getElementById("ticket_hidden_price");


// Metode za dodavanje, brisanje i azuriranje broja i ukupne cene karata za stranicu
// rezervacije
let tickets = {
  numberOfTickets: 0,
  addTicket: function() {
    this.numberOfTickets++;
  },
  removeTicket: function() {
    this.numberOfTickets--;
  },
  updateTicket: function() {
    ticketNumDiv.innerHTML = this.numberOfTickets;
    ticketPriceDiv.innerHTML = 250 * this.numberOfTickets;
    hiddenPrice.value = 250 * this.numberOfTickets;
  }
};

// Prolazak kroz svako sediste i dodavanje event listenera za svako od njih
// na promenu (change)  gde se poziva odredjena metoda u zavisnosti od toga
// da li je sediste selektovano ili ne. I nakon toga uvek ide azuriranje polja
// na u template-u.

checkBox.forEach(checkbox => {
  checkbox.addEventListener("change", function(e) {
    this.checked ? tickets.addTicket() : tickets.removeTicket();
    tickets.updateTicket();
  });
});
