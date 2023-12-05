//pages
const main_menu = document.getElementById("main-menu-container");
const appointment_page = document.getElementById("appmnt-page");
const customer_page = document.getElementById("cust-page");
const groomer_page = document.getElementById("groomer-page");

//navigation buttons
const appointment_button = document.getElementById("appmnt-btn");
const customer_button = document.getElementById("cust-btn");
const groomer_button = document.getElementById("groomer-btn");
const back_buttons = document.querySelectorAll('.back');

//lists
const groomer_list = document.getElementById("groomer-list");
const customer_list = document.getElementById("customer-list");
const appointment_list = document.querySelector('#appointment-list');

//other
const groomer_form = document.querySelector('#add-groomer');
const groomer_delete = document.querySelector('#remove-groomer');

const customer_form = document.querySelector('#add-customer');
const dog_form = document.querySelector('#add-dog');
const customer_search = document.querySelector('#cust-search');
const id_removal_button = document.querySelector('#id-removal');
const namephone_removal_button = document.querySelector('#name-phone-removal');
const customer_delete_id = document.querySelector('#remove-customer-by-id');
const customer_delete_namephone = document.querySelector('#remove-customer-by-name-phone');
const overlay = document.querySelector('#overlay');

const name_container = document.querySelector('#name-container');
const groomer_container = document.querySelector('#agid-container');
const groomer_container_r = document.querySelector('#agid-container-r');
const appointment_date = document.querySelector('#appointment-date')
const appointment_form = document.querySelector('#add-appointment');
const appointment_delete = document.querySelector('#remove-appointment');

let page = 0; //{0 = main, 1 = appointment, 2 = customer, 3 = groomer}

/*
 *  appointment page stuff 
 */
function load_appointment_page(){
    page = 1;
    appointment_page.style.display = 'block';
    main_menu.style.display ='none';

    ipcRenderer.send('get-groomers');
    ipcRenderer.getgdata((e, data) => {
        fill_groomer_dropdown(data);
    });
}

function fill_groomer_dropdown(data){
    let appointment_groomer_array = JSON.parse(data);

    name_container.innerHTML = "";
    groomer_container.innerHTML = "";
    groomer_container_r.innerHTML = "";
    for (let i = 0; i < appointment_groomer_array.length; i++){
        let select = `<option value="${appointment_groomer_array[i].id}">${appointment_groomer_array[i].firstName} ${appointment_groomer_array[i].lastName}</option>`
        name_container.innerHTML += select;
        groomer_container.innerHTML += select;
        groomer_container_r.innerHTML += select;
    }
}

function get_appointments() {
    const gagid = name_container.value;
    const gadate = appointment_date.value;

    if(gadate)
    {
        ipcRenderer.send('get-appointments', { gagid, gadate })
        ipcRenderer.once('got-appointments', data => {
            render_appointments(data);
        });
    }

}

function render_appointments(data){
    appointment_list.innerHTML = "";
    var appointment_array = JSON.parse(data);
    for (var i = 0; i < appointment_array.length; i++){
        var row = `<tr>
                        <td>${appointment_array[i].time}</td>
                        <td>${appointment_array[i].name}</td>
                        <td>`
        for(var j = 0; j < appointment_array[i].dogs.length; j++){
                row += `${appointment_array[i].dogs[j]} `
        }
        row += `</td></tr>`
        appointment_list.innerHTML += row
    }
}

function add_appointment(e) {
    e.preventDefault();

    const agid = document.querySelector('#agid-container').value;
    const acfname = document.querySelector('#acfname').value;
    const aclname = document.querySelector('#aclname').value;
    const acphonenum = document.querySelector('#acphonenum').value;
    const adate = document.querySelector('#adate').value;
    const atime = document.querySelector('#atime').value;

    ipcRenderer.send('add-appointment', {
        agid,
        acfname,
        aclname,
        acphonenum,
        adate,
        atime
    });


    ipcRenderer.once('appointment-added', () => {
        alert("Appointment Added!");
        get_appointments()
    });

    appointment_form.reset();

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        dropdown.classList.remove('active');
    });

}

