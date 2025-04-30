
// how to draw a graph in canvas with javascript!?


const myCanvas = document.querySelector('#my-canva')
const dateContainer = document.querySelector('.dates-container')

const display = document.querySelector('.output-log')
const inputs = document.querySelector('#date-input')
const doneBt = document.querySelector('#done-btn')

const today = new Date()
let weekDates = []

// const ctx = myCanvas.getContext('2d')
// console.log(ctx)

// const todayDate = today.toLocaleDateString()
// console.log(todayDate, "Today's Date")

doneBt.addEventListener('click', (e) => {
    e.preventDefault()
    console.log(inputs.value)
    const ip = inputs.value
    const date = new Date(ip)
})
function displayEl(){
    getWeek()
    displayDates()
}
displayEl()

// to get the whoel week
function getWeek(){
    const startDate = today
    startDate.setDate(startDate.getDate() - startDate.getDay())
    // console.log(startDate)

    for (let i=0; i<7; i++) {
        const current = new Date(startDate)
        current.setDate(current.getDate() + i)
        const dates = {
                date : current,
                id : i
            }
        weekDates.push(dates)
    }
}
// getWeek()

console.log(weekDates, "weekDates")

// function to display Dates
function displayDates(){
    console.log("here")

    weekDates.map((dateItem) => {
        // console.log(dateItem.date)
        const dateString = (new Date(dateItem.date)).toLocaleDateString()

        dateContainer.innerHTML += `
            <div class="date" data-date-id="${dateItem.id}">${dateString}</div>
        `
    })
}





