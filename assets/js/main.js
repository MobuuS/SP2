/* import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = 'https://bxkvjqcmykdnzjjinfzf.supabase.co';
const supabaseKey = "sb_publishable_14WkpONyvoqvnT1W8g7VGQ_kAf_n5Y6";
const supabase = createClient(supabaseUrl, supabaseKey);

// Test pro zjištění zda REST API funguje korektně
async function getCPUs() {
    let {data: cpu, error} = await supabase.from('cpu').select('*');

    if (error) {
        console.error('ERROR: cpu table error:', error);
        return null;
    } else {
        return cpu;
    }
}

console.log("DEBUG: cpu table resp:", getCPUs())
*/

/*
 *      INITIALIZATION
 */

// Declarations
const modal = document.getElementById("modal");
const pcContainerWindow = document.getElementById("pc-container-window");
const comparatorContainerWindow = document.getElementById("comparator-container-window");

const searchInput = document.getElementById("search-input");
const searchClearButton = document.getElementById("search-clear-btn");

const pcaddModal = document.getElementById("pc-container-add-btn");
const modalClose = document.getElementById("modal-close-btn");
const modalAction = document.getElementById("modal-action-btn");

const clearComparatorBtn = document.getElementById("comparator-clear-btn");

const STORAGE_KEY = "data";


initializeLocalStorage();

// Adding Banners
syncPcBanner();
syncComparatorBanner();

function initializeLocalStorage() {
    const array = getArray("initializeLocalStorage");

    if (array.length !== 0) {
        console.log(`LOCAL: initializeLocalStorage: Array is not empty (${array.length}). Receiving items...`);
        array.forEach((item) => {
            createPcContainer(item.id, item.name, item.processor, item.graphics, item.ram, item.drive);
        });
        console.log("LOCAL: initializeLocalStorage: All items received. Initialization finished.")
    } else {
        console.log(`LOCAL: initializeLocalStorage: Array is empty ${array.length}. Initialization suspended.`)
    }
}

/*
 *      LOCAL STORAGE OPERATIONS
 */

function getArray(func) {
    const array = localStorage.getItem(STORAGE_KEY);
    
    if (array) {
        console.log(`LOCAL: ${func}: getArray: Array received:\n ${array}`)
        return JSON.parse(array);

    } else {
        return [];
    }
}

function clearArray() {
    let array = getArray("clearArray");
    array = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
}

function getArrayLength() {
    const array = getArray("getArrayLength");
    console.log(`LOCAL: getArrayLength: Array length is ${array.length}`);
    return array.length;
}

function addItem(item) {
    const array = getArray("addItem");

    array.push(item);
    console.log(`LOCAL: addItem: Item ${item.name} has been added to local storage.`);
    console.log(`LOCAL: addItem: Storage currently contains these items:\n ${array}`);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
}

function getItem(index) {
    const array = getArray("getItem");
    return array[parseInt(index)];
}

function removeItem(id) {
    const array = getArray("removeItem");
    let index = 0;
    array.forEach((item) => {
        if (item.id === id) {
            array.splice(index, 1);
        } else {
            index++;
        }
    });
    console.log(`LOCAL: removeItem: Item with id ${id} has been removed from local storage.`);
    console.log(`LOCAL: removeItem: Storage currently contains these items:\n ${array}`);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
}
/*
 *      SEARCH LOGIC
 */

// Listeners
searchInput.addEventListener("input", (input) => {search(input);});
searchClearButton.addEventListener("click", clearSearch);

function search(input) {
    const text = input.target.value;
    const data = getArray("search");
    console.log(`SEARCH: searchInput Event: Input ${text} has been detected.`)
    data.forEach(data => {
        const isVisible = data.name.toLowerCase().includes(text);
        console.log(`SEARCH: searchInput forEach: ${data.html.className} visibility state is \"${isVisible}\"`)
        data.html.classList.toggle("hide", !isVisible);
        if (!isVisible) {
            data.html.removeAttribute("data-id");
        } else {
            data.html.setAttribute("data-id", "item");
        }
        syncPcBanner();
    });
}

function clearSearch() {
    searchInput.value = "";
    console.log("SEARCH: clearSearch: Search bar contents cleared.")
}

/*
 *      BANNER LOGIC
 */

