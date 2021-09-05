const input = document.querySelector('#input'),
    addUserbtn = document.querySelector('#submit'),
    userList = document.querySelector('#user-list'),
    clearbtn = document.querySelector("#clear"),
    startTime = document.querySelector('#start-time'),
    endTime = document.querySelector("#end-time"),
    time = document.querySelector('#time-btn');



const data = [

]

addUserbtn.addEventListener('click', () => {
    addUser()
})
clearbtn.addEventListener('click', () => {
    const obj = localStorage.getItem("data");
    const parsedData = JSON.parse(obj)
    console.log(parsedData[0])
})


// var idCount = 1;
function addUser() {
    let li = document.createElement('li');
    li.innerHTML = input.value;
    userList.appendChild(li);
    input.value = "";
    // idCount++;
}


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