import { tasks,displayLocId } from "../datas/tasks.js"
import { formatTime } from "../datas/times.js"

const dateContainer = document.querySelector('.dates-container')
const dateHead = document.querySelector('.today-head')
const taskHead = document.querySelector('.time-log')

const searchEl = document.querySelector('#search')
const searchBt = document.querySelector('#search-button')
const homeBt = document.querySelector('.home-bt')

const graphGrid = document.querySelector('.graph-container')

const perId = displayLocId('personId')
homeBt.addEventListener('click', (e) => {
    e.preventDefault()
    window.location = `../task-block/index.html?personId=${perId}`
})

const today = new Date()
let weekDates = []
const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
let gridTimeArray = []
let taskArray = []
let timeArray = []
let weekTimeArray = []
let maxHour = 3
let weekMaxHour = 3
const now = new Date()

function displayEl(today){
    getWeek(today)
    displayDates()
}
displayEl(today)

// to get the whole week
function getWeek(day){
    const startDate = day
    weekDates = []
    startDate.setDate(startDate.getDate() - startDate.getDay())

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

// function to display Dates
function displayDates(){
    let dateHtml = ''
    weekDates.map((dateItem) => {
        const dateString = (new Date(dateItem.date)).toLocaleDateString()

        dateHtml += `
            <div class="date" data-date-id="${dateItem.id}">${dateString}</div>
        `
    })
    dateContainer.innerHTML = dateHtml
}

// to get date
function getDateEl(){
    const dateEl = document.querySelectorAll('.date')
    // console.log(dateEl, 'dateEl')
    
    dateEl.forEach((dateItem) => {
        dateItem.addEventListener('click', () => {
            const dateId = dateItem.dataset.dateId
            // console.log(dateId, 'Here is the Id')
            let matchItem
            // console.log(weekDates, 'weekdates from dateEl')
            weekDates.map((weekDate) => {
                if (weekDate.id == dateId){
                    matchItem = weekDate
                }
            })
            console.log(matchItem, 'MatchItem')
            const matchDate = (matchItem.date).toLocaleDateString()
            console.log(matchDate, 'matchDate')
            dateHead.innerHTML = matchDate
            taskArray = []
            timeArray = []
            gridTimeArray = []
            weekTimeArray = []
            // displayEl(matchItem.date)
            displayTasks(matchItem.date)
            // displayGraph()
        })
    })
}
getDateEl()

// to search date
searchBt.addEventListener('click', (e) => {
    e.preventDefault()
    const val = searchEl.value
    const newDate = new Date(val)
    const matchDate = newDate.toLocaleDateString()
    // console.log(val, 'search-value')
    // console.log(matchDate, 'date')
    dateHead.innerHTML = matchDate
    taskArray = []
    timeArray = []
    gridTimeArray = []
    weekTimeArray = []
    displayTasks(newDate)
    displayEl(newDate)
    getDateEl()
    searchEl.value = ''
})

// display of tasks and times for the day
function displayTasks(now){
    let maxWeekHour = 0
    let maxHourVar = 0
    taskHead.innerHTML = ''
    const currentDate = (new Date(now)).toLocaleDateString()
    tasks.map((task) => {    
        let diffSum = 0 
        if(task.pId == perId){
            task.timeLogs.map((timeItem) => {
                let logDate = (new Date(`${timeItem.endLog}`)).toLocaleDateString()
                if (currentDate === logDate){
                    diffSum =diffSum + timeItem.newTimeDiff
                }
            })
            if(diffSum != 0){
                if (diffSum > maxHourVar){
                    maxHourVar = diffSum
                    const mm = maxHourVar / 1000
                    const mh = Math.floor(mm / 3600 % 24)
                    maxHour = mh + 3
                }
                const timeDiff = (diffSum) / 1000
                const hours = Math.floor(timeDiff / 3600 % 24)
                const minss = Math.floor(timeDiff / 60) % 60
                const inHrd = (minss / 60) * 100
                const timeDiffHtml = `${hours}hr:${formatTime(minss)}mins`
                const timesEl = {
                    hour : hours,
                    min : inHrd,
                    dayTime : timeDiffHtml
                }
                timeArray.push(timeDiffHtml)
                gridTimeArray.push(timesEl)
                taskArray.push(task.tName)
            }
        }
    })
    getWeek(now)
    weekDates.forEach((week,id) => {
        let timeDif = 0
        const date = week.date
        const weekDate = (new Date(date)).toLocaleDateString()
        tasks.map((task) => {
            if(task.pId == perId){
                task.timeLogs.forEach((times) => {
                    const taskDate = (new Date(`${times.endLog}`)).toLocaleDateString()
                    if (taskDate === weekDate){
                        timeDif += times.newTimeDiff
                    }
                })
            }
        })
        if (timeDif != 0){
            if(timeDif > maxWeekHour){
                maxWeekHour = timeDif
                const ms = maxWeekHour / 1000
                const mh = Math.floor(ms / 3600 % 24)
                weekMaxHour = mh + 2
            }
        }
        const timeDiff = (timeDif) / 1000
        const hours = Math.floor(timeDiff / 3600 % 24)
        const mins = (Math.floor(timeDiff / 60) % 60)
        const weektime = `${hours}hours : ${mins}mins`
        const weekTimes = {
            hour : hours,
            min : mins,
            id,
            weektime
        }
        if (weekTimeArray.length == 0){
        }
        weekTimeArray.push(weekTimes)
    })
    console.log(weekDates, 'weekDates')
    if(taskArray.length === 0){
        taskHead.innerHTML = `
            <div class="task-container">
                <div class="task-head">No Data On This Date</div>
            </div>
        `
    }
    taskArray.map((timeItm) => {
        taskHead.innerHTML += `
            <div class="task-container">
                <div class="task-head">${timeItm}</div>
            </div>
        `
    })
    // displayChart()
    displayGraph()
}
displayTasks(now)

function displayGraph(){
    graphView()
    displayGrid()
    colorGrid()
    getCurrentTask()
    dayWeekDisplay()
}
displayGraph()

// graph-grid
function graphView(){
    graphGrid.innerHTML = `
        <div class="date-head graph-head" style="margin-top: 10px;"><li class="underlines" id="day">Daily</li><li class="disabled" id="week">Weekly</li></div>
        <div class="grid-graph-container" id="day-container">
            <div class="graph-top">
                <div class="side-heads">
                    <ul class="log-time-container" id="log-time">
                    </ul>
                </div>
                <div class="div-container">
                    <div class="task-info item-info">
                        <h5 id="graph-head"></h5>
                        <h5 id="graph-time"></h5>
                    </div>
                    <div class="main-graph" id="graph-cont">
                    </div>
                </div>
            </div>
            <div class="down-heads">
                <ul class="log-task-container" id="log-task">
                </ul>
            </div>
        </div>
        <div class="grid-graph-container  item-info" id="week-container">
            <div class="graph-top">
                <div class="side-heads">
                    <ul class="log-time-container" id="week-time">
                    </ul>
                </div>
                <div class="div-container">
                    <div class="task-info week-info item-info">
                        <h5 id="week-head">hi</h5>
                        <h5 id="week-time-st">12:23</h5>
                    </div>
                    <div class="main-graph" id="weekly-graph">
                    </div>
                </div>
            </div>
            <div class="down-heads">
                <ul class="log-task-container" id="log-week">
                </ul>
            </div>
        </div>
    `
}

// displaying grid-log
function displayGrid(){
    const timeCont = document.getElementById('log-time')
    let timeHtml = ''
    for (let i=0; i<=maxHour; i++){
        timeHtml += `
            <li class="time">${i}hr</li>
        `
    }
    timeCont.innerHTML = timeHtml
    const taskCont = document.getElementById('log-task')
    const graphCont = document.getElementById('graph-cont')
    let taskHtml = ''
    let taskContHtml = ''
    taskArray.forEach((task, id) => {
        taskHtml += `
            <li class="task" id="task${id}">${task}</li>
        `
        taskContHtml += `<ul class="box" data-task-id="${id}"></ul>`
    })
    taskCont.innerHTML = taskHtml
    graphCont.innerHTML = taskContHtml
    const taskContainer = document.querySelectorAll('.box')
    taskContainer.forEach((taskc) => {
        const taskId = taskc.dataset.taskId
        let gridElHtml = ''
        for (let i=1; i<=maxHour; i++){
            gridElHtml += `<li class="box-col box${taskId}" data-box-id="${i}"></li>`
        }
        taskc.innerHTML = gridElHtml
    })
    // weekly graph
    const weeksEl = document.getElementById('log-week')
    let weeks = ''
    weekDates.forEach((week) => {
        const weekId = week.id
        weeks += `<li class="task">${weekDays[weekId]}</li>`        
    })
    weeksEl.innerHTML = weeks
    const weekTimeCont = document.getElementById('week-time')
    let weekTimeHtml = ''
    for (let i=0; i<=weekMaxHour; i++){
        weekTimeHtml += `
            <li class="time">${i}hr</li>
        `
    }
    weekTimeCont.innerHTML = weekTimeHtml
    const weekGraph = document.getElementById('weekly-graph')
    let weekbox = ''
    weekTimeArray.forEach((weekDay) => {
        weekbox += `<ul class="weekbox" data-task-id="${weekDay.id}"></ul>`
    })
    weekGraph.innerHTML = weekbox
    const weekTaskCont = document.querySelectorAll('.weekbox')
    weekTaskCont.forEach((weekul) => {
        const weekTaskId = weekul.dataset.taskId
        let gridElHtml = ''
        for (let i=1; i<=weekMaxHour; i++){
            gridElHtml += `<li class="wbox-col wbox${weekTaskId}" data-box-id="${i}"></li>`
        }
        weekul.innerHTML = gridElHtml
    })
}

// to color grid
function colorGrid(){
    gridTimeArray.forEach((gridTime,id) => {
        const grids = document.querySelectorAll(`.box${id}`)
        colorGridEl(grids,gridTime)
    })
    weekTimeArray.forEach((weekDay) => {
        const grids = document.querySelectorAll(`.wbox${weekDay.id}`)
        colorGridEl(grids, weekDay)
    })
}
function colorGridEl(grids,gridEl){
    grids.forEach((gridItem) => {
        const gridId = Number(gridItem.dataset.boxId)
        const hr = Number(gridEl.hour)
        if (gridId <= hr){
            gridItem.classList.add('red-back')
        }
        if (gridId == (hr+1)){
            const min = gridEl.min
            gridItem.style.background = `linear-gradient(to top, rgb(183, 187, 183) ${min}%, rgba(0,0,0,0) ${min}%)`
        } 
    })
}

// function to display task info in graph
function getCurrentTask(){
    const tasksCont = document.querySelectorAll('.box')
    tasksCont.forEach((tasks) => {
        const contEl = document.querySelector('.task-info')
        tasks.addEventListener('click', () => {
            const eventId = tasks.dataset.taskId
            contEl.classList.remove('item-info')
            displayCurrentTask(eventId)
            let setTime = setInterval(() => {
                contEl.classList.add('item-info')
            }, 4000)
            let timeOut = setTimeout(() => {
                clearInterval(setTime)
            }, 4000)
        })
    })
    const weekCont = document.querySelectorAll('.weekbox')
    weekCont.forEach((week) => {
        week.addEventListener('click', () => {
            const eventId = week.dataset.taskId
            displayCurrentWeek(eventId)
        })
    })
}

function displayCurrentTask(eventId){
    const taskHead = document.getElementById('graph-head')
    const taskTime = document.getElementById('graph-time')
    const task = taskArray[eventId]
    const time = timeArray[eventId]
    taskHead.innerHTML = task
    taskTime.innerHTML = time
}
function displayCurrentWeek(eventId){
    const taskHead = document.getElementById('week-head')
    const taskTime = document.getElementById('week-time-st')
    const contEl = document.querySelector('.week-info')
    contEl.classList.remove('item-info')
    const task = weekDays[eventId]
    const time = weekTimeArray[eventId].weektime
    taskHead.innerHTML = task
    taskTime.innerHTML = time
    let setTime = setInterval(() => {
        contEl.classList.add('item-info')
    }, 4000)
    let timeOut = setTimeout(() => {
        clearInterval(setTime)
    }, 4000)
}

function dayWeekDisplay(){
    const dayBt = document.querySelector('#day')
    const weekBt = document.querySelector('#week')
    const weekCont = document.getElementById('week-container')
    const dayCont = document.getElementById('day-container')
    dayBt.addEventListener('click', () => {
        weekCont.classList.add('item-info')
        dayCont.classList.remove('item-info')
        weekBt.classList.remove('underlines')
        dayBt.classList.add('underlines')
        weekBt.classList.add('disabled')
        dayBt.classList.remove('disabled')
    })
    weekBt.addEventListener('click', () => {
        weekCont.classList.remove('item-info')
        dayCont.classList.add('item-info')
        weekBt.classList.add('underlines')
        dayBt.classList.remove('underlines')
        weekBt.classList.remove('disabled')
        dayBt.classList.add('disabled')
    })
}
dayWeekDisplay()



// Chart.JS workouts

// // function to transform time
// // function formatTime(time){
// //     return time == '0' ? 1 : time
// // }

// // displaying Chart.js
// function displayChart(){

//     new Chart("mychart", {
//         type : "bar",
//         data : {
//             labels : taskArray.map(task => task),
//             datasets : [{
//                 backgroundColor : 'rgb(166, 173, 166)',
//                 data : timeArray
//             }]
//         },
//         options : {
//             legend : {display: false},
//             scales : {
//                 yAxes : [{
//                     // min : 0,
//                     // max : 8,
//                     ticks : {
//                         beginAtZero : true,
//                         type : 'time',
//                         time : {
//                             unit : 'hour',
//                             tooltipFormat : 'HH:mm:ss'
//                         },
                        
//                         stepSize : .01
//                         // callback : function (value){
//                         //     return value.toFixed(2)
//                         // }
//                         // callback : function (value){
//                         //     value.map((item) => {
//                         //         return item.toFixed(1)
//                         //     })
//                         // }
//                     }
//                 }]
//             },
//             // barThickness : 20,
//             // categoryPercentage: 0.7,
//             title : {
//                 display : false,
//                 text : "Time Log"
//             }
//         }
//     })
// }
// displayChart()