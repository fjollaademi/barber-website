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

  function getBookings() {
    return JSON.parse(localStorage.getItem("bookings") || "[]");
  }

  function saveBookings(data) {
    localStorage.setItem("bookings", JSON.stringify(data));
  }

  function toMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function showMessage(text, success = false) {
    messageBox.textContent = text;
    messageBox.style.padding = "10px";
    messageBox.style.borderRadius = "10px";
    messageBox.style.textAlign = "center";
    messageBox.style.background = success ? "#2e7d32" : "#c62828";
    messageBox.style.color = "#fff";
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!name || !phone || !date || !time) {
      showMessage("Please fill in all fields.");
      return;
    }

    const start = toMinutes(time);
    const end = start + SERVICE_DURATION[service];
    const bookings = getBookings();

    const conflict = bookings.some(b => {
      if (b.date !== date) return false;
      const s = toMinutes(b.time);
      const e = s + SERVICE_DURATION[b.service];
      return start < e && end > s;
    });

    if (conflict) {
      showMessage("Selected time is unavailable. Please choose another.");
      return;
    }

    bookings.push({ name, phone, service, date, time });
    saveBookings(bookings);

    showMessage("Appointment booked successfully!", true);
    form.reset();
  });
});

