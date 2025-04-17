
const startButton = document.querySelector('.st-btn')
const stopButton = document.querySelector('.ed-btn')
const content = document.querySelector('.content-wrap')

let dates = []


function getStartTime(){
    const date = new Date()
    if (dates.length == 0 || dates.at(-1).status == true){
        let times = {
            start : `${date}`,
            end : '',
            id : '',
            status : false
        }
        dates.push(times)
        displayTime(dates)
    }
    // console.log(typeof resultHtml)
    // setInterval(() => console.log('hi'), 1000)
}

function displayTime(dates){
    content.innerHTML =dates.map((dateItem, id) => {

        const newdate = new Date(dateItem.start)
        const hours = newdate.getHours()
        const mins = newdate.getMinutes()
        const secs = newdate.getSeconds()
        dateItem.id = id

        return `
        <li class="li" data-index="${id}">
            <div>Start Time : <span class="start-time" id="task${id}">${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(secs)}</span></div>

            <div>End Time : <span class="end-time" id="task${id}">00 : 00 : 00</span></div>

            <div class="result-el">Result : <span id="result"></span></div>
        </li>
    `
    }).join('')
    // getRunTime(dates)

}



function getRunTime(dates){
    console.log("hi")
    const result = dates.map((dateItem, id) => {
        console.log('hello')
        if (dateItem.id == id){
            const resultEl = document.querySelector('#result')
            const time = new Date(dateItem.start)
            const currentTime = new Date()
            const timeDiff = (currentTime - time) / 1000
            const hours = Math.floor(timeDiff / 3600 % 24)
            const mins = Math.floor(timeDiff / 60) % 60
            const seconds = Math.floor(timeDiff) % 60            
            console.log(`${hours} : ${mins} : ${seconds}`)
            resultEl.innerHTML = `${formatTime(hours)} : ${formatTime(mins)} : ${formatTime(seconds)}`
            console.log(resultEl.innerHTML)
            console.log('hi')
        }
    }).join('')
    return result
}
// setInterval(getRunTime(dates), 1000)

function formatTime(time){
    return time < 10 ? (`0${time}`) : time
}


startButton.addEventListener('click', (e) => {
    getStartTime()
    setInterval(getRunTime(dates), 1000)
})
// if(!dates.length == 0){
//     setInterval(getRunTime(dates), 1000)
// }
// setInterval(getRunTime(dates), 1000)


// stopButton.addEventListener('click', getStartTime)

