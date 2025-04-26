// import { tasks } from "../main-script.js";
// import { printMsg } from "../timer-block/script.js"
import { lists } from "../daily-log/lists.js"

function printHello(){
    console.log("Hello its ruf.js page")
}

// printHello()

const ms = 'dates check'
// printMsg(ms)

function printDetails(){
    lists.map((list) => {
        console.log(list)
    })
}

printDetails()