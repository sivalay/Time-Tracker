
import { dates, addTime, SaveTimes } from "../datas/times.js"
import { tasks, SaveToStorage } from "../datas/tasks.js"


const resumeButton = document.querySelector('.rm-btn')
const backButton = document.querySelector('.back-btn-timer')
const startButton = document.querySelector('.st-btn')
const stopButton = document.querySelector('.ed-btn')
const timeContainer = document.querySelector('.time-wrap')
const headContainer = document.querySelector('.task-details')
const doneContainer = document.querySelector('#done-text')
const totalTime = document.querySelector('.tot-time')
const doneButton = document.querySelector('#btn-el')
const homeBt = document.querySelector('.home-link')

// let dates = JSON.parse(localStorage.getItem('dates')) || []
let stickTime = 0
let newTimeDiff = ''
let resumeDiff


const loc = window.location
const locParse = new URL(loc).searchParams
const locId = parseInt(locParse.get("taskId"))
const perId = parseInt(locParse.get("personId"))
console.log(perId, 'perId')
console.log(locId, 'locId')

// function to get start Time
function getStartTime(){
    const date = new Date()
    if (dates.length == 0 || dates.at(-1).status == 'done'){
        let times = {
            start : `${date}`,
            end : '',
            taskId : locId,
            id : '',
            timeDiff : '',
            totalTime : '',
            status : 'processing'
        }
        // dates.push(times)
        addTime(times)
        displayTime(dates)
        SaveTimes(dates)
    }
}

// Get the Task Item
let taskitem
tasks.map((task) => {
    if (task.taskId == locId){
        taskitem = task
    }
})

// function to renderTimeHead
function displayHead(){
    headContainer.innerHTML = `
        <h1 class="task-des-head">${taskitem.tName}</h1>
        <h3 class="task-des-subhead">${taskitem.tDesc}</h3>
        <h4 class="task-des-tag">${taskitem.tTag}</h4>
    `
    if (taskitem.taskStatus == 'Done'){
        doneContainer.innerHTML = "Task Done"
    }
}
displayHead()


// function to renderTimeSum
function displayTotalTime(){
    const timeDiff = (taskitem.totalTime) / 1000
    const hours = Math.floor(timeDiff / 3600 % 24)
    const mins = Math.floor(timeDiff / 60) % 60
    const seconds = (Math.floor(timeDiff) % 60)
    const timeDiffHtml = `${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(seconds)}`
    totalTime.innerHTML = timeDiffHtml
}

displayTotalTime()

// function to renderTimeLIst
let timeHtmlEl 

function displayTime(dates){
    timeHtmlEl = ''

    let matchItem
    dates.map((date, id) => {
        if(date.taskId == locId){
            matchItem = date
            
            let endTime
            matchItem.id = id

            const startTime = getTimeString(matchItem.start)

            if (matchItem.end != ''){
                endTime = getTimeString(matchItem.end)
            }else {
                endTime = '00 : 00 : 00'
            }

            const timeDiff = (matchItem.timeDiff) / 1000
            const hours = Math.floor(timeDiff / 3600 % 24)
            const mins = Math.floor(timeDiff / 60) % 60
            const seconds = (Math.floor(timeDiff) % 60) 
            const timeDiffHtml = `${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(seconds)}`

            timeHtmlEl += `
                <li class="li" id="li-container" data-time-id="${id}">
                    <div>
                        <div class="green-signal ${matchItem.status == 'resume' ? '' : 'item-info'}" id="task${id}"></div>
                        <div class="li-cont">Start Time : <span class="start-time" id="task${id}">${startTime}</span></div>
                    </div>

                    <div class="li-cont">End Time : <span class="end-time" id="task${id}">${endTime}</span></div>

                    <div class="result-el li-cont running-time">Time Duration : <span id="result">${timeDiffHtml}</span></div>
                </li>
            ` 
        }

        timeContainer.innerHTML =  timeHtmlEl
    })  
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
            SaveTimes(dates)

        }
    }).join('')
    return result
}

