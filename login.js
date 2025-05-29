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
const eyeEl = document.querySelector('#eye-block1')

const logNameCont = document.querySelector('#login-name')
const logPassCont = document.querySelector('#login-pass')
const logEyeEl = document.getElementById('eye-block')
const errorMsg = document.querySelector('.error')

loginHead.addEventListener('click', () => {
    signinHead.classList.add('disabled')
    signinHead.classList.remove('underlines')
    form2.classList.add('item-info')

    loginHead.classList.remove('disabled')
    loginHead.classList.add('underlines')
    form1.classList.remove('item-info')
    errorMsg.innerHTML = ''

})

signinHead.addEventListener('click', () => {
    signinHead.classList.remove('disabled')
    signinHead.classList.add('underlines')
    form1.classList.add('item-info')

    loginHead.classList.add('disabled')
    loginHead.classList.remove('underlines')
    form2.classList.remove('item-info')

})

// function to get person Details
function addToPeople(){
    const name = nameCont.value
    const email = emailCont.value
    const password = passCont.value
    let pId

    if (!name){
        errorMsgs("Name must be filled out")
    }else if(!email){
        errorMsgs("Please fill email")
    }else if(!password){
        errorMsgs("Password must be filled out")
    }else{
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
        addPerson(person)
        savePerson()
        console.log(people, 'people')
        successMsg("Successfully Signed in")
        nameCont.value = ''
        emailCont.value = ''
        passCont.value = ''
    }
}
function errorMsgs(text){
    errorMsg.innerHTML = `${text}`
}
function successMsg(text){
    errorMsg.innerHTML = `${text}`
    errorMsg.style.color = 'green'
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
    people.map((peo) => {
        if ((peo.name == name) && (peo.password == password)){
            matchItem = peo.pId
            console.log(matchItem, 'matchItem')
        }
    })
    if (name && password){
        if (matchItem != undefined){
            window.location = `./task-block/index.html?personId=${matchItem}`
        }else{
            errorMsgs('You are not Signed In..')
        }
    }else{
        errorMsgs('Please Enter the input.')
    }
})

// logBt.innerHTML = 
eyeEl.addEventListener('click', () => {
    if (passCont.type == 'password'){
        passCont.type = 'text'
    }else {
        passCont.type = 'password'
    }
})
logEyeEl.addEventListener('click', () => {
    if (logPassCont.type == 'password'){
        logPassCont.type = 'text'
    }else {
        logPassCont.type = 'password'
    }
})

