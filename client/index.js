
// When Page Loads for First Time
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/getAll")
    .then(resp => resp.json())
    .then(data => loadHTMLTable(data['data']));
})

document.getElementById("home").addEventListener("click" ,()=>{
    location.reload();
})

const scheduleBtn = document.getElementById("schedule");
const deleteBtn = document.querySelector(".delete-row-btn");
const editBtn = document.querySelector(".edit-row-btn");
const updateBtn = document.getElementById("update-btn");

// Keeping track checkboxes by adding a event listener on each of them
const checkboxes = document.getElementsByClassName("checkbox-data");
var names = []
for ( let i = 0; i < checkboxes.length; i++ ) {
    checkboxes[i].addEventListener("change", () => {

        for ( let i = 0; i < checkboxes.length; i++ ) {
            if (checkboxes[i].checked)
                names.push(checkboxes[i].value);
            }
    });
}

// Getting values of DOM elements start_time and end_time
function getDetails()
{
    const stInput = document.getElementById("startTime");
    const etInput = document.getElementById("endTime");

    const st = stInput.value;
    const et = etInput.value;

    return ([st,et]);
}

// Sending data to server when schedule button is clicked
scheduleBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    const [st,et] = getDetails()

    if(st === "" || et === "")
    {
        const msg = document.getElementById("message");
        msg.textContent = "Please set time.";
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
    else if(names.length > 1)
    {
        const msg = document.getElementById("message");
        msg.textContent = "Please select only one participants.";
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
    else
    {
        fetch('http://localhost:5000/insert',{
            headers:{
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({startTime : st, endTime : et, name: names})
        })
        .then(resp => resp.json())
        .then(data => insertDataIntoTable(data['data']));
        setTimeout(() => {
            location.reload();
        }, 0);
    }
})

// Inserting new data into table
function insertDataIntoTable(data){

    const table = document.getElementById("tbody");
    const isDataInTable = table.querySelector('.no-data');
    
    let tableHTML = "<tr>";
    for(let key in data)
    {
        if(data.hasOwnProperty(key)){
            tableHTML += `<td>${data[key]}</td>`;
        }
    }

    tableHTML +=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>
                    <td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>
                </tr>`

    if(isDataInTable)
        table.innerHTML = tableHTML;
    else{
        const newRow = table.insertRow();
        newRow.innerHTML = tableHTML;
    }
}

// Function that run when reloads
function loadHTMLTable(data)
{
    const table = document.getElementById("tbody");
    if(!data){
        table.innerHTML = "<tr><td class='no-data' colspan='6'>No Data</td></tr>";
        return ;
    }
        
    let tableHTML = "";

    data.forEach(({id,name,start_time,end_time})=> {
        tableHTML +=`<tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${start_time}</td>
                        <td>${end_time}</td>
                        <td><button class="delete-row-btn" data-id=${id}>Delete</button></td>
                        <td><button class="edit-row-btn" data-id=${id}>Edit</button></td>
                    </tr>`
    });

    table.innerHTML = tableHTML;
}


document.getElementById("tbody").addEventListener('click',(e)=>{
    if(e.target.className === "delete-row-btn")
    {
        deleteRowById(e.target.dataset.id);
    }
    else if(e.target.className === "edit-row-btn")
    {
        handleEditRow(e.target.dataset.id);
    }
})

// Sending id of row to server which going to be delete
function deleteRowById(id)
{
    fetch('http://localhost:5000/delete/'+id,{
        method:'DELETE',
    })
    .then(resp => resp.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    });
}

function handleEditRow(id){

    const update = document.querySelector('.update');
    update.hidden = false;
    document.getElementById('update-btn').dataset.id = id;
}

// Sending id,startTime,endTime of row to server for editing
updateBtn.addEventListener('click',()=>{
    const updatedStartTime = document.getElementById('updateStartTime');
    const updatedEndTime = document.getElementById('updateEndTime');

    fetch('http://localhost:5000/update/',{
        method:'PATCH',
        headers:{
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: updateBtn.dataset.id,
            startTime: updatedStartTime.value,
            endTime: updatedEndTime.value
        })
    })
    .then(resp => resp.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    });
})

