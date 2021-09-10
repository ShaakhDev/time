

const input = document.querySelector('#input'),
    addUserbtn = document.querySelector('#submit'),
    userList = document.querySelector('#user-list'),
    clearbtn = document.querySelector("#clear"),
    startTime = document.querySelector('#start-time'),
    endTime = document.querySelector("#end-time"),
    time = document.querySelector('#time-btn'),
    getUsers = document.querySelector('#get-users')
var idCount = 1;



addUserbtn.addEventListener('click', () => {
    addUser()
})


getUsers.addEventListener('click', () => {
    fetch('/all')
        .then(res => res.json())
        .then(data => {
            let users = [...data];
            users.map((el, ind) => {
                let { id, name } = el;
                users[ind] = { id, name };

            })
            // console.log(users);
            addingTimesToUsers(users);
        })
        .catch(err => console.log(err))
})


//**********************************  Adding time to users   ************************************* */
function addingTimesToUsers(users) {
    let totalTime = getTimeDifference(startTime.value, endTime.value);
    let limitForOnePerson = Math.floor(totalTime[0] / users.length);
    let start = startTime.value;
    start = start.split(':').map((el) => parseInt(el));
    // start = parseInt(start)
    let end = calculateEndTime(start, limitForOnePerson);
    generateTimeToHtml(start, end, limitForOnePerson, users);
    console.log(start, end, limitForOnePerson)
    // console.log(users, limitForOnePerson)
}


function calculateEndTime(start, limit) {
    let qoldiq = (start[1] + limit) - 60
    if (qoldiq >= 0) {
        return [start[0] + 1, qoldiq];
    }
    else {
        return [start[0], start[1] + limit]
    }
}


function generateTimeToHtml(start, end, limit, users) {
    let generatedHTML = "";
    users.map(el => {
        generatedHTML += `
            <li>${el.name}<span>${start[0] + ":" + start[1] + "-" + end[0] + ":" + end[1]}</span></li>
        `
        start = [...end];
        end = calculateEndTime(start, limit);
    })
    userList.innerHTML = generatedHTML;
}
//**************************************************************************************************** */
function addUser() {
    if (input.value !== "") {
        let li = document.createElement('li');
        li.innerHTML = input.value;
        userList.appendChild(li);
        var user = { id: idCount, name: input.value }


        fetch('/adduser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })
            .then(res => {
                if (res.ok) {
                    console.log('User was added')
                    return
                }
                throw new Error('Request failed');
            })
            .catch(error => {
                console.log(error);
            });


        input.value = "";
        idCount++;
    }
    // else {
    //     alert('Maydonni to\'ldirish shart! ')
    // }


}

// ***************************************** clear database  ***********************************************/

clearbtn.addEventListener("click", () => {
    fetch('/clear', { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            if (res.ok) {
                console.log('Database was cleared')
                return;
            }
            throw new Error('request failed')

        })
        .catch(err => {
            console.log(err)
        })
})

//****************************************   calculating time ************************** */
function getTimeDifference(start, end) {
    let s = start.split(':'),
        e = end.split(':');
    //boshlanish vaqti bilan tugash vaqti oralig'idagi vaqtni minutga aylantirib hisobladim.
    var startDate = new Date(2021, 8, 4, s[0], s[1], 0)
    var endDate = new Date(2021, 8, 5, e[0], e[1], 0)
    var dif = endDate.getTime() - startDate.getTime()
    var minutes = Math.floor(dif / 1000 / 60)
    console.log(minutes, start)
    return [minutes, start];
}


//******************************************************************************************** */