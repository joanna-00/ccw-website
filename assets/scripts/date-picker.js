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
    let goToNextMonth = this.goToNextMonth.bind(this);
    let goToPreviousMonth = this.goToPreviousMonth.bind(this);

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
