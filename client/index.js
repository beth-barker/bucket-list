

const addItem = document.querySelector('#newBtn')
const detailsBtn = document.querySelector('#details')
const newInput = document.querySelector('#newInput')
const bucketList = document.querySelector('#listDisplay')
const img = document.querySelector('#imgInput')
const desc = document.querySelector('#descInput')
const activitiies = document.querySelector('#activityDisplay')
const activityDet = document.querySelector('#activityDetails')
const updateDetails = document.querySelector('#myForm')
const cancelBtn = document.querySelector('#closeForm')
const itemSelect = document.querySelector('#itemSelect')
const accBtn = document.querySelector('#acchomplishBtn')


const baseURL = 'http://localhost:6789'


function getAllActivities () {
    activitiies.innerHTML = ''

    axios.get(`${baseURL}/completed`)
    .then(res => {
        res.data.forEach(elem => {
            let activityCard = `
            <div class="item-card" id=${elem['complete_id']}>
            <li>${elem['item_name']}</li>
            </div>
            `
            activitiies.innerHTML += activityCard
        })
        console.log(res.data)
    }).catch(err => console.log(err))
}

function getAllDetails () {
    activityDet.innerHTML = ''

    axios.get(`${baseURL}/completed`)
    .then(res => {
        res.data.forEach(elem => {
            let activityCard = `
            <div class="activity-display" id=${elem['complete_id']}>
            <p id="activityHeader">${elem['item_name']}</p>
            <img class="actImg" src="${elem['img_src']}">
            <p id=activityP>${elem['description']}</p> 
            </div>
            `
            activityDet.innerHTML += activityCard
        })
        console.log(res.data)
    }).catch(err => console.log(err))
}
function getAllItems () {
    bucketList.innerHtml = ''

    axios.get(`${baseURL}/item`)
    .then(res => {
        let itemNum = 0
        res.data.forEach(elem => {
            console.log(elem)
            let itemCard = `
            <div class="item-card" id="card-${elem.list_id}">
                <li>${elem['item_name']}</li>
                <img class="trash-can id="delBtn-${elem.list_id}" onclick="deleteItem(${elem.list_id})" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJiB4icXPj7lJV1MbC6l-KI3IDWjCu8IY3KQ&usqp=CAU"></img>
            </div>
            `
            //<button id="completeBtn-${elem.list_id}" onclick="createCompleted(${elem.list_id})">Item Complete</button>
            bucketList.innerHTML += itemCard
            // const completeBtn = document.querySelector(`#completeBtn-${itemNum}`)
            // completeBtn.addEventListener('click', createCompleted)

            // const delBtn = document.querySelector(`#delBtn-${itemNum}`)
            // delBtn.addEventListener('click', deleteItem)

            itemNum ++

            const option = document.createElement('option')
            option.setAttribute('value', elem['list_id'])
            option.textContent = elem['item_name']
            itemSelect.appendChild(option)

        })
        console.log(res.data)


    }).catch(err => console.log(err))
}

function createNewItem () {
    axios.post(`${baseURL}/item`, {item: newInput.value})
    .then(res => {
        console.log(res.data)
        location.reload()
    }).catch(err => console.log(err))
}

function createCompleted (event) {
    event.preventDefault()

    bodyObj = {
        listID: +itemSelect.value,
        imgSrc: img.value,
        desc: desc.value

    }
    axios.post(`${baseURL}/completed`, bodyObj)
    .then(res => {
        updateCompleteValue(itemSelect.value)
        console.log(res.data)
        getAllActivities()

        itemSelect.value = 1
        img = ''
        desc = ''
    }).catch(err => console.log(err))
    
    
}

function deleteItem(id) {
    axios.delete(`${baseURL}/item/${id}`)
    .then(res => {
        console.log(res)
        location.reload()
        // document.querySelector(`#card-${id}`).remove()
        // getAllItems()
    }).catch(err => console.log(err))
}

function updateCompleteValue(id) {
    console.log(id)
    axios.put(`${baseURL}/item/${id}`)
    .then(res => {
        console.log('item updated')
        location.reload()
    }).catch((err) => {console.log(err)})
}

function openForm() {
    document.getElementById("formPop").style.display = "block";
}

function closeForm() {
    document.getElementById("formPop").style.display = "none";
}



addItem.addEventListener('click', createNewItem)
detailsBtn.addEventListener('click', getAllDetails)
updateDetails.addEventListener('submit', createCompleted)

getAllItems()
getAllActivities()