// function to transform time
function formatTime(time){
    return time < 10 ? (`0${time}`) : time
}

function getTimeString(dateItem){
    const endTime = new Date(dateItem)
    const endHours = endTime.getHours()
    const endMins = endTime.getMinutes()
    const endSecs = endTime.getSeconds()
    const endTimeHtml = `${formatTime(endHours)} : ${formatTime(endMins)} : ${formatTime(endSecs)}`
    return endTimeHtml
}


startButton.addEventListener('click', () => {
    if (taskitem.taskStatus == ''){
        getStartTime()
        setInterval(getRunTime, 1000)
    }
})

// function to get End Time
function getEndTime(){
    const date = new Date()
    console.log('hi')
    const r = dates.map((item, id) => {
        if (item.status === 'processing' || item.status == 'resume'){
            item.end = `${date}`
            item.status = 'done'
            console.log(item.timeDiff)

            if(newTimeDiff != ''){
                resumeDiff = newTimeDiff
            }else{
                resumeDiff = item.timeDiff
            }
            const timeLog = {
                newTimeDiff : item.timeDiff,
                endLog : date
            }
            console.log(timeLog, 'timeLog')
            console.log("Here is the time Diff n Date")
            taskitem.timeLogs.push(timeLog)
            console.log(taskitem.timeLogs)
            console.log(dates, 'after-end')
            SaveToStorage()
            SaveTimes(dates)
        }
    })
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

let greenEl
let resumeId
let resumeStartTime
let pausedTime

timeCont.forEach((item) => {
    if (taskitem.taskStatus == ''){
        item.addEventListener('click', () => {
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
                SaveTimes(dates)
            })
        })
    }
})

function resumeTimer(){
    dates.map((date) => {
        if (date.status == 'resume'){
            // const timeStart = resumeStartTime
            const timeNow = new Date()
            newTimeDiff = timeNow - resumeStartTime
            resumeDiff = newTimeDiff
            console.log(resumeDiff, 'resume time diffs')
            date.timeDiff = pausedTime + newTimeDiff
            SaveTimes(dates)
            displayTime(dates)
        }else{
            greenEl.classList.add('item-info')

        }
    })
    
}

resumeButton.addEventListener('click', () => {
    resumeStartTime = new Date()
    backButton.classList.add('item-info')
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
            SaveTimes(dates)
            displayTime(dates)
            location.reload()
        }
    })
}

backButton.addEventListener('click', backResume)


// function to get the total time

// function to get totalTime
function displayTotTime(){
    
    dates.map((date) => {
        if (date.timeDiff && date.taskId == locId){
            stickTime += date.timeDiff
        }
    })
    taskitem.totalTime = stickTime
    // console.log(taskitem.totalTime)
    SaveToStorage()
}

doneButton.addEventListener('click', () => {
    displayTotTime()
    taskitem.taskStatus = 'Done'
    SaveToStorage()
})

// Home Button
homeBt.addEventListener('click', (e) => {
    e.preventDefault()
    window.location = `../task-block/index.html?personId=${perId}`
})

// dates.map((item) => {
//     if (item.taskId == 4){
//         console.log(item)
//         const itemNow = (item.timeLogs)
//         console.log(itemNow)
//         let k
//         let k1
//         itemNow.map((logItem) => {
//             k = new Date(logItem.endLog)
//             k1 = logItem.newTimeDiff
//             console.log(k)
//             console.log(k1)
//         })
//         // const nowString = new Date(itemNow)
//         // console.log(nowString, 'nowString')
//         const timeDiff = (k1) / 1000
//         const hours = Math.floor(timeDiff / 3600 % 24)
//         const mins = Math.floor(timeDiff / 60) % 60
//         const seconds = (Math.floor(timeDiff) % 60 ) + 1
//         console.log(`${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(seconds)}`)
//         // const itemDate = nowString.getDate()
//         // console.log(itemDate)
//     }
// })

