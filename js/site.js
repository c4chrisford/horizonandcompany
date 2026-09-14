/* =========================================
   HORIZON & COMPANY
   Shared Site JavaScript
   ========================================= */


/* PACKAGE CARDS */

function toggleActive(element) {

  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.classList.remove("active");
  });

  element.classList.add("active");

}


/* MOBILE MENU */

function toggleMobileMenu() {

  const menu = document.getElementById("nav-menu");

  if (menu) {
    menu.classList.toggle("active");
  }

}


function closeMobileMenu() {

  if (window.innerWidth <= 900) {

    const menu = document.getElementById("nav-menu");

    if (menu) {
      menu.classList.remove("active");
    }

  }

}


/* MOBILE DROPDOWN */

function toggleMobileDropdown(element) {

  if (window.innerWidth <= 900) {
    element.classList.toggle("active");
  }

}


/* FAQ */

function toggleFAQ(element) {

  const item = element.parentElement;

  document
    .querySelectorAll(".faq-item")
    .forEach(faq => {

      if (faq !== item) {
        faq.classList.remove("active");
      }

    });

  item.classList.toggle("active");

}


/* CONTACT FORM */

const contactForm = document.getElementById("horizon-contact-form");

if (contactForm) {

  contactForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const submitBtn = document.getElementById("submit-btn");

    if (!submitBtn) {
      return;
    }

    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    const portalId = "147975706";
    const formId = "a57bfb7d-d14e-4b3f-8128-8b35a508b15b";

    const url =
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

    const data = {

      fields: [

        {
          name: "firstname",
          value: document.getElementById("firstname")?.value || ""
        },

        {
          name: "lastname",
          value: document.getElementById("lastname")?.value || ""
        },

        {
          name: "email",
          value: document.getElementById("email")?.value || ""
        },

        {
          name: "phone_from_form",
          value: document.getElementById("phone")?.value || ""
        },

        {
          name: "wedding_date",
          value: document.getElementById("wedding_date")?.value || ""
        },

        {
          name: "wedding_venue",
          value: document.getElementById("venue")?.value || ""
        },

        {
          name: "collection_of_interest",
          value: document.getElementById("collection")?.value || ""
        },

        {
          name: "enquiry_stage",
          value: "new_enquiry"
        },

        {
          name: "message",
          value: document.getElementById("message")?.value || ""
        }

      ]

    };

    fetch(url, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)

    })

    .then(async response => {

      if (response.ok) {

        contactForm.reset();

        submitBtn.style.display = "none";

        const successMessage =
          document.getElementById("form-success");

        if (successMessage) {
          successMessage.style.display = "block";
        }

      } else {

        submitBtn.innerText = "Request Availability";
        submitBtn.disabled = false;

        alert(
          "Error sending form. Please email hello@horizonandcompany.com directly."
        );

      }

    })

    .catch(() => {

      submitBtn.innerText = "Request Availability";
      submitBtn.disabled = false;

      alert(
        "Network error. Please email hello@horizonandcompany.com directly."
      );

    });

  });

}
