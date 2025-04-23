// import { getTaskId } from "../script"

const resumeButton = document.querySelector('.rm-btn')
const startButton = document.querySelector('.st-btn')
const stopButton = document.querySelector('.ed-btn')
const timeContainer = document.querySelector('.time-wrap')
const totalTime = document.querySelector('.tot-time')
// console.log(totalTime)

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

        return dateItem ? `
            <li class="li" id="li-container" data-time-id="${id}">
                <div class="green-signal item-info" id="task${id}"></div>
                <div class="li-cont">Start Time : <span class="start-time" id="task${id}">${startTime}</span></div>

                <div class="li-cont">End Time : <span class="end-time" id="task${id}">${endTime}</span></div>

                <div class="result-el li-cont">Time Duration : <span id="result">${timeDiffHtml}</span></div>
            </li>
        ` : `
            <li class="li" id="li-container">
                <div class="li-cont">Start Time : <span class="start-time"">Start a New Move</span></div>
            </li>
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
            dateItem.timeDiff = currentTime - time
            console.log(dateItem.timeDiff, 'timeDiff')
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
    displayTime(dates)
    clearInterval()
    // location.reload()
})


// for resume button
// const timeCont = document.querySelectorAll('#li-container')
// console.log(timeCont)

// let greenEl
// let resumeId
// let resumeStartTime

// timeCont.forEach((item) => {
//     item.addEventListener('click', () => {
//         console.log(item)
//         resumeButton.classList.remove('item-info')
//         startButton.classList.add('item-info')
//         resumeId = item.dataset.timeId
//         dates.map((date) => {
//             if(date.id == resumeId){
//                 date.status = 'resume'
//             }else{
//                 date.status = 'done'
//             }
//             localStorage.setItem('dates', JSON.stringify(dates))
//         })
//         console.log(resumeId, 'inside')
//         // return itemId
//     })
//     // resumeButton.addEventListener('click', resumeTimer(itemId))
//     // console.log(itemId, 'inside foreEach')

// })
// console.log(resumeId, 'outside')

// function resumeTimer(){
//     // console.log('hello', itemId)
//     dates.map((date) => {
//         if (date.status == 'resume'){
//             console.log(date)
//             // date.status = 'resumeProcessing'
//             const timeStart = resumeStartTime
//             const timeNow = new Date()
//             const newTimeDiff = timeNow - resumeStartTime
//             console.log(newTimeDiff, 'here')
//             console.log(date.timeDiff)
//             // date.timeDiff = date.timeDiff + newTimeDiff
//             // console.log(date.timeDiff)
//             // totalTime.innerHTML = `${timeStart.toLocaleTimeString()} | ${timeNow.toLocaleTimeString()}`
//             // localStorage.setItem('dates', JSON.stringify(dates))
//             // displayTime(dates)
//         }
//     })
    
// }

// resumeButton.addEventListener('click', () => {
//     resumeStartTime = new Date()
//     greenEl = document.querySelector(`#task${resumeId}`)
//     console.log(greenEl)
//     greenEl.classList.remove('item-info')

//     setInterval(resumeTimer, 1000)
// })

// -----------------------------------------------------------------------------------------------
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
// -----------------------------------------------------------------------------------------------