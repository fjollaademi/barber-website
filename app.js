document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");

  const SERVICE_DURATION = {
    "Prerje": 30,
    "Rruajtje": 15,
    "Prerje + Rruajtje": 45
  };

  function loadBookings() {
    const data = localStorage.getItem("bookings");
    return data ? JSON.parse(data) : [];
  }

  function saveBookings(bookings) {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }

  function timeToMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!name || !phone || !date || !time) {
      alert("Ju lutem plotësoni të gjitha fushat.");
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
      alert("Ky orar është i zënë! Ju lutem zgjidhni një tjetër.");
      return;
    }

    bookings.push({ name, phone, service, date, time });
    saveBookings(bookings);

    alert("Rezervimi u bë me sukses!");
    form.reset();
  });
});
