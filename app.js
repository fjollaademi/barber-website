document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  const messageBox = document.createElement("div");
  messageBox.style.marginTop = "15px";
  form.after(messageBox);

  const SERVICE_DURATION = {
    "Haircut": 30,
    "Shave": 15,
    "Haircut + Shave": 45
  };

  function loadBookings() {
    const data = localStorage.getItem("bookings");
    return data ? JSON.parse(data) : [];
  }

  function saveBookings(bookings) {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }

  function timeToMinutes(time) {
    
    const [h, m] = time.slice(0, 5).split(":").map(Number);
    return h * 60 + m;
  }

  function showMessage(text, type = "error") {
    messageBox.textContent = text;
    messageBox.style.padding = "10px";
    messageBox.style.borderRadius = "8px";
    messageBox.style.fontWeight = "500";
    messageBox.style.textAlign = "center";

    if (type === "success") {
      messageBox.style.background = "#2e7d32";
      messageBox.style.color = "#fff";
    } else {
      messageBox.style.background = "#c62828";
      messageBox.style.color = "#fff";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!name || !phone || !date || !time) {
      showMessage("Please complete all data.");
      return;
    }

    const newStart = timeToMinutes(time);
    const newEnd = newStart + SERVICE_DURATION[service];
    const bookings = loadBookings();

    const conflict = bookings.some(b => {
      if (b.date !== date) return false;
      const existingStart = timeToMinutes(b.time);
      const existingEnd = existingStart + SERVICE_DURATION[b.service];
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflict) {
      showMessage("The selected time is unavailable! Plese choose another one.");
      return;
    }

    bookings.push({ name, phone, service, date, time });
    saveBookings(bookings);

    showMessage("The reservesion success!", "success");
    form.reset();
  });
});

