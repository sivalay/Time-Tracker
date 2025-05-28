import { dates, addTime, SaveTimes, formatTime } from "../datas/times.js"
import { tasks, SaveToStorage, displayLocId } from "../datas/tasks.js"

const resumeButton = document.querySelector('.rm-btn')
const backButton = document.querySelector('.back-btn-timer')
const startButton = document.querySelector('.st-btn')
const stopButton = document.querySelector('.ed-btn')
const timeContainer = document.querySelector('.time-wrap')
const timeHeadContainer = document.querySelector('.by-default-text')
const headContainer = document.querySelector('.task-details')
const totalTime = document.querySelector('.tot-time')
const doneButton = document.querySelector('#btn-el')
const homeBt = document.querySelector('.home-link')

const locId = displayLocId('taskId')
const perId = displayLocId('personId')

// Get the Task Item
let taskitem
tasks.map((task) => {
    if (task.taskId == locId){
        taskitem = task
        console.log(task, 'task')
    }
})

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
            resumeTime : '',
            status : 'processing'
        }
        addTime(times)
        displayTime(dates)
        SaveTimes(dates)
    }
}

// function to renderTimeSum
function displayTotalTime(){
    const timeDiffHtml = getTimeDiffString(taskitem.totalTime)
    totalTime.innerHTML = timeDiffHtml
}

displayTotalTime()

// function to renderTimeHead
function displayHead(){
    headContainer.innerHTML = `
        <h1 class="task-des-head">${taskitem.tName}</h1>
        <h3 class="task-des-subhead">${taskitem.tDesc}</h3>
        <h4 class="task-des-tag">${taskitem.tTag}</h4>
    `
}
displayHead()

// function to renderTimeLIst
function displayTime(dates){
    let timeHtmlEl = ''
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
            const timeDiffHtml = getTimeDiffString(matchItem.timeDiff)

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
    console.log(timeHeadContainer, 'timeHeadContainer')
    timeHeadContainer.innerHTML = `
        <li class="li start-text text${locId}" id="text${locId}">
            <div class="li-cont" id="done-text"></div>
        </li>
    `
    const doneContainer = document.querySelector(`.text${locId}`)
    console.log(doneContainer, 'done')
    if (taskitem.taskStatus == 'Done'){
        doneContainer.innerHTML = "Task Done"
    }
    if (taskitem.taskStatus == ''){
        doneContainer.innerHTML = "Start a New Move"
    }
    if (taskitem.taskStatus == 'processing'){
        doneContainer.innerHTML = "Task Processing"
    }
}
displayTime(dates)

// function to get runTime
function getRunTime(){
    const result = dates.map((dateItem) => {
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

dates.map((dateItem) => {
    if(dateItem.status === 'processing'){
        setInterval(getRunTime, 1000)
    }
    // if(dateItem.status === 'resume'){
    //     const pausedTime = dateItem.timeDiff
    //     const resumeId = dateItem.id
    //     let greenEl = document.querySelector(`#task${resumeId}`)
    //     setInterval(resumeTimer, 1000, greenEl, pausedTime)
    // }
})

// function to transform time
// function formatTime(time){
//     return time < 10 ? (`0${time}`) : time
// }

function getTimeString(dateItem){
    const endTime = new Date(dateItem)
    const endHours = endTime.getHours()
    const endMins = endTime.getMinutes()
    const endSecs = endTime.getSeconds()
    const endTimeHtml = `${formatTime(endHours)} : ${formatTime(endMins)} : ${formatTime(endSecs)}`
    return endTimeHtml
}

function getTimeDiffString(dateEl){
    const timeDiff = (dateEl) / 1000
    const hours = Math.floor(timeDiff / 3600 % 24)
    const mins = Math.floor(timeDiff / 60) % 60
    const seconds = (Math.floor(timeDiff) % 60) 
    const timeDiffHtml = `${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(seconds)}`
    return timeDiffHtml
}

startButton.addEventListener('click', () => {
    if (taskitem.taskStatus == ''){
        taskitem.taskStatus = 'processing'
        SaveToStorage()
        getStartTime()
        setInterval(getRunTime, 1000)
    }
})

// function to get End Time
function getEndTime(){
    const date = new Date()
    const r = dates.map((item, id) => {
        if (item.status === 'processing' || item.status == 'resume'){
            item.end = `${date}`
            item.status = 'done'
            const timeLog = {
                newTimeDiff : item.timeDiff,
                endLog : date
            }
            taskitem.timeLogs.push(timeLog)
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
    if (taskitem.taskStatus == 'processing'){
        taskitem.taskStatus = ''
        SaveToStorage()
    }
    location.reload()
})

// for resume button
const timeCont = document.querySelectorAll('#li-container')

timeCont.forEach((item) => {
    if (taskitem.taskStatus == ''){
        item.addEventListener('click', () => {
            resumeButton.classList.remove('item-info')
            backButton.classList.remove('item-info')
            startButton.classList.add('item-info')
            let resumeId = item.dataset.timeId
            dates.map((date) => {
                if(date.id == resumeId){
                    date.status = 'resume'
                }else{
                    date.status = 'done'
                }
                SaveTimes(dates)
            })
        })
    }
})

function resumeTimer(greenEl, pausedTime){
    dates.map((date) => {
        if (date.status == 'resume'){
            const timeNow = new Date()
            const resumeStart = date.resumeTime
            let newTimeDiff = timeNow - resumeStart
            date.timeDiff = pausedTime + newTimeDiff
            SaveTimes(dates)
            displayTime(dates)
        }else{
            greenEl.classList.add('item-info')
        }
    })
    
}

resumeButton.addEventListener('click', () => {
    const resumeStartTime = new Date()
    backButton.classList.add('item-info')
    let resumeId
    let pausedTime
    dates.map((date) => {
        if (date.status == 'resume'){
            resumeId = date.id
            date.resumeTime = resumeStartTime
            pausedTime = date.timeDiff
        }
    })
    let greenEl = document.querySelector(`#task${resumeId}`)
    setInterval(resumeTimer, 1000, greenEl, pausedTime)
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

// function to get totalTime
function displayTotTime(){
    let stickTime = 0
    dates.map((date) => {
        if (date.timeDiff && date.taskId == locId){
            stickTime += date.timeDiff
        }
    })
    taskitem.totalTime = stickTime
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

