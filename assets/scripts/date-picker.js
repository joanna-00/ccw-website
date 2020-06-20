class DatePicker {
  constructor() {
    this.date_picker_element = this.createNewDatePicker();
    this.dates_element = this.date_picker_element.querySelector(".dates");
    this.mth_element = this.date_picker_element.querySelector(
      ".dates .month .mth"
    );
    this.next_mth_element = this.date_picker_element.querySelector(
      ".dates .month .next-mth"
    );
    this.prev_mth_element = this.date_picker_element.querySelector(
      ".dates .month .prev-mth"
    );
    this.days_element = this.date_picker_element.querySelector(".dates .days");
    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    this.currentDate = new Date();
    this.day = this.currentDate.getDay();
    this.month = this.currentDate.getMonth();
    this.year = this.currentDate.getFullYear();
    this.state = {
      selectedDate: this.date,
      selectedDay: this.day,
      selectedMonth: this.month,
      selectedYear: this.year,
    };
  }

  createNewDatePicker() {
    let newDatePicker = document.createElement("div");
    newDatePicker.setAttribute("class", "date-picker");
    newDatePicker.setAttribute("data-value", "");
    newDatePicker.innerHTML += `<p id="dateFullyAvailable">Fully available date</p>
    <p id="datePartiallyBooked">Partially booked date</p>
    <div class="dates">
      <div class="month">
        <div class="arrows prev-mth">
          <i class="fas fa-chevron-left"></i>
        </div>
        <div class="mth"></div>
        <div class="arrows next-mth">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>

      <div class="days"></div>
    </div>`;

    return newDatePicker;
  }

  setUpDatePicker() {
    // console.log(this);
    let goToNextMonth = this.goToNextMonth.bind(this);
    let goToPreviousMonth = this.goToPreviousMonth.bind(this);
    // console.log(goToNextMonth);
    this.mth_element.textContent = this.months[this.month] + " " + this.year;
    this.date_picker_element.dataset.type = "checkout";
    this.next_mth_element.addEventListener("click", goToNextMonth);

    this.prev_mth_element.addEventListener("click", goToPreviousMonth);

    this.populateDays();
  }

  goToNextMonth() {
    this.month++;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    this.mth_element.textContent = this.months[this.month] + " " + this.year;
    this.populateDays();
  }

  goToPreviousMonth() {
    this.month--;
    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }

    this.mth_element.textContent = this.months[this.month] + " " + this.year;
    this.populateDays();
  }

  appendEmptyDays(firstDayOfMonth) {
    for (let i = 1; i < firstDayOfMonth; i++) {
      const empty_day_element = document.createElement("div");
      empty_day_element.classList.add("day");

      this.days_element.appendChild(empty_day_element);
    }
  }

  isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  formatDate(date) {
    let day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let year = date.getFullYear();
    return day + " / " + month + " / " + year;
  }

  populateDays() {
    this.days_element.innerHTML = `                
    <div class="day-week">M</div>
    <div class="day-week">T</div>
    <div class="day-week">W</div>
    <div class="day-week">T</div>
    <div class="day-week">F</div>
    <div class="day-week">S</div>
    <div class="day-week">S</div>
    `;

    let firstDayOfMonth = new Date(this.year, this.month, 1).getDay() || 7;
    this.appendEmptyDays(firstDayOfMonth);

    let amount_days;
    switch (this.months[this.month]) {
      case "January":
        amount_days = 31;
        break;
      case "February":
        if (isLeapYear(year)) {
          amount_days = 29;
        } else {
          amount_days = 28;
        }
        break;
      case "March":
        amount_days = 31;
        break;
      case "April":
        amount_days = 30;
        break;
      case "May":
        amount_days = 31;
        break;
      case "June":
        amount_days = 30;
        break;
      case "July":
        amount_days = 31;
        break;
      case "August":
        amount_days = 31;
        break;
      case "September":
        amount_days = 30;
        break;
      case "October":
        amount_days = 31;
        break;
      case "November":
        amount_days = 30;
        break;
      case "December":
        amount_days = 31;
        break;
    }

    for (let i = 0; i < amount_days; i++) {
      const day_element = document.createElement("div");
      day_element.classList.add("day");
      day_element.textContent = i + 1;
      let day_element_date_value = new Date(this.year, this.month, i + 1);
      day_element.dataset.value = day_element_date_value;

      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (day_element_date_value < yesterday) {
        day_element.classList.add("unavailable");
      }

      if (!day_element.classList.contains("unavailable")) {
        day_element.addEventListener("click", () => {
          this.selectedDate = new Date(this.year, this.month, i + 1);
          this.selectedDay = i + 1;
          this.selectedMonth = this.month;
          this.selectedYear = this.year;

          this.date_picker_element.dataset.value = this.selectedDate;

          if (this.date_picker_element.dataset.type == "checkout") {
            let dropdownTime = this.date_picker_element.parentElement.querySelector(
              ".dropdownTime"
            );
            // console.log(dropdownTime);
            dropdownTime.classList.remove("hidden");
            this.date_picker_element.classList.remove("invalid");
            dropdownTime.parentElement
              .querySelector("label[for=dropdownTime]")
              .classList.remove("hidden");
          }

          this.populateDays();
        });
      }

      if (
        this.selectedDay == i + 1 &&
        this.selectedMonth == this.month &&
        this.selectedYear == this.year
      ) {
        day_element.classList.add("selected");
      }

      this.days_element.appendChild(day_element);
    }
  }
}

