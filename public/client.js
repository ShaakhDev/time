

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


function fetchGetUsers() {

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
    console.log(minutes);

}
time.addEventListener('click', () => {//bu funksiya faqat konsolga minutni chiqarish uchun
    getTimeDifference(startTime.value, endTime.value)
})

//******************************************************************************************** */