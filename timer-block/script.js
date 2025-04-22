// import { getTaskId } from "../script"

const resumeButton = document.querySelector('.rm-btn')
const startButton = document.querySelector('.st-btn')
const stopButton = document.querySelector('.ed-btn')
const timeContainer = document.querySelector('.time-wrap')
const totalTime = document.querySelector('.tot-time')
console.log(totalTime)

let dates = JSON.parse(localStorage.getItem('dates')) || []

// function to get start Time

function getStartTime(){
    const date = new Date()
    if (dates.length == 0 || dates.at(-1).status == 'done'){
        let times = {
            start : `${date}`,
            end : '',
            id : '',
            timeDiff : '',
            status : 'processing'
        }
        dates.push(times)
        displayTime(dates)
        localStorage.setItem('dates', JSON.stringify(dates))
    }
}

function displayTime(dates){
    console.log('hi')
    timeContainer.innerHTML = dates.map((dateItem, id) => {

        let endTimeHtml

        const newdate = new Date(dateItem.start)
        const hours = newdate.getHours()
        const mins = newdate.getMinutes()
        const secs = newdate.getSeconds()
        dateItem.id = id

        if (dateItem.end != ''){
            const endTime = new Date(dateItem.end)
            const endHours = endTime.getHours()
            const endMins = endTime.getMinutes()
            const endSecs = endTime.getSeconds()
            endTimeHtml = `${formatTime(endHours)} : ${formatTime(endMins)} : ${formatTime(endSecs)}`
        }else {
            endTimeHtml = '00 : 00 : 00'
        }

        return dateItem ? `
            <li class="li" id="li-container" data-time-id="${id}">
                <div class="li-cont">Start Time : <span class="start-time" id="task${id}">${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(secs)}</span></div>

                <div class="li-cont">End Time : <span class="end-time" id="task${id}">${endTimeHtml}</span></div>

                <div class="result-el li-cont">Time Duration : <span id="result">${dateItem.timeDiff}</span></div>
            </li>
        ` : `
            <div>Start Time : <span class="start-time">00:00:00</span></div>

            <div>End Time : <span class="end-time">00:00:00</span></div>
        `
    }).join('')

}

displayTime(dates)

// function to get runTime
function getRunTime(){
    const result = dates.map((dateItem, id) => {
        
        if (dateItem.status === 'processing'){
            displayTime(dates)
            const resultEl = document.querySelector('#result')
            const time = new Date(dateItem.start)
            const currentTime = new Date()
            const timeDiff = (currentTime - time) / 1000
            const hours = Math.floor(timeDiff / 3600 % 24)
            const mins = Math.floor(timeDiff / 60) % 60
            const seconds = (Math.floor(timeDiff) % 60 ) + 1 
            dateItem.timeDiff = `${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(seconds)}`
            localStorage.setItem('dates', JSON.stringify(dates))

        }
    }).join('')
    return result
}

function formatTime(time){
    return time < 10 ? (`0${time}`) : time
}


startButton.addEventListener('click', (e) => {
    getStartTime()
    setInterval(getRunTime, 1000)
})

// function to get End Time

function getEndTime(){
    const date = new Date()
    const r = dates.map((item, id) => {
        if (item.status === 'processing'){
            item.end = `${date}`
            item.status = 'done'
            console.log(dates, 'after-end')
            localStorage.setItem('dates', JSON.stringify(dates))
        }
    })
    // console.log(dates, 'second')
}

stopButton.addEventListener('click', () => {
    setInterval(getRunTime, 1000)
    getEndTime()
    displayTime(dates)
    clearInterval()
})

// function displayTotTime(){
//     const endTime = new Date()
    // const endHours = endTime.getHours()
    // const endMins = endTime.getMinutes()
    // const endSecs = endTime.getSeconds()
    // const t = endTime.toLocaleTimeString()
    // totalTime.innerHTML = t
    // totalTime.innerHTML = `${formatTime(endHours)} : ${formatTime(endMins)} : ${formatTime(endSecs)}`
// }

// setInterval(displayTotTime, 1000)
// time()

// resume button
const timeCont = document.querySelectorAll('#li-container')
console.log(timeCont)

function resumeTimer(itemId){
    console.log('hello', itemId)
}

timeCont.forEach((item) => {
    item.addEventListener('click', () => {
        resumeButton.classList.remove('item-info')
        startButton.classList.add('item-info')
        const itemId = item.dataset.timeId
        dates.map((date) => {
            if(date.id == itemId){
                date.status = 'resume'
            }
        })
        // console.log(itemId)
    })
    // resumeButton.addEventListener('click', resumeTimer(itemId))

})

resumeButton.addEventListener('click', resumeTimer)

