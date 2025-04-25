// import { getTaskId } from "../script"

const resumeButton = document.querySelector('.rm-btn')
const backButton = document.querySelector('.back-btn-timer')
const startButton = document.querySelector('.st-btn')
const stopButton = document.querySelector('.ed-btn')
const timeContainer = document.querySelector('.time-wrap')
const totalTime = document.querySelector('.tot-time')
const doneButton = document.querySelector('#btn-el')
// console.log(doneButton)

let dates = JSON.parse(localStorage.getItem('dates')) || []

let stickTime = 0

// function to get start Time
function getStartTime(){
    const date = new Date()
    if (dates.length == 0 || dates.at(-1).status == 'done'){
        let times = {
            start : `${date}`,
            end : '',
            id : '',
            timeDiff : '',
            totalTime : '',
            status : 'processing'
        }
        dates.push(times)
        displayTime(dates)
        localStorage.setItem('dates', JSON.stringify(dates))
    }
}

function getTimeString(dateItem){
    const endTime = new Date(dateItem)
    const endHours = endTime.getHours()
    const endMins = endTime.getMinutes()
    const endSecs = endTime.getSeconds()
    const endTimeHtml = `${formatTime(endHours)} : ${formatTime(endMins)} : ${formatTime(endSecs)}`
    return endTimeHtml
}

function displayTime(dates){
    console.log('hi')
    if (dates.length == 0){
        console.log('there is')
        timeContainer.innerHTML = `
            <li class="li" id="li-container">
                <div class="li-cont">Start a New Move</div>
            </li>
        ` 
    } else {
        timeContainer.innerHTML = dates.map((dateItem, id) => {

            let endTime
            dateItem.id = id

            const startTime = getTimeString(dateItem.start)

            if (dateItem.end != ''){
                endTime = getTimeString(dateItem.end)
            }else {
                endTime = '00 : 00 : 00'
            }

            const timeDiff = (dateItem.timeDiff) / 1000
            const hours = Math.floor(timeDiff / 3600 % 24)
            const mins = Math.floor(timeDiff / 60) % 60
            const seconds = (Math.floor(timeDiff) % 60 ) + 1 
            const timeDiffHtml = `${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(seconds)}`

            return `
                <li class="li" id="li-container" data-time-id="${id}">
                    <div>
                        <div class="green-signal ${dateItem.status == 'resume' ? '' : 'item-info'}" id="task${id}"></div>
                        <div class="li-cont">Start Time : <span class="start-time" id="task${id}">${startTime}</span></div>
                    </div>

                    <div class="li-cont">End Time : <span class="end-time" id="task${id}">${endTime}</span></div>

                    <div class="result-el li-cont running-time">Time Duration : <span id="result">${timeDiffHtml}</span></div>
                </li>
            `  
        }).join('')
    }

}

displayTime(dates)

// function to get totalTime
function displayTotTime(){
    console.log("hoi")
    dates.map((date) => {
        if (date.timeDiff){
            stickTime += date.timeDiff
            console.log(date)
        }
    })
    const timeDiff = (stickTime) / 1000
    const hours = Math.floor(timeDiff / 3600 % 24)
    const mins = Math.floor(timeDiff / 60) % 60
    const seconds = (Math.floor(timeDiff) % 60 ) + 1 
    const timeDiffHtml = `${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(seconds)}`
    totalTime.innerHTML = timeDiffHtml
    console.log(stickTime, 'stickTime')
}

// function to get runTime
function getRunTime(){
    const result = dates.map((dateItem, id) => {
        
        if (dateItem.status === 'processing'){
            displayTime(dates)
            const resultEl = document.querySelector('#result')
            const time = new Date(dateItem.start)
            const currentTime = new Date()
            dateItem.timeDiff = currentTime - time
            console.log(dateItem.timeDiff, 'timeDiff')
            localStorage.setItem('dates', JSON.stringify(dates))

        }
    }).join('')
    return result
}

// function to transform time
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
        if (item.status === 'processing' || item.status == 'resume'){
            item.end = `${date}`
            item.status = 'done'
            console.log(dates, 'after-end')
            localStorage.setItem('dates', JSON.stringify(dates))
        }
    })
    // console.log(dates, 'second')
}

stopButton.addEventListener('click', () => {
    getRunTime()
    getEndTime()
    displayTotTime()
    displayTime(dates)
    clearInterval()
    location.reload()
})


// for resume button
const timeCont = document.querySelectorAll('#li-container')
console.log(timeCont)

let greenEl
let resumeId
let resumeStartTime
let pausedTime

timeCont.forEach((item) => {
    item.addEventListener('click', () => {
        console.log(item)
        resumeButton.classList.remove('item-info')
        backButton.classList.remove('item-info')
        startButton.classList.add('item-info')
        resumeId = item.dataset.timeId
        dates.map((date) => {
            if(date.id == resumeId){
                date.status = 'resume'
                pausedTime = date.timeDiff
                console.log(pausedTime)
            }else{
                date.status = 'done'
            }
            localStorage.setItem('dates', JSON.stringify(dates))
        })
    })

})

function resumeTimer(){
    dates.map((date) => {
        if (date.status == 'resume'){
            const timeStart = resumeStartTime
            const timeNow = new Date()
            const newTimeDiff = timeNow - resumeStartTime
            date.timeDiff = pausedTime + newTimeDiff
            totalTime.innerHTML = `${timeStart.toLocaleTimeString()} | ${timeNow.toLocaleTimeString()}`
            localStorage.setItem('dates', JSON.stringify(dates))
            displayTime(dates)
        }else{
            greenEl.classList.add('item-info')

        }
    })
    
}

resumeButton.addEventListener('click', () => {
    resumeStartTime = new Date()
    greenEl = document.querySelector(`#task${resumeId}`)
    console.log(greenEl)
    setInterval(resumeTimer, 1000)
})

// for back button in resume
function backResume(){
    dates.map((date) => {
        if (date.status == 'resume'){
            resumeButton.classList.add('item-info')
            backButton.classList.add('item-info')
            startButton.classList.remove('item-info')
            date.status = 'done'
            localStorage.setItem('dates', JSON.stringify(dates))
            displayTime(dates)
            location.reload()
        }
    })
}

backButton.addEventListener('click', backResume)


// function to get the total time
doneButton.addEventListener('click', () => {
    displayTotTime()
})
