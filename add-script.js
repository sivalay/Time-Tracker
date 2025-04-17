const taskName = document.querySelector('#task-name')
const taskDesc = document.querySelector('#task-description')
const taskTag = document.querySelector('#task-tag')
const addButton = document.querySelector('#add-btn')

const tasks = []

function addTasks(e){
    console.log(e)
    const tName = taskName.value
    const tDesc = taskDesc.value
    const tTag = taskTag.value

    const task = {
        tName,
        tDesc,
        tTag,
        taskId : 1
    }

    tasks.push(task)

}

addButton.addEventListener('click', (e) => {
    e.preventDefault()
    addTasks(e)
})