function remove_appointment(e){
    e.preventDefault();

    const ragid = document.querySelector('#agid-container-r').value;
    const racfname = document.querySelector('#racfname').value;
    const raclname = document.querySelector('#raclname').value;
    const racphonenum = document.querySelector('#racphonenum').value;
    const radate = document.querySelector('#radate').value;
    const ratime = document.querySelector('#ratime').value;

    ipcRenderer.send('remove-appointment', {
        ragid,
        racfname,
        raclname,
        racphonenum,
        radate,
        ratime
    });

    ipcRenderer.once('appointment-deleted', () => {
        alert("Appointment Deleted!");
        get_appointments()
    });

    appointment_delete.reset();

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

appointment_form.addEventListener('submit', add_appointment);
appointment_button.addEventListener('click', load_appointment_page);
appointment_delete.addEventListener('submit', remove_appointment);
appointment_date.addEventListener('change', get_appointments);
name_container.addEventListener('change', get_appointments);

/*
*   customer page stuff
*/
let c_key = 0;
let numDogs = 0;
let count = 0;
let customer_array;

customer_search.addEventListener('keyup', () => {
    let value = customer_search.value;
    value = value.toLowerCase();

    let filtered_list = [];
    filtered_list = customer_array.filter(currentElement => {
        return currentElement.firstName.toLowerCase().includes(value) || currentElement.lastName.toLowerCase().includes(value) || currentElement.phoneNum.includes(value)
    });

    customer_list.innerHTML = "";
    for (var i = 0; i < filtered_list.length; i++){
        var row = `<tr>
                        <td>${filtered_list[i].id}</td>
                        <td>${filtered_list[i].firstName}</td>
                        <td>${filtered_list[i].lastName}</td>
                        <td>${filtered_list[i].phoneNum}</td>
                        <td><button class="more-info" value="${filtered_list[i].id}">...</button></td>
                    </tr>`
        customer_list.innerHTML += row
    }

    let more_info_buttons = document.getElementsByClassName('more-info')
    for(let i = 0; i < more_info_buttons.length; i++){
        more_info_buttons[i].addEventListener('click', () => {
            overlay.style.display = 'block';
            render_info_page(parseInt(more_info_buttons[i].value));
        });
    }
});

id_removal_button.addEventListener('click', () => {
    customer_delete_id.style.display = 'block'
    document.querySelector('#remove-btn-container').style.display = 'none'
    document.querySelector('#cust-remove-reload').style.display = 'block'
});

namephone_removal_button.addEventListener('click', () => {
    customer_delete_namephone.style.display = 'block'
    document.querySelector('#remove-btn-container').style.display = 'none'
    document.querySelector('#cust-remove-reload').style.display = 'block'
});

document.querySelector('#cust-remove-reload').addEventListener('click', () => {
    customer_delete_namephone.style.display = 'none'
    customer_delete_id.style.display = 'none'
    document.querySelector('#remove-btn-container').style.display = 'flex'
    document.querySelector('#cust-remove-reload').style.display = 'none'
})

function add_customer(e) {
    e.preventDefault();

    const cfname = document.querySelector('#cfname').value;
    const clname = document.querySelector('#clname').value;   
    const cphonenum = document.querySelector('#cphonenum').value;
    const caddress = document.querySelector('#caddress').value;
    const cemail = document.querySelector('#cemail').value;
    numDogs = document.querySelector('#ndogs').value

    customer_form.style.display = 'none';
    dog_form.style.display = 'flex';;

    ipcRenderer.send('add-customer', {
        cfname,
        clname,
        cphonenum,
        caddress,
        cemail
    });

    ipcRenderer.once('customer-added', cid => {
        c_key = cid;
    })
}

function add_dog(e){
    e.preventDefault();
    count++;

    const dname = document.querySelector('#dname').value;
    const dbreed = document.querySelector('#dbreed').value;
    const dage = document.querySelector('#dage').value;
    const dsi = document.querySelector('#dsi').value;
    const dhc = document.querySelector('#dhc').value;
    const dcomment = document.querySelector('#dcomment').value;

    ipcRenderer.send('add-dog', {
        dname,
        dbreed,
        dage,
        dsi,
        dhc,
        dcomment,
        c_key
    });
    
    if(count >= numDogs){
        count = 0;
        numDogs = 0;
        c_key = 0;

        customer_form.style.display = 'flex';
        dog_form.style.display = 'none';

        customer_form.reset();

        document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
            dropdown.classList.remove('active');
        });

        ipcRenderer.once('dog-added', () => {
            alert("Customer and Dog(s) Added!");
            ipcRenderer.send('get-customers');
            customer_list.innerHTML = "";
            ipcRenderer.getcdata((e, data) => {
                render_customers(data);
            });
        });
    }

    dog_form.reset();
}

