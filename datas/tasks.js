// making a default list
const listDemo = [
    {
        tName : 'Meeting',
        tDesc : 'Value of Time',
        tTag : 'work',
        taskId : '',
        totalTime : ''
    }
]
export const tasks = JSON.parse(localStorage.getItem('tasks')) || []

export function addTask(task){
    tasks.push(task)
}

export function SaveToStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}