<script>
  let currentDate = new Date();
  let selectedDate = null;

  function selectDate(day) {
    selectedDate = day;
  }

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getMonthData(year, month) {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    const endDate = new Date(lastDayOfMonth);
    const monthData = [];

    while (startDate <= endDate) {
      monthData.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    return monthData;
  }

  function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
</script>


<style>
  .calendar {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .month {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }

  .day {
    text-align: center;
    padding: 5px;
    cursor: pointer;
  }

  .day:hover {
    background-color: #f0f0f0;
  }

  .selected {
    background-color: #007bff;
    color: #fff;
    border-radius: 50%;
  }
</style>

<div class="calendar">
  <div class="month">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</div>
  <div>
    <button on:click={prevMonth}>Previous</button>
    <button on:click={nextMonth}>Next</button>
  </div>
  <div class="days">
    {#each getMonthData(currentDate.getFullYear(), currentDate.getMonth()) as day}
      <div
        class="day {isSameDay(day, selectedDate) ? 'selected' : ''}"
        on:click={() => selectDate(day)}
      >
        {day.getDate()}
      </div>
    {/each}
  </div>
  <p>Selected Date: {selectedDate ? selectedDate.toDateString() : 'None'}</p>
</div>