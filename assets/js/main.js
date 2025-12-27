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
const modalContent = document.getElementById("modal-content");
const pcContainerWindow = document.getElementById("pc-container-window");
const comparatorContainerWindow = document.getElementById("comparator-container-window");

const searchInput = document.getElementById("search-input");
const searchClearButton = document.getElementById("search-clear-btn");

const pcAddModal = document.getElementById("pc-container-add-btn");
const modalClose = document.getElementById("modal-close-btn");
const modalAction = document.getElementById("modal-action-btn");

const clearComparatorBtn = document.getElementById("comparator-clear-btn");


// Data Array
const data = [];

// Adding Banners
syncBanner(pcContainerWindow, {
    id: "pc-banner",
    action: "addModal"
});

syncBanner(comparatorContainerWindow, {
    id: "comparator-banner",
    action: "addModal"
});

/*
 *      SEARCH LOGIC
 */

// Listeners
searchInput.addEventListener("input", (input) => {search(input);});
searchClearButton.addEventListener("click", clearSearch);

function search(input) {
    const text = input.target.value;
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
        syncBanner(pcContainerWindow, {id: "pc-banner", action: "addModal"})
    });
}

function clearSearch() {
    searchInput.value = "";
    console.log("SEARCH: clearSearch: Search bar contents cleared.")
}

/*
 *      BANNER LOGIC
 */

function syncBanner(parentElement, { id, action }) {
    const items = parentElement.querySelectorAll(`[data-id="item"]`);
    let banner = parentElement.querySelector(`#${id}`);

    if (!banner) {
        banner = document.createElement("div");
        banner.id = id;
        parentElement.appendChild(banner);
        console.log(`BANNER: syncBanner: Base of Banner for ${parentElement.className} created.`)
    }
    if (items.length === 0 ) {
        banner.classList.add("no-items-banner")
        banner.classList.remove("items-banner")
        banner.innerHTML = `
            <div class="no-items-banner-text">No items found</div>
                <button class="no-items-banner-action-btn" data-action="${action}">
                    <i class="fa-solid fa-plus"></i>
            </button>`;
    } else {
        banner.classList.add("items-banner")
        banner.classList.remove("no-items-banner")
        banner.innerHTML = `
            <button class="items-banner-action-btn" data-action="${action}">
                    <i class="fa-solid fa-plus"></i>
            </button>`;
    }
}

/*
 *      MODAL WINDOW LOGIC
 */

pcAddModal.addEventListener("click", addModal);
modalClose.addEventListener("click", closeModal);
modalAction.addEventListener("click", actionModal);

