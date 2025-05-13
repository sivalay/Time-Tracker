
export const people = JSON.parse(localStorage.getItem('people')) || []

export function addPerson(person){
    people.push(person)
}

export function savePerson(){
    localStorage.setItem('people', JSON.stringify(people))
}

export let personId