const main_menu = document.getElementById("main-menu-container");
const appmnt_page = document.getElementById("appmnt-page");
const cust_page = document.getElementById("cust-page");

/*
* page{0 = main page, 1 = appointment page, 2 = customer page}
*/
let page = 0;

function render_appmnt_page(){
    page = 1;
    main_menu.style.display = 'none';
    appmnt_page.style.display = 'block';
}

function render_cust_page() {
    page = 2;
    main_menu.style.display = 'none';
    cust_page.style.display = 'block';
}

function return_to_main() {
    main_menu.style.display = 'block';
    switch(page){
        case 1:
            page = 0;
            appmnt_page.style.display = 'none';
            break;
        case 2:
            page = 0;
            cust_page.style.display = 'none';
            break;
    }
}

function add_customer(){
    
}