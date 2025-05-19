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
let taskArray = []
let timeArray = []
const rufTime = [6, 2]
const rufTask = ['alksdj', 'lkjdoi']
const backColor = ['red', 'green']
const now = new Date()


function displayEl(){
    getWeek(today)
    displayDates()
}
displayEl()

// to get the whole week
function getWeek(day){
    const startDate = day
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
    displayTasks(newDate)
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
                // diffSum = diffSum + timeItem.newTimeDiff
                const timeDiff = (diffSum) / 1000
                // console.log(timeDiff)
                const hours = Math.floor(timeDiff / 3600 % 24)
                const minss = (Math.floor(timeDiff / 60) % 60)
                console.log(minss, 'minss')
                const mins = Math.round((Math.floor(timeDiff / 60) % 60) / 10)
                console.log(mins, 'mins')
                const inHrd = (60 / 60) * 100
                console.log(inHrd, 'inHrd')
                // const min = formatTime(mins)
                // const seconds = (Math.floor(timeDiff) % 60) 
                const timeDiffHtml = `${hours}.${formatTime(minss)}`
                // console.log(timeDiffHtml)
                timeArray.push(timeDiffHtml)
                taskArray.push(task.tName)
            }
        }
        console.log(timeArray, 'timeArray')
        console.log(taskArray, 'taskArray')

    })
    console.log(taskArray.length, 'length')
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

// graph-grid
function graphView(){
    graphGrid.innerHTML = `
        <div class="graph-top">
            <div class="side-heads">
                <ul class="log-time-container">
                    
                </ul>
            </div>
            <div class="div-container">
                <div class="main-graph">
                    <ul class="box">
                        <li class="box-col red-back"></li>
                        <li class="box-col red-back bend"></li>
                    </ul>
                    <ul class="box">
                        <li class="box-col half-back bend"></li>
                        <li class="box-col"></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="down-heads">
            <ul class="log-task-container">
                <li class="task" id="task1">task1</li>
                <li class="task" id="task2">task2</li>
            </ul>
        </div>
    `
}

graphView()

// function drawGraph(){

// }

// if (diffSum > maxHour){
//     console.log('its greater')
//     maxHour = diffSum
// }
// displaying grid-taskName
// taskArray.forEach((task) => {
//     console.log(task, 'task')
//     taskDown.innerHTML += `<li class="task" id="task1">${task}</li>`
// })
// displaying grid-time
// console.log(timeArray, 'timeArray')
// timeArray.forEach((time) => {

// })
