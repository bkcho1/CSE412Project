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

//other
const groomer_form = document.querySelector('#new-groomer');

let page = 0; //{0 = main, 1 = appointment, 2 = customer, 3 = groomer}

let count = 0;

appointment_button.addEventListener('click', () => {
    page = 1;
    appointment_page.style.display = 'block';
    main_menu.style.display ='none';
});

customer_button.addEventListener('click', () => {
    page = 2;
    customer_page.style.display = 'block';
    main_menu.style.display = 'none';
});

function load_groomer_page() {
    page = 3;
    groomer_page.style.display = 'block';
    main_menu.style.display = 'none';

    ipcRenderer.send('get-groomers');
    ipcRenderer.getgdata((e, data) => {
        render_groomers(data);
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

back_buttons.forEach(back => {
    back.addEventListener('click', () => {
        main_menu.style.display = 'block';
        switch(page){
            case 1:
                page = 0;
                appointment_page.style.display = 'none'
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

function add_groomer(e){
    e.preventDefault();
    
    const groomer_first_name = document.querySelector('#gfname').value;
    const groomer_last_name = document.querySelector('#glname').value;

    let elements = document.getElementsByTagName("input");
    for (let i=0; i < elements.length; i++) {
        if (elements[i].type == "text") {
            elements[i].value = "";
        }
    }

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        dropdown.classList.remove('active');
    });

    ipcRenderer.send('add-groomer', {
        groomer_first_name,
        groomer_last_name
    });
}

groomer_button.addEventListener('click', load_groomer_page);

groomer_form.addEventListener('submit', add_groomer);
