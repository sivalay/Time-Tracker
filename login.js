import { people,addPerson,savePerson,personId } from "./datas/people.js"

const loginHead = document.querySelector('#login')
const signinHead = document.querySelector('#signin')
const form1 = document.querySelector('#form1')
const form2 = document.querySelector('#form2')
const logBt = document.querySelector('.login-link')
const signinBt = document.querySelector('.signin-bt')

const nameCont = document.querySelector('#signin-name')
const emailCont = document.querySelector('#signin-email')
const passCont = document.querySelector('#signin-pass')

const logNameCont = document.querySelector('#login-name')
const logPassCont = document.querySelector('#login-pass')
const errorMsg = document.querySelector('.error')

loginHead.addEventListener('click', () => {
    signinHead.classList.add('disabled')
    signinHead.classList.remove('underlines')
    form2.classList.add('item-info')

    loginHead.classList.remove('disabled')
    loginHead.classList.add('underlines')
    form1.classList.remove('item-info')

})

signinHead.addEventListener('click', () => {
    signinHead.classList.remove('disabled')
    signinHead.classList.add('underlines')
    form1.classList.add('item-info')

    loginHead.classList.add('disabled')
    loginHead.classList.remove('underlines')
    form2.classList.remove('item-info')

})

// const people = []

// function to get person Details
function addToPeople(){
    const name = nameCont.value
    const email = emailCont.value
    const password = passCont.value
    let pId

    if (people.length == 0){
        pId = 0
    }
    if (people.length != 0){
        pId = people.at(-1).pId + 1
    }

    const person = {
        name,
        email,
        password,
        pId
    }
    // people.push(person)
    addPerson(person)
    savePerson()
    console.log(people, 'people')
}

signinBt.addEventListener('click', () => {
    addToPeople()
})

logBt.addEventListener('click', (e) => {
    e.preventDefault()
    let matchItem
    console.log(matchItem)
    const name = logNameCont.value
    const password = logPassCont.value
    console.log(name, password)
    people.map((peo) => {
        console.log(peo.password)
        if ((peo.name == name) && (peo.password == password)){
            matchItem = peo.pId
            console.log(matchItem, 'matchItem')
        }
    })
    if (name && password){
        if (matchItem != undefined){
            window.location = `./task-block/index.html?personId=${matchItem}`
        }else{
            errorMsg.innerHTML = 'You are not Signed In..'
        }
    }else{
        errorMsg.innerHTML = 'Please Enter the input.'
    }
})

// logBt.innerHTML = 

