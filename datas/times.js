
// export const tasks = JSON.parse(localStorage.getItem('tasks'))
export let dates = JSON.parse(localStorage.getItem('dates')) || []

export function addTime(times){
    dates.push(times)
}

export function SaveTimes(dates){
    localStorage.setItem('dates', JSON.stringify(dates))
}

// function to transform time
export function formatTime(time){
    return time < 10 ? (`0${time}`) : time
}