function load_customer_page() {
    page = 2;
    customer_page.style.display = 'block';
    main_menu.style.display = 'none';

    ipcRenderer.send('get-customers');
    customer_list.innerHTML = "";
    ipcRenderer.getcdata((e, data) => {
        render_customers(data);
    });
}

function render_customers(data) {
    customer_array = JSON.parse(data);
    for (var i = 0; i < customer_array.length; i++){
        var row = `<tr>
                        <td>${customer_array[i].id}</td>
                        <td>${customer_array[i].firstName}</td>
                        <td>${customer_array[i].lastName}</td>
                        <td>${customer_array[i].phoneNum}</td>
                        <td><button class="more-info" value="${customer_array[i].id}">...</button></td>
                  </tr>`
        customer_list.innerHTML += row
    }

    let more_info_buttons = document.getElementsByClassName('more-info')
    for(let i = 0; i < more_info_buttons.length; i++){
        more_info_buttons[i].addEventListener('click', () => {
            overlay.style.display = 'block';
            render_info_page(parseInt(more_info_buttons[i].value));
        });
    }
}

function render_info_page(customer_id) {
    ipcRenderer.send('get-one-customer', customer_id);
    ipcRenderer.once('got-one-customer', data => {
        let cust_info = JSON.parse(data);
        let left_side_info = document.querySelector('#left-side-info');
        let info = `<h2 style="font-size: 1em">Customer Info</h2>
                    <p><b>First Name:</b><br>${cust_info.firstName}<p>
                    <p><b>Last Name:</b><br>${cust_info.lastName}<p>
                    <p><b>Phone #:</b><br>${cust_info.phoneNum}<p>
                    <p><b>Address:</b><br>${cust_info.address}<p>
                    <p><b>Email:</b><br>${cust_info.email}<p>`
        left_side_info.innerHTML = "";
        left_side_info.innerHTML += info;
    });

    ipcRenderer.send('get-dogs', customer_id);
    ipcRenderer.once('got-dogs', data => {
        let dog_info = JSON.parse(data);
        let dog_list = document.querySelector('#dog-list');
        dog_list.innerHTML = "";
        let row;
        for (let i = 0; i < dog_info.length; i++){
            if(dog_info[i].specialInstructions === null){
                row = `<tr>
                            <td>${dog_info[i].name}</td>
                            <td>${dog_info[i].breed}</td>
                            <td>${dog_info[i].age}</td>
                            <td></td>
                            <td>${dog_info[i].healthConditions}</td>
                            <td>${dog_info[i].comments}</td>
                      </tr>`
            }
            else{
                row = `<tr>
                            <td>${dog_info[i].name}</td>
                            <td>${dog_info[i].breed}</td>
                            <td>${dog_info[i].age}</td>
                            <td>${dog_info[i].specialInstructions}</td>
                            <td>${dog_info[i].healthConditions}</td>
                            <td>${dog_info[i].comments}</td>
                      </tr>`
            }
            dog_list.innerHTML += row
        }
    });
}