// let newDatePicker = new DatePicker();
// // console.log(newDatePicker.createNewDatePicker());
// // console.log(newDatePicker.months);
// console.log(newDatePicker);
// newDatePicker.setUpDatePicker();

// const date_picker_element = $(".date-picker");
// const dates_element = $(".date-picker .dates");
// const mth_element = $(".date-picker .dates .month .mth");
// const next_mth_element = $(".date-picker .dates .month .next-mth ");
// const prev_mth_element = $(".date-picker .dates .month .prev-mth");
// const days_element = $(".date-picker .dates .days");

// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// let date = new Date();
// let day = date.getDate();
// let month = date.getMonth();
// let year = date.getFullYear();

// let selectedDate = date;
// let selectedDay = day;
// let selectedMonth = month;
// let selectedYear = year;

// mth_element.textContent = months[month] + " " + year;

// next_mth_element.addEventListener("click", goToNextMonth);
// prev_mth_element.addEventListener("click", goToPreviousMonth);

// populateDays();

// function customizeDatePickerEvent(callback) {
//   $$(".day_element").forEach((day) => {
//     day.addEventListener("click", callback);
//   });
// }

// function goToNextMonth() {
//   month++;
//   if (month > 11) {
//     month = 0;
//     year++;
//   }
//   mth_element.textContent = months[month] + " " + year;
//   populateDays();
// }

// function goToPreviousMonth() {
//   month--;
//   if (month < 0) {
//     month = 11;
//     year--;
//   }
//   mth_element.textContent = months[month] + " " + year;
//   populateDays();
// }

// function appendEmptyDays(firstDayOfMonth) {
//   for (let i = 1; i < firstDayOfMonth; i++) {
//     const empty_day_element = document.createElement("div");
//     empty_day_element.classList.add("day");

//     days_element.appendChild(empty_day_element);
//   }
// }

// function isLeapYear(year) {
//   return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
// }

// function populateDays() {
//   days_element.innerHTML = `
//   <div class="day-week">M</div>
//   <div class="day-week">T</div>
//   <div class="day-week">W</div>
//   <div class="day-week">T</div>
//   <div class="day-week">F</div>
//   <div class="day-week">S</div>
//   <div class="day-week">S</div>
//   `;

//   let firstDayOfMonth = new Date(year, month, 1).getDay() || 7;
//   appendEmptyDays(firstDayOfMonth);

//   let amount_days;
//   switch (months[month]) {
//     case "January":
//       amount_days = 31;
//       break;
//     case "February":
//       if (isLeapYear(year)) {
//         amount_days = 29;
//       } else {
//         amount_days = 28;
//       }
//       break;
//     case "March":
//       amount_days = 31;
//       break;
//     case "April":
//       amount_days = 30;
//       break;
//     case "May":
//       amount_days = 31;
//       break;
//     case "June":
//       amount_days = 30;
//       break;
//     case "July":
//       amount_days = 31;
//       break;
//     case "August":
//       amount_days = 31;
//       break;
//     case "September":
//       amount_days = 30;
//       break;
//     case "October":
//       amount_days = 31;
//       break;
//     case "November":
//       amount_days = 30;
//       break;
//     case "December":
//       amount_days = 31;
//       break;
//   }

//   for (let i = 0; i < amount_days; i++) {
//     const day_element = document.createElement("div");
//     day_element.classList.add("day");
//     day_element.textContent = i + 1;
//     let day_element_date_value = new Date(year, month, i + 1);
//     day_element.dataset.value = day_element_date_value;

//     let yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     if (day_element_date_value < yesterday) {
//       day_element.classList.add("unavailable");
//     }

//     if (!day_element.classList.contains("unavailable")) {
//       day_element.addEventListener("click", () => {
//         selectedDate = new Date(year, month, i + 1);
//         selectedDay = i + 1;
//         selectedMonth = month;
//         selectedYear = year;

//         date_picker_element.dataset.value = selectedDate;

//         if (date_picker_element.dataset.type == "checkout") {
//           // let dropdownTime;
//           dropdownTime.classList.remove("hidden");
//           date_picker_element.classList.remove("invalid");
//           dropdownTime.parentElement
//             .querySelector("label[for=dropdownTime]")
//             .classList.remove("hidden");
//         }

//         populateDays();
//       });
//     }

//     if (
//       selectedDay == i + 1 &&
//       selectedMonth == month &&
//       selectedYear == year
//     ) {
//       day_element.classList.add("selected");
//     }

//     days_element.appendChild(day_element);
//   }
// }

// function formatDate(date) {
//   let day = date.getDate();
//   if (day < 10) {
//     day = "0" + day;
//   }
//   let month = date.getMonth() + 1;
//   if (month < 10) {
//     month = "0" + month;
//   }
//   let year = date.getFullYear();
//   return day + " / " + month + " / " + year;
// }
