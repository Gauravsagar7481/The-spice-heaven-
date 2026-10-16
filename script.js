
/* =========================================
   THE SPICE HAVEN — WEBORA STUDIO
   Website interactions
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  // 1. MOBILE NAVIGATION

  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {

    menuToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    // Close navigation after clicking a link.

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
      });
    });

    // Close navigation if the screen becomes desktop-sized.

    window.addEventListener("resize", function () {
      if (window.innerWidth > 700) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
      }
    });
  }


  // 2. MENU CATEGORY FILTERS

  const filterButtons = document.querySelectorAll(".filter");
  const foodCards = document.querySelectorAll(".food-card");

  filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const selectedCategory = button.dataset.filter;

      // Highlight the selected filter.

      filterButtons.forEach(function (filterButton) {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");

      // Show matching dishes.

      foodCards.forEach(function (card) {

        const category = card.dataset.category;

        if (
          selectedCategory === "all" ||
          selectedCategory === category
        ) {
          card.hidden = false;
        } else {
          card.hidden = true;
        }

      });

    });

  });


  // 3. SET THE CURRENT YEAR IN THE FOOTER

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // 4. PREVENT PAST RESERVATION DATES

  const bookingDate = document.getElementById("bookingDate");

  function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
  }

  if (bookingDate) {
    bookingDate.min = getLocalDate();
  }


  // 5. RESERVATION ENQUIRY FORM

  const bookingForm = document.getElementById("bookingForm");
  const formStatus = document.getElementById("formStatus");

  if (bookingForm && formStatus) {

    bookingForm.addEventListener("submit", function (event) {

      // Stop the browser from reloading the page.

      event.preventDefault();

      formStatus.className = "form-status";
      formStatus.textContent = "";

      const name = document.getElementById("guestName").value.trim();
      const phone = document.getElementById("guestPhone").value.trim();
      const date = document.getElementById("bookingDate").value;
      const time = document.getElementById("bookingTime").value;
      const guests = document.getElementById("guestCount").value;
      const note = document.getElementById("guestNote").value.trim();

      // Check required fields.

      if (!name || !phone || !date || !time || !guests) {
        showMessage(
          "Please complete all required fields.",
          "error"
        );
        return;
      }

      // Validate the phone number format.
      // Accepts international prefixes and common phone formats.

      const cleanedPhone = phone.replace(/[\s()-]/g, "");

      if (!/^\+?[0-9]{7,15}$/.test(cleanedPhone)) {
        showMessage(
          "Please enter a valid phone number.",
          "error"
        );
        return;
      }

      // Check that the date is not in the past.

      if (date < getLocalDate()) {
        showMessage(
          "Please select today or a future date.",
          "error"
        );
        return;
      }

      // Prepare the enquiry message.

      const message = [
        "Hello, I would like to enquire about a table at The Spice Haven.",
        "",
        "Name: " + name,
        "Phone: " + phone,
        "Date: " + date,
        "Preferred time: " + time,
        "Guests: " + guests,
        "Additional notes: " + (note || "None"),
        "",
        "Please confirm availability. Thank you."
      ].join("\n");

      /*
        IMPORTANT:
        Replace the placeholder below with the restaurant's
        real WhatsApp number, including country code without +.
        Example format for India: 919876543210

        Leave it empty until you have permission to use the number.
      */

      const WHATSAPP_NUMBER = "";

      if (WHATSAPP_NUMBER.trim() !== "") {

        if (!/^[0-9]{8,15}$/.test(WHATSAPP_NUMBER)) {
          showMessage(
            "The WhatsApp number is not configured correctly.",
            "error"
          );
          return;
        }

        const whatsappURL =
          "https://wa.me/" +
          WHATSAPP_NUMBER +
          "?text=" +
          encodeURIComponent(message);

        // Open WhatsApp with a pre-filled message.
        // The user must press Send in WhatsApp.

        const whatsappWindow = window.open(
          whatsappURL,
          "_blank",
          "noopener,noreferrer"
        );

        if (whatsappWindow) {
          showMessage(
            "Your enquiry is prepared. Review it in WhatsApp and press Send to submit it.",
            "success"
          );
        } else {
          showMessage(
            "Your enquiry is prepared, but the browser blocked the new window. Enable pop-ups or use the website's WhatsApp link.",
            "error"
          );
        }

      } else {

        /*
          Demo mode:
          No message is sent or stored.
          Show a confirmation for portfolio demonstration only.
        */

        showMessage(
          "Demo only: your form was checked, but no booking was sent or saved. Configure the restaurant's WhatsApp number to send an enquiry.",
          "success"
        );

        console.log("Sample reservation enquiry:", message);
      }

    });

    function showMessage(message, type) {
      formStatus.textContent = message;
      formStatus.className = "form-status " + type;
    }

  }

});
