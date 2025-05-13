import { tasks, addTask, SaveToStorage } from "../datas/tasks.js"
import { dates, addTime, SaveTimes } from "../datas/times.js"
import { people, personId } from "../datas/people.js"


const addEl = document.querySelector('#add-el')
const backButton = document.querySelector('.back-btn')
const addContainer = document.querySelector('#add-container')

const taskName = document.querySelector('#task-name')
const taskDesc = document.querySelector('#task-description')
const taskTag = document.querySelector('#task-tag')
const addButton = document.querySelector('#add-btn')
const editButton = document.querySelector('#edit-btn')
const taskList = document.querySelector('.tas')

const searchEl = document.querySelector('#search')
const searchBt = document.querySelector('#search-button')

const personInfo = document.querySelector('.person')
const infoCont = document.querySelector('.info-cont')
const personBackBt = document.querySelector('.person-back-btn')
const personContainer = document.querySelector('.person-info-cont')
const logBt = document.querySelector('.log-bt')

console.log(personInfo, 'personInfo')

const loc = window.location
const locParse = new URL(loc).searchParams
let perId = parseInt(locParse.get("personId"))
console.log(perId, 'perId')
// personId = perId
console.log(personId, 'personId')

logBt.addEventListener('click', (e) => {
    e.preventDefault()
    window.location = `../daily-log/daily-log.html?personId=${perId}`
})

function addTasks(e){
    const tName = taskName.value
    const tDesc = taskDesc.value
    const tTag = taskTag.value
    let tId

    if (tasks.length == 0){
        tId = 0
    }
    if (tasks.length != 0){
        tId = tasks.at(-1).taskId + 1
    }
    console.log(tId, 'tId')

    const task = {
        tName,
        tDesc,
        tTag,
        taskId : tId,
        totalTime : '',
        taskStatus : '',
        timeLogs : []
    }
    addTask(task)
    // localStorage.setItem('tasks', JSON.stringify(tasks))
    SaveToStorage()
    displayTasks(tasks)

}

function displayTasks(tasks){
    taskList.innerHTML = tasks.map((task) => {
        return `
            <div class="task-container" id="task${task.taskId}">
                <a class="task-head" href="../timer-block/index.html?personId=${perId}&taskId=${task.taskId}" data-task-id="${task.taskId}">
                    <h3>${task.tName}</h3><span>${task.tDesc}</span><span>${task.tTag}</span>
                </a>
                <div class="task-buttons">
                    <button class="button" id="edit-el" data-task-id="${task.taskId}"><i class="fas fa-pen"></i>Edit</button>
                    <button class="button" id="delete-el" data-task-id="${task.taskId}"><i class="fas fa-trash"></i>Delete</button>
                </div>
            </div>
        `
    }).join('')
    console.log(taskList)

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
        console.log(itemId)
        let matchItem
        tasks.map((task) => {
            if (task.taskId == itemId){
                matchItem = task
            }
        })
        const index = tasks.indexOf(matchItem)
        tasks.splice(index, 1)
        const timeList = dates.filter(dateItem => dateItem.taskId != matchItem.taskId)
        console.log(timeList, 'timeList')
        SaveTimes(timeList)

        // console.log(count)
        // localStorage.setItem('tasks', JSON.stringify(tasks))
        SaveToStorage()
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

            // localStorage.setItem('tasks', JSON.stringify(tasks))
            SaveToStorage()
            unDisplayAdd()
        })        
    })
})


// to add task
addButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('hi')
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
    let tsListHtml = ''
    const searchValue = searchEl.value
    allBt.classList.remove('item-info')
    console.log(searchValue)
    tasks.forEach((task) => {
        if (task.tTag == searchValue){
            console.log(task)
            tsListHtml += `
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
    console.log(tsListHtml)
    searchEl.value = ''
    taskList.innerHTML = tsListHtml
}

allBt.addEventListener('click', () => {
    location.reload()
})

searchBt.addEventListener('click', (e) => {
    e.preventDefault()
    searchTasks()
})

// to display person details
function displayPerson(){
    let matchItem
    people.map((peo) => {
        if (peo.pId == perId){
            matchItem = peo
            console.log(matchItem, 'matchItem')
        }
        console.log(peo, 'peo-element')
    })
    infoCont.innerHTML = `
        <div>
            <div class="person-email">${matchItem.email}</div>
            <div class="person-pic">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            </div>
            <div class="person-name">${matchItem.name}</div>
        </div>
    `
}

personInfo.addEventListener('click', (e) => {
    e.preventDefault()
    personContainer.classList.remove('item-info')
    displayPerson()
})
console.log(personBackBt,'back-btn')

personBackBt.addEventListener('click', () => {
    personContainer.classList.add('item-info')
})

