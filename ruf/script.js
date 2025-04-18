
const startButton = document.querySelector('.st-btn')
const stopButton = document.querySelector('.ed-btn')
const content = document.querySelector('.content-wrap')
const timeContainer = document.querySelector('.time-wrap')

let dates = []

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
    }
    // console.log(typeof resultHtml)
    // setInterval(() => console.log('hi'), 1000)
}

function displayTime(dates){
    timeContainer.innerHTML =dates.map((dateItem, id) => {

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

        return `
        <li class="li" data-index="${id}">
            <div>Start Time : <span class="start-time" id="task${id}">${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(secs)}</span></div>

            <div>End Time : <span class="end-time" id="task${id}">${endTimeHtml}</span></div>

            <div class="result-el">Time Duration : <span id="result">${dateItem.timeDiff}</span></div>
        </li>
    `
    }).join('')
    // getRunTime(dates)

}


// function to get runTime

function getRunTime(dates){
    // console.log("hi")
    const result = dates.map((dateItem, id) => {
        // console.log('hello')
        
        if (dateItem.status === 'processing'){
            displayTime(dates)
            const resultEl = document.querySelector('#result')
            const time = new Date(dateItem.start)
            const currentTime = new Date()
            const timeDiff = (currentTime - time) / 1000
            const hours = Math.floor(timeDiff / 3600 % 24)
            const mins = Math.floor(timeDiff / 60) % 60
            const seconds = Math.floor(timeDiff) % 60            
            // console.log(`${hours} : ${mins} : ${seconds}`)
            // if (dateItem.timeDiff == ''){
            //     resultEl.innerHTML = `${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(seconds)}`
            // }
            dateItem.timeDiff = `${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(seconds)}`

            console.log(dates)
            // console.log(resultEl.innerHTML)
            // console.log('hi')
        }
    }).join('')
    return result
}
setInterval(getRunTime(dates), 1000)

function formatTime(time){
    return time < 10 ? (`0${time}`) : time
}


startButton.addEventListener('click', (e) => {
    getStartTime()
    setInterval(getRunTime(dates), 1000)
})

// function to get End Time

function getEndTime(){
    const date = new Date()
    // const hours = date.getHours()
    // const mins = date.getMinutes()
    // const secs = date.getSeconds()
    // console.log(dates,'first')
    const r = dates.map((item, id) => {
        if (item.status === 'processing'){
            // const endTimeEl = document.querySelector('.end-time')
            // endTimeEl.innerHTML = `${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(secs)}`
            // console.log(endTimeEl)
            // const resultEl = document.querySelector('#result')
            // console.log(resultEl.innerHTML)
            // item.timeDiff = resultEl.innerHTML
            item.end = `${date}`
            item.status = 'done'
            // displayTime(dates)
            // setInterval(getRunTime(dates), 1000)
            console.log(dates, 'after-end')
            
        }
    })
    // console.log(dates, 'second')
}

stopButton.addEventListener('click', () => {
    setInterval(getRunTime(dates), 1000)
    getEndTime()
    displayTime(dates)
    clearInterval()
})