function syncPcBanner() {
    const items = pcContainerWindow.querySelectorAll(`[data-id="item"]`);
    let banner = pcContainerWindow.querySelector("#pc-banner");

    if (!banner) {
        console.log("BANNER: syncPcBanner: No Banner registered. Creating new Banner...")
        banner = document.createElement("div");
        banner.id = "pc-banner";
        pcContainerWindow.appendChild(banner);
        console.log(`BANNER: syncPcBanner: Base of Banner for ${pcContainerWindow.className} created.`)
    }
    if (items.length === 0) {
        console.log(`BANNER: syncPcBanner: No items registered (${items.length}). Applying no-items-banner...`)
        banner.classList.add("no-items-banner");
        banner.classList.remove("items-banner");
        banner.innerHTML = `
            <div class="no-items-banner-text">No items found</div>
                <button class="no-items-banner-action-btn" data-action="addModal">
                    <i class="fa-solid fa-plus"></i>
                </button>`;
        console.log("BANNER: syncPcBanner: no-items-banner applied.")
    } else {
        console.log(`BANNER: syncPcBanner: Items (${items.length}) registered. Applying items-banner...`)
        banner.classList.add("items-banner");
        banner.classList.remove("no-items-banner");
        banner.innerHTML = `
            <button class="items-banner-action-btn" data-action="addModal">
                    <i class="fa-solid fa-plus"></i>
            </button>`;
        console.log("BANNER: syncPcBanner: items-banner applied.")
    }
}

function syncComparatorBanner() {
    const items = comparatorContainerWindow.querySelectorAll(`[data-id="item"]`);
    let banner = comparatorContainerWindow.querySelector("#comparator-banner");

    if (!banner) {
        console.log("BANNER: syncComparatorBanner: No Banner registered. Creating new Banner...")
        banner = document.createElement("div");
        banner.id = "comparator-banner";
        comparatorContainerWindow.appendChild(banner);
        console.log(`BANNER: syncComparatorBanner: Base of Banner for ${comparatorContainerWindow.className} created.`)
    }

    if (items.length === 0) {
        console.log(`BANNER: syncComparatorBanner: No items registered (${items.length}). Applying no-items-banner...`)
        banner.classList.add("no-items-banner");
        banner.classList.remove("items-banner");
        banner.innerHTML = `
            <div class="no-items-banner-text">No items found</div>`;
        console.log("BANNER: syncComparatorBanner: no-items-banner applied.")
    } else {
        console.log(`BANNER: syncComparatorBanner: Items (${items.length}) registered. Applying items-banner...`)
        banner.classList.add("items-banner");
        banner.classList.remove("no-items-banner");
        banner.innerHTML = `<div></div>`;
        console.log("BANNER: syncComparatorBanner: items-banner applied.")
    }
}

/*
 *      MODAL WINDOW LOGIC
 */

pcaddModal.addEventListener("click", addModal);
modalClose.addEventListener("click", closeModal);
modalAction.addEventListener("click", actionModal);

// Functions
function addModal(){
    modal.classList.add("active");
    console.log("MODAL: addModal: pc-modal state set to Active");
}

function closeModal() {
    modal.classList.remove("active");
    console.log("MODAL: closeModal: pc-modal state set to Remove");
}

function actionModal(){
    const inputName = document.getElementById("input-name").value;
    const inputProcessor = document.getElementById("input-processor").value;
    const inputGraphicsCard = document.getElementById("input-graphics-card").value;
    const inputRAM = document.getElementById("input-ram").value;
    const inputBootDrive = document.getElementById("input-boot-drive").value;

    if (inputName === "" || inputProcessor === "" || inputRAM === ""
        || inputGraphicsCard === "" || inputBootDrive === "") {
        const error = document.getElementById("modal-error");
        error.textContent = "Please fill all the boxes!"
        console.log("MODAL: modalAction: Inputs are empty, error displayed")
        return;
    }

    const id = getArrayLength().toString();
    console.log(`MODAL: modalAction: Unique id ${id} created`);

    const element = createPcContainer(id, inputName, inputProcessor, inputGraphicsCard, inputRAM, inputBootDrive);

    addItem({id: id, name: inputName, processor: inputProcessor,
        graphics: inputGraphicsCard, ram: inputRAM, drive: inputBootDrive,
        html: element});

    const item = getItem(id);
    console.log(`MODAL: actionModal: Unique id ${id} has been assigned to item ${item.name}`)
    console.log("MODAL: actionModal: Imputed data saved to local storage as:", item)

    modal.classList.remove("active");
    console.log("MODAL: actionModal: pc-modal state set to Remove");

    syncPcBanner();

    createPopUp(`Computer ${inputName} has been created!`, "rgb(64, 218, 89)")
}

