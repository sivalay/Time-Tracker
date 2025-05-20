import { tasks,displayLocId } from "../datas/tasks.js"

const dateContainer = document.querySelector('.dates-container')
const dateHead = document.querySelector('.today-head')
const taskHead = document.querySelector('.time-log')

const doneBt = document.querySelector('#done-btn')

const searchEl = document.querySelector('#search')
const searchBt = document.querySelector('#search-button')
const homeBt = document.querySelector('.home-bt')

const graphGrid = document.querySelector('.grid-graph-container')

const perId = displayLocId('personId')
// console.log(perId, 'perId')

homeBt.addEventListener('click', (e) => {
    e.preventDefault()
    window.location = `../task-block/index.html?personId=${perId}`
})

const today = new Date()
let weekDates = []
let gridTimeArray = []
let taskArray = []
let timeArray = []
const now = new Date()
let maxHour = 0


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
    // console.log(startDate)

    for (let i=0; i<7; i++) {
        const current = new Date(startDate)
        current.setDate(current.getDate() + i)
        // console.log(current, 'current')
        const dates = {
                date : current,
                id : i
            }
        weekDates.push(dates)
    }
}

console.log(weekDates, "weekDates")

// function to display Dates
function displayDates(){
    let dateHtml = ''
    weekDates.map((dateItem) => {
        // console.log(dateItem.date)
        const dateString = (new Date(dateItem.date)).toLocaleDateString()

        dateHtml += `
            <div class="date" data-date-id="${dateItem.id}">${dateString}</div>
        `
    })
    dateContainer.innerHTML = dateHtml
}

// to get date
const dateEl = document.querySelectorAll('.date')

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
        console.log(matchDate, 'matchDate')
        dateHead.innerHTML = matchDate
        taskArray = []
        timeArray = []
        gridTimeArray = []
        displayTasks(matchItem.date)
        
    })
})

// to search date
searchBt.addEventListener('click', (e) => {
    e.preventDefault()
    const val = searchEl.value
    const newDate = new Date(val)
    const matchDate = newDate.toLocaleDateString()
    console.log(val, 'search-value')
    console.log(matchDate, 'date')
    dateHead.innerHTML = matchDate
    taskArray = []
    timeArray = []
    gridTimeArray = []
    displayTasks(newDate)
    displayEl(newDate)
    displayGraph()
    searchEl.value = ''
})


// display of tasks and times for the day
function displayTasks(now){
    let logDate
    taskHead.innerHTML = ''
    const currentDate = (new Date(now)).toLocaleDateString()
    tasks.map((task) => {    
        // console.log(task,"task")
        let diffSum = 0 
        let maxHourVar = 0
        if(task.pId == perId){
            // console.log(task, 'matching task')
        
            task.timeLogs.map((timeItem) => {
                logDate = (new Date(`${timeItem.endLog}`)).toLocaleDateString()
                // console.log(logDate, 'logDate')
                if (currentDate === logDate){
                    // console.log(task.timeLogs, task.tName, 'here')
                    // console.log(timeItem.newTimeDiff)
                    diffSum =diffSum + timeItem.newTimeDiff
                }
            })
            // console.log(diffSum, 'diffSum')
            if(diffSum != 0){
                if (diffSum > maxHourVar){
                    maxHourVar = diffSum
                    const mm = maxHour / 1000
                    const mh = Math.floor(mm / 3600 % 24)
                    maxHour = mh + 3
                    // console.log(maxHour, 'maxHour')
                }
                // diffSum = diffSum + timeItem.newTimeDiff
                const timeDiff = (diffSum) / 1000
                // console.log(timeDiff)
                const hours = Math.floor(timeDiff / 3600 % 24)
                const minss = (Math.floor(timeDiff / 60) % 60)
                console.log(minss, 'minss')
                const mins = Math.round((Math.floor(timeDiff / 60) % 60) / 10)
                console.log(mins, 'mins')
                const inHrd = (minss / 60) * 100
                console.log(inHrd, 'inHrd')
                // const min = formatTime(mins)
                // const seconds = (Math.floor(timeDiff) % 60) 
                const timeDiffHtml = `${hours}.${formatTime(minss)}`
                // console.log(timeDiffHtml)
                const timesEl = {
                    hour : hours,
                    mins : inHrd
                }
                timeArray.push(timeDiffHtml)
                gridTimeArray.push(timesEl)
                taskArray.push(task.tName)
            }
        }
        // console.log(timeArray, 'timeArray')
        // console.log(taskArray, 'taskArray')

    })
    // console.log(taskArray.length, 'length')
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
    displayChart()
    displayGraph()
}
displayTasks(now)
function formatTime(time){
    return time < 10 ? (`0${time}`) : time
}
// function to transform time
// function formatTime(time){
//     return time == '0' ? 1 : time
// }

// displaying Chart.js
function displayChart(){

    new Chart("mychart", {
        type : "bar",
        data : {
            labels : taskArray.map(task => task),
            datasets : [{
                backgroundColor : 'rgb(166, 173, 166)',
                data : timeArray
            }]
        },
        options : {
            legend : {display: false},
            scales : {
                yAxes : [{
                    // min : 0,
                    // max : 8,
                    ticks : {
                        beginAtZero : true,
                        type : 'time',
                        time : {
                            unit : 'hour',
                            tooltipFormat : 'HH:mm:ss'
                        },
                        
                        stepSize : .01
                        // callback : function (value){
                        //     return value.toFixed(2)
                        // }
                        // callback : function (value){
                        //     value.map((item) => {
                        //         return item.toFixed(1)
                        //     })
                        // }
                    }
                }]
            },
            // barThickness : 20,
            // categoryPercentage: 0.7,
            title : {
                display : false,
                text : "Time Log"
            }
        }
    })
}
displayChart()

function displayGraph(){
    graphView()
    displayGrid()
    colorGrid()
}
displayGraph()

// graph-grid
function graphView(){
    graphGrid.innerHTML = `
        <div class="graph-top">
            <div class="side-heads">
                <ul class="log-time-container" id="log-time">
                    
                </ul>
            </div>
            <div class="div-container">
                <div class="main-graph" id="graph-cont">
                   
                </div>
            </div>
        </div>
        <div class="down-heads">
            <ul class="log-task-container" id="log-task">
                
            </ul>
        </div>
    `
}

// graphView()

// displaying grid-time
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
    // console.log(gridTimeArray, 'gridTimeArray')
    taskContainer.forEach((taskc) => {
        const taskId = taskc.dataset.taskId
        let gridElHtml = ''
        for (let i=1; i<=maxHour; i++){
            gridElHtml += `<li class="box-col box${taskId}" id="col${i}" data-box-id="${i}"></li>`
        }
        taskc.innerHTML = gridElHtml
    })
}

// to color grid
function colorGrid(){
    gridTimeArray.forEach((gridTime,id) => {
        console.log(gridTime,id)
        const grids = document.querySelectorAll(`.box${id}`)
        grids.forEach((gridItem) => {
            const gridId = Number(gridItem.dataset.boxId)
            const hr = Number(gridTimeArray[id].hour)
            if (gridId <= hr){
                gridItem.classList.add('red-back')
            }
            if(gridId == (hr+1)){
                const min = gridTimeArray[id].mins
                gridItem.style.background = `linear-gradient(to top, rgb(183, 187, 183) ${min}%, rgba(0,0,0,0) ${min}%)`
            }
        })
    })
}
console.log(gridTimeArray, 'gridTimeArray')
