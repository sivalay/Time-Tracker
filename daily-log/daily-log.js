import { tasks } from "../datas/tasks.js"

const myCanvas = document.querySelector('#my-canva')
const dateContainer = document.querySelector('.dates-container')
const dateHead = document.querySelector('.today-head')

const display = document.querySelector('.output-log')
const inputs = document.querySelector('#date-input')
const doneBt = document.querySelector('#done-btn')

const today = new Date()
let weekDates = []

console.log(tasks.map(task => task))

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

// to get the whole week
function getWeek(){
    const startDate = today
    startDate.setDate(startDate.getDate() - startDate.getDay())
    // console.log(startDate)

    for (let i=0; i<7; i++) {
        const current = new Date(startDate)
        current.setDate(current.getDate() + i)
        console.log(current, 'current')
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

// to get date
const dateEl = document.querySelectorAll('.date')

// console.log(dateEl)
dateEl.forEach((dateItem) => {
    dateItem.addEventListener('click', () => {
        const dateId = dateItem.dataset.dateId
        console.log(dateId, 'Here is the Id')
        let matchItem
        weekDates.map((weekDate) => {
            if (weekDate.id == dateId){
                matchItem = weekDate
            }
        })
        console.log(matchItem, 'MatchItem')
        const matchDate = (matchItem.date).toLocaleDateString()
        dateHead.innerHTML = matchDate
    })
})




// how to draw a graph in canvas with javascript!?