function createPcContainer(id, name, processor, graphics, ram, drive) {
    const element = document.createElement("div");
    element.id = id;
    element.setAttribute("data-id", "item")
    element.classList.add("pc-container-window-item");
    element.innerHTML =  `
        <span data-action="removePcItem" class="item-close-btn">&times;</span>
        <div class="item-name" data-field="name">${name}</div>
        <div class="item-body">           
            <div data-field="processor">${processor}</div>
            <div data-field="graphics">${graphics}</div>
            <div data-field="ram">${ram}</div>
            <div data-field="boot-drive">${drive}</div>
        </div>
        <button data-action="comparePcItem" class="item-action-btn">Compare</button>
    `;

    pcContainerWindow.prepend(element);
    console.log(`MODAL: actionModal: pc-item Created: \n${element.outerHTML}`);
    return element;
}

/*
 *      POP-UP WINDOW LOGIC
 */

function createPopUp(text, color) {
    const popUp = document.getElementById("pop-up");
    const popUpBox = document.getElementById("pop-up-box");
    const popUpText = document.getElementById("pop-up-text");

    popUpText.textContent = text;

    popUp.classList.add("active");
    popUpBox.style.background = color;
    console.log(`POPUP: createPopUp: Pop-up created. ${text} has been displayed`)

    setTimeout(() => {
        popUp.classList.remove("active")
        console.log(`POPUP: createPopUp: Pop-up removed.`)
    }, 2000);
}

/*
 *      PC ITEM CONTAINER LOGIC
 */

pcContainerWindow.addEventListener("click", (e) => {pcContainerActions(e);});

function pcContainerActions(e){
    // Detecting the closest button with data-action clicked
    const btn = e.target.closest("[data-action]");
    // Exit the function prematurely if button was not clicked
    if (!btn) return;
    // Reading an action attached to the button
    const action = btn.dataset.action;
    console.log(`PC-ITEM: pcContainerActions: Action \"${action}\" detected`)

    const parent = e.target.parentElement;
    if (action === "addModal") {
        console.log(`PC-ITEM: pcContainerActions: addModal() initiated`);
        addModal();
    }

    if (action === "removePcItem") {
        console.log(`PC-ITEM: pcContainerActions: removePcItem initiated`);
        removePcItem(parent);
    }

    if (action === "comparePcItem") {
        console.log(`PC-ITEM: pcContainerActions: comparePcItem initiated`);

        console.log(`PC-ITEM: pcContainerActions: ID ${parent.id} received`);
        const item = getItem(parent.id);

        const element = document.createElement("div");
        element.classList.add("comparator-container-window-item");
        element.setAttribute("data-id", "item")
        element.innerHTML =  `
            <span data-action="remove" class="item-close-btn">&times;</span>
            <div class="item-name">${item.name}</div>
            <div class="item-body">
                <div>${item.processor}</div>
                <div>${item.graphics}</div>
                <div>${item.ram}</div>
                <div>${item.drive}</div>
            </div>
            <div class="item-score-container">
                <div class="score-title">Score</div>
                <div id="score" class="score"></div>
            </div>           
        `;

        comparatorContainerWindow.prepend(element);
        console.log(`PC-ITEM: pcContainerActions: ${element.className} created:`, element.outerHTML);
        syncComparatorBanner();
    }
}

function removePcItem(parent) {
    parent.remove();
    removeItem(parent.id)
    console.log(`PC-ITEM: removePcItem: Parent element ${parent.className} with id=${parent.id} removed`)
    createPopUp("Computer has been removed!", "rgb(204,62,62)");
    syncPcBanner();
}

/*
 *      COMPARATOR LOGIC
 */

comparatorContainerWindow.addEventListener("click", (e) => {comparatorContainerActions(e);});
clearComparatorBtn.addEventListener("click", clearComparator);

function comparatorContainerActions(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    console.log(`CO-ITEM: comparatorContainerActions: Action \"${action}\" detected`)

    if (action === "remove") {
        e.target.parentElement.remove();
        console.log("CO-ITEM: comparatorContainerActions remove-btn: comparator-container-window-item Removed");
        syncComparatorBanner();
    }
}

function clearComparator() {
    comparatorContainerWindow.innerHTML = "";
    console.log(`CO-ITEM: clearComparator: ${comparatorContainerWindow.className} has been cleared`)
    syncComparatorBanner();
}