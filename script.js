
const addEl = document.querySelector('#add-el')
const backButton = document.querySelector('.back-btn')
const addContainer = document.querySelector('#add-container')

const taskName = document.querySelector('#task-name')
const taskDesc = document.querySelector('#task-description')
const taskTag = document.querySelector('#task-tag')
const addButton = document.querySelector('#add-btn')
const editButton = document.querySelector('#edit-btn')
const taskList = document.querySelector('.tasks-wrap')

const searchEl = document.querySelector('#search')
const searchBt = document.querySelector('#search-button')
// console.log(searchEl)
// console.log(searchBt)

const tasks = JSON.parse(localStorage.getItem('tasks'))

function addTasks(e){
    const tName = taskName.value
    const tDesc = taskDesc.value
    const tTag = taskTag.value

    const task = {
        tName,
        tDesc,
        tTag,
        taskId : ''
    }
    console.log(e)
    tasks.push(task)
    displayTasks(tasks)
    localStorage.setItem('tasks', JSON.stringify(tasks))

}

function displayTasks(tasks){
    taskList.innerHTML = tasks.map((task, id) => {
        task.taskId = id
        return task ? `
            <div class="task-container" id="task${id}">
                <a class="task-head" href="timer-block/index.html">
                    <h3>${task.tName}</h3><span>${task.tDesc}</span><span>${task.tTag}</span>
                </a>
                <div class="task-buttons">
                    <button class="button" id="edit-el" data-task-id="${id}"><i class="fas fa-pen"></i>Edit</button>
                    <button class="button" id="delete-el" data-task-id="${id}"><i class="fas fa-trash"></i>Delete</button>
                </div>
            </div>
        ` : `
            <div class="task-container">
                <div><h3>Add Tasks</h3></div>
            </div>
        `
    }).join('')

    taskName.value = ''
    taskDesc.value = ''
    taskTag.value = ''

}
displayTasks(tasks)


// to delete the item
const deleteEl = document.querySelectorAll('#delete-el')

deleteEl.forEach((item) => {
    item.addEventListener('click', () => {
        const itemId = item.dataset.taskId
        const taskCont = document.querySelector(`#task${itemId}`)
        taskCont.remove()
        tasks.splice(itemId, 1)
        localStorage.setItem('tasks', JSON.stringify(tasks))
    })
})


// to edit task details
const editEl = document.querySelectorAll('#edit-el')

editEl.forEach((item) => {
    item.addEventListener('click', () => {
        let matchItem
        const itemId = item.dataset.taskId
        addContainer.classList.remove('item-info')
        addButton.classList.add('add-task')
        editButton.classList.remove('edit-task')
        tasks.forEach((task) => {
            if(task.taskId == itemId){
                matchItem = task
            }
        })
        taskName.value = matchItem.tName
        taskDesc.value = matchItem.tDesc
        taskTag.value = matchItem.tTag

        editButton.addEventListener('click', (e) => {
            e.preventDefault()
            matchItem.tName = taskName.value
            matchItem.tDesc = taskDesc.value
            matchItem.tTag = taskTag.value

            localStorage.setItem('tasks', JSON.stringify(tasks))
            unDisplayAdd()
        })        
    })
})


// to add task
addButton.addEventListener('click', (e) => {
    e.preventDefault()
    addTasks()
})


// to display the add container
function displayAdd(){
    addContainer.classList.remove('item-info')
}
addEl.addEventListener('click', displayAdd)

// to undisplay the add container
function unDisplayAdd(){
    taskName.value = ''
    taskDesc.value = ''
    taskTag.value = ''
    addButton.classList.remove('add-task')
    editButton.classList.add('edit-task')
    addContainer.classList.add('item-info')
    location.reload()
}
backButton.addEventListener('click', unDisplayAdd)


// to search tasks
const allBt = document.querySelector('.all-btn')

function searchTasks(){
    const searchValue = searchEl.value
    allBt.classList.remove('item-info')
    console.log(searchValue)
    tasks.forEach((task) => {
        if (task.tTag == searchValue){
            console.log(task)
            taskList.innerHTML = `
            <div class="task-container" id="task${task.taskId}">
                <a class="task-head" href="timer-block/index.html">
                    <h3>${task.tName}</h3><span>${task.tDesc}</span><span>${task.tTag}</span>
                </a>
                <div class="task-buttons">
                    <button class="button" id="edit-el" data-task-id="${task.taskId}"><i class="fas fa-pen"></i>Edit</button>
                    <button class="button" id="delete-el" data-task-id="${task.taskId}"><i class="fas fa-trash"></i>Delete</button>
                </div>
            </div>
            `
        }
    })
    searchEl.value = ''
}

allBt.addEventListener('click', () => {
    location.reload()
})

searchBt.addEventListener('click', (e) => {
    e.preventDefault()
    searchTasks()
})