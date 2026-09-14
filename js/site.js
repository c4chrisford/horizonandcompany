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

    const firstName =
      document.getElementById("firstname")?.value || "";

    const lastName =
      document.getElementById("lastname")?.value || "";

    const email =
      document.getElementById("email")?.value || "";

    const phone =
      document.getElementById("phone")?.value || "";

    const weddingDate =
      document.getElementById("wedding_date")?.value || "";

    const venue =
      document.getElementById("venue")?.value || "";

    const collection =
      document.getElementById("collection")?.value || "";

    const message =
      document.getElementById("message")?.value || "";

    const data = {

      fields: [

        {
          name: "firstname",
          value: firstName
        },

        {
          name: "lastname",
          value: lastName
        },

        {
          name: "email",
          value: email
        },

        {
          name: "phone",
          value: phone
        },

        {
          name: "wedding_date",
          value: weddingDate
        },

        {
          name: "venue",
          value: venue
        },

        {
          name: "collection",
          value: collection
        },

        {
          name: "message",
          value: message
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