// Functions
function addModal(){
    modal.classList.add("active");
    console.log("MODAL: addModal: pc-modal state set to Active");
    modalContent.innerHTML = `
        <label for="input-name">Name</label>
        <input id="input-name" type="text" placeholder="Enter name of your PC..."><br>
        <div class="circle-signal"><i class="fa-regular fa-circle-question"></i></div>
        <label for="input-processor">Processor</label>
        <input id="input-processor" type="text" placeholder="Intel Core i9 12500H"><br>
        <div class="circle-signal"><i class="fa-regular fa-circle-question"></i></div>
        <label for="input-graphics-card">Graphics</label>
        <input id="input-graphics-card" type="text" placeholder="Nvidia RTX 3080Ti"><br>
        <div class="circle-signal"><i class="fa-regular fa-circle-question"></i></i></div>
        <label for="input-ram">RAM</label>
        <input id="input-ram" type="text" placeholder="Kingston FURY 16GB DDR4"><br>  
        <div class="circle-signal"><i class="fa-regular fa-circle-question"></i></i></div>
        <label for="input-boot-drive">Boot Drive</label>
        <input id="input-boot-drive" type="text" placeholder="Samsung 990 EVO Plus 1TB">
        <div class="circle-signal"><i class="fa-regular fa-circle-question"></i></i></div>
        <div id="modal-error" class="modal-error"></div>       
    `;
    console.log("MODAL: addModal: Content for modal window created")
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

    const id = data.length.toString();
    console.log(`MODAL: modalAction: Unique id ${id} created`);

    /* Creating and appending an element with class pc-container-window-item */
    const item = document.createElement("div");
    item.id = id;
    item.setAttribute("data-id", "item")
    item.classList.add("pc-container-window-item");
    item.innerHTML =  `
        <span data-action="removePcItem" class="item-close-btn">&times;</span>
        <div class="item-name" data-field="name">${inputName}</div>
        <div class="item-body">           
            <div data-field="processor">${inputProcessor}</div>
            <div data-field="graphics">${inputGraphicsCard}</div>
            <div data-field="ram">${inputRAM}</div>
            <div data-field="boot-drive">${inputBootDrive}</div>
        </div>
        <button data-action="comparePcItem" class="item-action-btn">Compare</button>
    `;

    data.push({id: id, name: inputName, processor: inputProcessor,
        graphics: inputGraphicsCard, ram: inputRAM, drive: inputBootDrive,
        html: item});
    console.log("MODAL: modalAction: Imputed data saved as:", data[id])

    pcContainerWindow.prepend(item);
    console.log(`MODAL: modalAction: pc-item Created: \n${item.outerHTML}`);

    modal.classList.remove("active");
    console.log("MODAL: modalAction: pc-modal state set to Remove");

    syncBanner(pcContainerWindow, {
        id: "pc-banner",
        action: "addModal"
    });
}

function closeModal() {
    modal.classList.remove("active");
    console.log("MODAL: closeModal: pc-modal state set to Remove");
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
    console.log(`PC-ITEM: pc-container-window-item: Action \"${action}\" detected`)

    if (action === "addModal") {
        addModal();
    }

    if (action === "removePcItem") {
        e.target.parentElement.remove();
        console.log("PC-ITEM: pcContainerActions: pc-container-window-item Removed");
        syncBanner(pcContainerWindow, {id: "pc-banner", action: "addModal"});
    }

    if (action === "comparePcItem") {
        console.log(`PC-ITEM: pcContainerActions: Action ${action} commited`);

        const parentID = e.target.parentElement.id;
        console.log(`PC-ITEM: pcContainerActions: ID ${parentID} received`);

        const item = document.createElement("div");
        item.classList.add("comparator-container-window-item");
        item.setAttribute("data-id", "item")
        item.innerHTML =  `
            <span data-action="remove" class="item-close-btn">&times;</span>
            <div class="item-name">${data[parentID].name}</div>
            <div class="item-body">
                <div>${data[parentID].processor}</div>
                <div>${data[parentID].graphics}</div>
                <div>${data[parentID].ram}</div>
                <div>${data[parentID].drive}</div>
            </div>
            <div class="item-score-container">
                <div class="score-title">Score</div>
                <div id="score" class="score"></div>
            </div>           
        `;

        comparatorContainerWindow.prepend(item);
        console.log(`PC-ITEM: pcContainerActions: ${item.className} created:`, item.outerHTML);
        syncBanner(comparatorContainerWindow, {id: "comparator-banner", action: "addModal"});
    }
}

function removePcItem(e) {
    const parent = e.target.parentElement;
    parent.remove();
    console.log(`PC-ITEM: removePcItem: Parent element ${parent.className} removed`)
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
    console.log(`CO-ITEM: comparator-container-window-item: Action \"${action}\" detected`)

    if (action === "remove") {
        e.target.parentElement.remove();
        console.log("CO-ITEM: comparator-container-window-item remove-btn: comparator-container-window-item Removed");
        syncBanner(pcContainerWindow, {id: "comparator-banner", action: "addModal"});
    }
}

function clearComparator() {
    comparatorContainerWindow.innerHTML = "";
    console.log(`CO-ITEM: clearComparator: ${comparatorContainerWindow.className} has been cleared`)
    syncBanner(comparatorContainerWindow, {id: "comparator-banner", action: "addModal"})
}