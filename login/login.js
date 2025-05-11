
const loginHead = document.querySelector('#login')
const signinHead = document.querySelector('#signin')
const form1 = document.querySelector('#form1')
const form2 = document.querySelector('#form2')
const logBt = document.querySelector('.login-bt')
const signinBt = document.querySelector('.signin-bt')

const nameCont = document.querySelector('#signin-name')
const emailCont = document.querySelector('#signin-email')
const passCont = document.querySelector('#signin-pass')

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

const people = []

// function to get person Details
function addPerson(){
    const name = nameCont.value
    const email = emailCont.value
    const password = passCont.value
    const person = {
        name,
        email,
        password
    }
    people.push(person)
    console.log(people, 'people')
}

signinBt.addEventListener('click', () => {
    addPerson()
})

// logBt.innerHTML = 