function remove_customer_by_id(e){
    e.preventDefault();

    const cid = document.querySelector('#cid').value;

    ipcRenderer.send('remove-customer-by-id', cid);

    ipcRenderer.once('customer-deleted', () => {
        alert('Customer Deleted!')
        ipcRenderer.send('get-customers')
        customer_list.innerHTML = "";
        ipcRenderer.getcdata((e, data) => {
            render_customers(data);
        });

        customer_delete_namephone.style.display = 'none'
        customer_delete_id.style.display = 'none'
        document.querySelector('#remove-btn-container').style.display = 'flex'
        document.querySelector('#cust-remove-reload').style.display = 'none'
    });

    customer_delete_id.reset();

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

function remove_customer_by_namephone(e){
    e.preventDefault();

    const fname = document.querySelector('#rcfname').value;
    const lname = document.querySelector('#rclname').value;
    const phone = document.querySelector('#rcphone').value;

    ipcRenderer.send('remove-customer-by-namephone', { fname, lname, phone});

    ipcRenderer.once('customer-deleted', () => {
        alert('Customer Deleted!')
        ipcRenderer.send('get-customers')
        customer_list.innerHTML = "";
        ipcRenderer.getcdata((e, data) => {
            render_customers(data);
        });

        customer_delete_namephone.style.display = 'none'
        customer_delete_id.style.display = 'none'
        document.querySelector('#remove-btn-container').style.display = 'flex'
        document.querySelector('#cust-remove-reload').style.display = 'none'
    });

    customer_delete_namephone.reset();

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

document.querySelector('#exit-info-screen').addEventListener('click', () => {
    overlay.style.display = 'none'
})

customer_button.addEventListener('click', load_customer_page);
customer_form.addEventListener('submit', add_customer)
dog_form.addEventListener('submit', add_dog)
customer_delete_id.addEventListener('submit', remove_customer_by_id);
customer_delete_namephone.addEventListener('submit', remove_customer_by_namephone);

/*
*   groomer page stuff
*/
function load_groomer_page() {
    page = 3;
    groomer_page.style.display = 'block';
    main_menu.style.display = 'none';

    ipcRenderer.send('get-groomers');
    groomer_list.innerHTML = "";
    ipcRenderer.getgdata((e, data) => {
        render_groomers(data);
    });
}

function add_groomer(e){
    e.preventDefault();
    
    const groomer_first_name = document.querySelector('#gfname').value;
    const groomer_last_name = document.querySelector('#glname').value;

    ipcRenderer.send('add-groomer', {
        groomer_first_name,
        groomer_last_name
    });

    ipcRenderer.once('groomer-added', () => {
        alert("Groomer Added!")
        ipcRenderer.send('get-groomers')
        groomer_list.innerHTML = "";
        ipcRenderer.getgdata((e, data) => {
            render_groomers(data);
        });
    });

    groomer_form.reset();

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

function remove_groomer(e){
    e.preventDefault();

    const gid = document.querySelector('#gid').value;

    ipcRenderer.send('remove-groomer', gid);

    ipcRenderer.once('groomer-deleted', () => {
        alert('Groomer Deleted!')
        ipcRenderer.send('get-groomers')
        groomer_list.innerHTML = "";
        ipcRenderer.getgdata((e, data) => {
            render_groomers(data);
        });
    });

    groomer_delete.reset();

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

function render_groomers(data){
    var groomer_array = JSON.parse(data);
    for (var i = 0; i < groomer_array.length; i++){
        var row = `<tr>
                        <td>${groomer_array[i].id}</td>
                        <td>${groomer_array[i].firstName}</td>
                        <td>${groomer_array[i].lastName}</td>
                  </tr>`
        groomer_list.innerHTML += row
    }
}

groomer_button.addEventListener('click', load_groomer_page);
groomer_form.addEventListener('submit', add_groomer);
groomer_delete.addEventListener('submit', remove_groomer);

/*
 *  generic/helper stuff 
 */
back_buttons.forEach(back => {
    back.addEventListener('click', () => {
        main_menu.style.display = 'block';
        switch(page){
            case 1:
                page = 0;
                appointment_page.style.display = 'none'
                appointment_list.innerHTML = "";
                appointment_date.value = "";
                break;
            case 2:
                page = 0;
                customer_page.style.display = 'none';
                break;
            case 3:
                page = 0;
                groomer_page.style.display = 'none';
                groomer_list.innerHTML = "";
                break;
        }
    });
});

document.addEventListener("click", e => {
    const isDropDownButtton = e.target.matches("[data-dropdown-button]");
    if(!isDropDownButtton && e.target.closest('[data-dropdown]') != null) return;

    let currentDropdown;
    if(isDropDownButtton){
        currentDropdown = e.target.closest('[data-dropdown]');
        currentDropdown.classList.toggle('active');
    }

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        if(dropdown === currentDropdown) return;
        let elements = document.getElementsByTagName("input");
        for (let i=0; i < elements.length; i++) {
            if (elements[i].type == "text") {
                elements[i].value = "";
            }   
        }
        dropdown.classList.remove('active');
    });
});
