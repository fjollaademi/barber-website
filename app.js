document.addEventListener("DOMContentLoaded",() => {
    const form=document.querySelector("form");
    const bookingList=document.getElementById("booking-list");
   
const SERVICE_DURATION = {
  "qethje": 30,
  "rruajtje": 15,
  "paketa": 60
};


function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}


    const clearBtn = document.getElementById("clear-btn");

clearBtn.addEventListener("click", () => {
  if (confirm("A jeni i sigurt që doni të fshini të gjitha terminet?")) {
    localStorage.removeItem("bookings"); // fshin të gjitha rezervimet
    renderBookings(); // rifreskon listën
  }
});


    function loadBookings(){
        const data=localStorage.getItem("bookings");
        return data ? JSON.parse(data): [];
    }
    function saveBookings(bookings){
        localStorage.setItem("bookings",JSON.stringify(bookings));
    }

    function renderBookings(){
       let bookings = loadBookings();
    
   
    bookings.sort((a, b) => {
        const dateTimeA = new Date(a.date + "T" + a.time);
        const dateTimeB = new Date(b.date + "T" + b.time);
        return dateTimeA - dateTimeB;
    });
        bookingList.innerHTML="";

        if(bookings.length===0){
            bookingList.innerHTML="<p>Ende nuk ka termine te rezervuara.</p>";
            return;
        }

        
        bookings.forEach((b)=> {
            const div=document.createElement("div");
            div.classList.add("booking-item");
            div.innerHTML=`
            <strong>${b.name}</strong> (${b.phone})<br>
            Sherbimi: ${b.service}<br>
            Data: ${b.date} ora ${b.time}
            `;
            bookingList.appendChild(div);
        });
    }

    form.addEventListener("submit",(e) =>{
        e.preventDefault();

        const name=document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const service = document.getElementById("service").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

    if(!name|| !phone || !date || !time){
        alert("Ju lutem plotesoni te gjitha fushat.");
        return;
    }
   const bookings = loadBookings();

const newStart = timeToMinutes(time);
const newEnd = newStart + SERVICE_DURATION[service];

const conflict = bookings.some(b => {
  const existingStart = timeToMinutes(b.time);
  const existingEnd = existingStart + SERVICE_DURATION[b.service];
  return b.date === date && (newStart < existingEnd && newEnd > existingStart);
});

if (conflict) {
  alert("Ky orar është i zënë! Ju lutem zgjidhni një tjetër.");
  return;
}

// Nëse nuk ka konflikt
bookings.push({ name, phone, service, date, time });
saveBookings(bookings);
renderBookings();
});

