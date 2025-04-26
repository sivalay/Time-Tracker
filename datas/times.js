
// export const tasks = JSON.parse(localStorage.getItem('tasks'))
export let dates = JSON.parse(localStorage.getItem('dates')) || []

export function addTime(times){
    dates.push(times)
}

export function SaveTimes(){
    localStorage.setItem('dates', JSON.stringify(dates))
}

