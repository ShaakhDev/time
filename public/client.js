
///////////////////////////////////////////////////////////////////////////////
// ███████╗██╗  ██╗ █████╗  █████╗ ██╗  ██╗██╗  ██╗██████╗ ███████╗██╗   ██╗ //
// ██╔════╝██║  ██║██╔══██╗██╔══██╗██║ ██╔╝██║  ██║██╔══██╗██╔════╝██║   ██║ //
// ███████╗███████║███████║███████║█████╔╝ ███████║██║  ██║█████╗  ██║   ██║ //
// ╚════██║██╔══██║██╔══██║██╔══██║██╔═██╗ ██╔══██║██║  ██║██╔══╝  ╚██╗ ██╔╝ //
// ███████║██║  ██║██║  ██║██║  ██║██║  ██╗██║  ██║██████╔╝███████╗ ╚████╔╝  //
// ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝  ╚═══╝   //
///////////////////////////////////////////////////////////////////////////////
const userInput = document.querySelector('#user-input'),
    addUserbtn = document.querySelector('#submit'),
    idOfUserForExtra = document.querySelector('#id-of-user'),
    extraTimeForUser = document.querySelector('#time-for-user'),
    totalExtraMinutes = document.querySelector('#peregon'),
    clearDB = document.querySelector("#clear-db"),
    startTime = document.querySelector('#start-time'),
    endTime = document.querySelector("#end-time"),
    getUsers = document.querySelector('#get-users'),
    userList = document.querySelector('#user-list')
var idCount = 1;

//eventListener for adding new user to db.>>>>
addUserbtn.addEventListener('click', () => {
    addUser();
})
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  SENDING USER'S DATA TO DB   @@@@@@@@@@@@@@@@@@@@@@@@@@
//fetching user's data to database and write username to user's list on document.>>>>
function addUser() {
    if (userInput.value !== "") {
        let li = document.createElement('li');
        li.innerHTML = userInput.value;
        userList.appendChild(li);
        var user = { id: idCount, name: userInput.value }
        fetch('/adduser', {//_____________________________FETCH
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => {
                if (res.ok) {
                    console.log('User was added');
                    return;
                }
                throw new Error('Request failed');
            })
            .catch(error => {
                console.log(error);
            });
        userInput.value = "";
        idCount++;
    }
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


function createObjectForExtraTime() {//this function take data from input about extra time takers.
    let obj = {};
    obj.id = idOfUserForExtra.value;
    obj.extraTime = extraTimeForUser.value;
    return obj;
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   GETTING USER'S DATA FROM  DB   @@@@@@@@@@@@@@@@@@@
getUsers.addEventListener('click', () => {
    fetch('/all')//_____________________________________FETCH
        .then(res => res.json())
        .then(data => {
            let users = [...data];
            users.map((el, ind) => {
                let { id, name } = el;
                users[ind] = { id, name };
            })
            calculateLimitForOnePerson(users);
        })
        .catch(err => console.log(err))
})

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@      ADDING TIMES TO USERS    @@@@@@@@@@@@@@@@@@@@@@@@
function calculateLimitForOnePerson(users) {
    let totalExtraMins = totalExtraMinutes.value;
    let totalTime = getTotalMinutes(startTime.value, endTime.value);
    let limitForOnePerson = Math.floor((totalTime[0] - totalExtraMins) / users.length);
    let start = startTime.value;
    start = start.split(':').map((el) => parseInt(el));
    let end = calculateEndTime(start, limitForOnePerson);
    generateTimeToHtml(start, end, limitForOnePerson, users);
}

//this function calculates 
function getTotalMinutes(start, end) {
    let s = start.split(':'),
        e = end.split(':');
    var startDate = new Date(2021, 8, 4, s[0], s[1], 0)
    var endDate = new Date(2021, 8, 5, e[0], e[1], 0)
    var dif = endDate.getTime() - startDate.getTime()
    var minutes = Math.floor(dif / 1000 / 60)
    return [minutes, start];
}

//this function calculates ending time for each user.
function calculateEndTime(start, limit) {
    let difference = (start[1] + limit) - 60;
    if (difference >= 120) return [(start[0] + 3) > 23 ? start[0] - 22 : start[0] + 3, difference - 120];
    else {
        if (120 > difference && difference >= 60) return [(start[0] + 2) > 23 ? start[0] - 22 : start[0] + 2, difference - 60];
        else {
            if (60 > difference && difference >= 0) return [(start[0] + 1) > 23 ? start[0] - 23 : start[0] + 1, difference];
            else return [start[0], start[1] + limit]
        }
    }
}

var dataExtra = [];
//this function generates all time data to each users and writes it to html
function generateTimeToHtml(start, end, limit, users) {
    let item = createObjectForExtraTime();
    dataExtra.push(item)
    var index = 0;
    let generatedHTML = "";
    users.map((el) => {
        generatedHTML += `
            <li>${el.name}<span>${(start[0] < 10 ? "0" + start[0] : start[0]) + ":" + (start[1] < 10 ? "0" + start[1] : start[1]) + "-" + (end[0] < 10 ? "0" + end[0] : end[0]) + ":" + (end[1] < 10 ? "0" + end[1] : end[1])}</span></li>
        `
        start = [...end];
        if (el.id == Number(dataExtra[index].id) - 1) {
            end = calculateEndTime(start, (limit + parseInt(dataExtra[index].extraTime)));
            if (index < dataExtra.length - 1) {
                index++;
            }
        } else {
            end = calculateEndTime(start, limit);
        }
    })
    userList.innerHTML = generatedHTML;
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  CLEAR ALL USER'S DATA FROM DB   @@@@@@@@@@@@@@@@@@@@@@@@
clearDB.addEventListener("click", () => {
    fetch('/clear', { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            if (res.ok) return console.log('Database was cleared');
            throw new Error('request failed');
        })
        .catch(err => {
            console.log(err);
        })
})
