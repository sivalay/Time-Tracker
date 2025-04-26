
import { lists } from "./lists.js"
// export let lists
// lists = [
//     {
//         name : 'ashk',
//         age : 21,
//         place : 'thaloor'
//     },
//     {
//         name : 'Keeth',
//         age : 60,
//         place : "UP"
//     }
// ]

const buttonEl = document.querySelector('.cont')
const startButton = document.querySelector('.t-button')
console.log(buttonEl)

startButton.addEventListener('click', (e) => {
    e.preventDefault()
    renderItem()
})

function renderItem(){
    buttonEl.innerHTML = lists.map((list) => {
        return `
            <div class="p-name">${list.name}</div>
            <div class="p-age">${list.age}</div>
            <div class="p-place">${list.place}</div>
        `
    })

}

buttonEl.innerHTML = `
            <div class="p-name">${lists.name}</div>
            <div class="p-age">${lists.age}</div>
            <div class="p-place">${lists.place}</div>
        `