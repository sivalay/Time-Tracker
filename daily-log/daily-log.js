import { tasks } from "../datas/tasks.js"

// const myCanvas = document.querySelector('#mychart')
const dateContainer = document.querySelector('.dates-container')
const dateHead = document.querySelector('.today-head')
const taskHead = document.querySelector('.time-log')

const display = document.querySelector('.output-log')
const inputs = document.querySelector('#date-input')
const doneBt = document.querySelector('#done-btn')



const today = new Date()
let weekDates = []
let taskArray = []
let timeArray = []
const rufTime = [6, 2]
const rufTask = ['alksdj', 'lkjdoi']
const backColor = ['red', 'green']
const now = new Date()


function displayEl(){
    getWeek()
    displayDates()
    // displayTasks(now)
    // location.reload()
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
        console.log(matchDate, 'matchDate')
        dateHead.innerHTML = matchDate
        taskArray = []
        timeArray = []
        displayTasks(matchItem.date)
        
    })
})


// first display of tasks for today
function displayTasks(now){
    let logDate
    taskHead.innerHTML = ''
    const currentDate = (new Date(now)).toLocaleDateString()
    // console.log(currentDate, 'currentDate')
    tasks.map((task) => {    
        let diffSum = 0  
        task.timeLogs.map((timeItem) => {
            logDate = (new Date(`${timeItem.endLog}`)).toLocaleDateString()
            // console.log(logDate, 'logDate')
            if (currentDate === logDate){
                
                console.log(task.timeLogs, task.tName, 'here')
                console.log(timeItem.newTimeDiff)

                diffSum =diffSum + timeItem.newTimeDiff
            }
        })
        // console.log(diffSum, 'diffSum')
        if(diffSum != 0){
            // diffSum = diffSum + timeItem.newTimeDiff
            const timeDiff = (diffSum) / 1000
            // console.log(timeDiff)
            const hours = Math.floor(timeDiff / 3600 % 24)
            const mins = Math.floor(timeDiff / 60) % 60
            console.log(mins, 'mins')
            // const seconds = (Math.floor(timeDiff) % 60) 
            const timeDiffHtml = `${formatTime(hours)}.${formatTime(mins)}`
            // console.log(timeDiffHtml)
            timeArray.push(timeDiffHtml)
            taskArray.push(task.tName)
        }
        // diffSum = 0
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

// function to transform time
function formatTime(time){
    return time < 10 ? (`0${time}`) : time
}

// function to get the touched date graph
// function touchruf(now){
//     const nowDate = (new Date(now)).toLocaleDateString()
//     console.log(nowDate, 'now-date-string')
//     tasks.map((taskItem) => {
//         taskItem.timeLogs.map((log) => {
//             const logDate = (new Date(`${log.endLog}`)).toLocaleDateString()
//             console.log(logDate, 'now-date-fromlog')
//             if (logDate === nowDate){
//                 console.log(log, 'This is the log')
//                 // console.log(logDate, "This is the log")
//                 console.log(logDate)
//                 // displayChart()
//             }
//         })
//     })
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
            legent : {display: false},
            scales : {
                yAxes : [{
                    ticks : {
                        beginAtZero : true
                    }
                }]
            },
            title : {
                display : true,
                text : "Time Log"
            }
        }
    })
}
displayChart()



// function printingMsg(msg){
//     console.log("The msg wanted to print")
//     console.log("Here..")
//     console.log(msg, 'var')
// }


// how to draw a graph in canvas with javascript!?



