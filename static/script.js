// staƟ c/script.js
// Global state variables 
let inventory = []; 
let totalProfit = 0; 
let totalLoss = 0; 
let ediƟ ngItemId = null; // To keep track of the item being edited
// DOM Elements 
// NavigaƟ on
const navAddItemBtn = document.getElementById('navAddItem'); 
const navInventoryViewBtn = document.getElementById('navInventoryView'); 
const navStockModificaƟ onBtn = document.getElementById('navStockModificaƟ on');
const navBuƩ ons = document.querySelectorAll('.nav-buƩ on');
// Screens 
const addItemScreen = document.getElementById('addItemScreen'); 
const inventoryViewScreen = document.getElementById('inventoryViewScreen'); 
const stockModificaƟ onScreen = document.getElementById('stockModificaƟ onScreen');
// Add Item Screen Elements 
const itemForm = document.getElementById('itemForm'); 
const itemIdInput = document.getElementById('itemId'); 
const itemNameInput = document.getElementById('itemName'); 
const itemQuanƟ tyInput = document.getElementById('itemQuanƟ ty');
const itemPriceInput = document.getElementById('itemPrice'); // Now "Cost Price" 
const saveItemBtn = document.getElementById('saveItemBtn'); 
const clearFormBtn = document.getElementById('clearFormBtn'); 
// Inventory View Screen Elements 
const totalUniqueItemsDisplay = document.getElementById('totalUniqueItems'); 
const totalQuanƟ tyDisplay = document.getElementById('totalQuanƟ ty');
const totalValuaƟ onDisplay = document.getElementById('totalValuaƟ on');
const inventorySearchBar = document.getElementById('inventorySearchBar'); 
const inventoryList = document.getElementById('inventoryList'); 
const noItemsMessage = document.getElementById('noItemsMessage'); 
// Stock ModificaƟ on Screen Elements
const stockModificaƟ onForm = document.getElementById('stockModificaƟ onForm');
const modifyItemIdSelect = document.getElementById('modifyItemId'); 
const modifyQuanƟ tyInput = document.getElementById('modifyQuanƟ ty');
const reasonSaleRadio = document.getElementById('reasonSale'); 
const reasonDamageRadio = document.getElementById('reasonDamage'); 
const salePriceContainer = document.getElementById('salePriceContainer'); 
const salePriceInput = document.getElementById('salePrice'); 
const totalProfitDisplay = document.getElementById('totalProfitDisplay'); 
const totalLossDisplay = document.getElementById('totalLossDisplay'); 
// Global Message Box 
const globalMessageBox = document.getElementById('globalMessageBox'); 
/** 
 * Shows a message in the global message box. 
 * @param {string} message - The message to display. 
 * @param {string} type - 'success', 'error', or 'info' to determine styling. 
 */ 
funcƟ on showMessage(message, type) {
 globalMessageBox.textContent = message; 
 globalMessageBox.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-
100', 'text-red-800', 'bg-blue-100', 'text-blue-800'); 
 if (type === 'success') { 
 globalMessageBox.classList.add('bg-green-100', 'text-green-800'); 
 } else if (type === 'error') { 
 globalMessageBox.classList.add('bg-red-100', 'text-red-800'); 
 } else if (type === 'info') { 
 globalMessageBox.classList.add('bg-blue-100', 'text-blue-800'); 
 } 
 globalMessageBox.classList.remove('hidden'); 
 setTimeout(() => { 
 globalMessageBox.classList.add('hidden'); 
 }, 3000); // Hide aŌ er 3 seconds
} 
/** 
 * Saves the current inventory, total profit, and total loss to local storage. 
 */ 
funcƟ on saveState() {
 try { 
 localStorage.setItem('inventory', JSON.stringify(inventory)); 
 localStorage.setItem('totalProfit', totalProfit.toFixed(2)); 
 localStorage.setItem('totalLoss', totalLoss.toFixed(2)); 
 } catch (e) { 
 console.error("Error saving to local storage:", e); 
 showMessage("Error saving data locally.", 'error'); 
 } 
} 
/** 
 * Loads inventory, total profit, and total loss data from local storage. 
 */ 
funcƟ on loadState() {
 try { 
 const storedInventory = localStorage.getItem('inventory'); 
 if (storedInventory) { 
 inventory = JSON.parse(storedInventory); 
 } 
 const storedProfit = localStorage.getItem('totalProfit'); 
 if (storedProfit) { 
 totalProfit = parseFloat(storedProfit); 
 } 
 const storedLoss = localStorage.getItem('totalLoss'); 
 if (storedLoss) { 
 totalLoss = parseFloat(storedLoss); 
 } 
 } catch (e) { 
 console.error("Error loading from local storage:", e); 
 showMessage("Error loading data from local storage.", 'error'); 
 } 
} 
/** 
 * Renders the inventory items to the table on the Inventory View screen. 
 * @param {Array} itemsToDisplay - The array of items to render (can be filtered). 
 */ 
funcƟ on renderInventory(itemsToDisplay = inventory) {
 inventoryList.innerHTML = ''; // Clear exisƟ ng list
 if (itemsToDisplay.length === 0) { 
 noItemsMessage.classList.remove('hidden'); 
 return; 
 } else { 
 noItemsMessage.classList.add('hidden'); 
 } 
 itemsToDisplay.forEach(item => { 
 const row = document.createElement('tr'); 
 row.className = 'hover:bg-gray-50 transiƟ on duraƟ on-150 ease-in-out'; 
 row.innerHTML = ` 
 <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-
900">${item.id}</td> 
 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.name}</td> 
 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-
700">${item.quanƟ ty}</td>
 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-
700">₹${item.price.toFixed(2)}</td> 
 <td class="px-6 py-4 whitespace-nowrap text-sm font-medium"> 
 <buƩ on onclick="editItem('${item.id}')"
 class="text-blue-600 hover:text-blue-900 mr-3 px-3 py-1 rounded-md bg-blue-
100 hover:bg-blue-200 transiƟ on duraƟ on-150 ease-in-out"> 
 Edit 
 </buƩ on>
 <buƩ on onclick="deleteItem('${item.id}')"
 class="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-100 
hover:bg-red-200 transiƟ on duraƟ on-150 ease-in-out"> 
 Delete 
 </buƩ on>
 </td> 
 `; 
 inventoryList.appendChild(row); 
 }); 
} 
/** 
 * Calculates and displays overall inventory metrics. 
 */ 
funcƟ on updateInventoryMetrics() {
 const totalUnique = inventory.length; 
 const totalQty = inventory.reduce((sum, item) => sum + item.quanƟ ty, 0);
 const totalVal = inventory.reduce((sum, item) => sum + (item.quanƟ ty * item.price), 0);
 totalUniqueItemsDisplay.textContent = totalUnique; 
 totalQuanƟ tyDisplay.textContent = totalQty;
 totalValuaƟ onDisplay.textContent = `₹${totalVal.toFixed(2)}`;
} 
/** 
* Populates the item selecƟ on dropdown on the Stock ModificaƟ on screen.
 */ 
funcƟ on populateModifyItemSelect() {
 modifyItemIdSelect.innerHTML = '<opƟ on value="">-- Select an item --</opƟ on>'; // Clear 
exisƟ ng opƟ ons
 inventory.forEach(item => { 
 const opƟ on = document.createElement('opƟ on');
 opƟ on.value = item.id;
 opƟ on.textContent = `${item.name} (ID: ${item.id}, Qty: ${item.quanƟ ty}, Cost: 
₹${item.price.toFixed(2)})`; 
 modifyItemIdSelect.appendChild(opƟ on);
 }); 
} 
/** 
 * Updates the profit and loss displays. 
 */ 
funcƟ on updateFinancialSummary() {
 totalProfitDisplay.textContent = `₹${totalProfit.toFixed(2)}`; 
 totalLossDisplay.textContent = `₹${totalLoss.toFixed(2)}`; 
} 
/** 
 * Handles screen switching logic. 
 * @param {string} screenId - The ID of the screen to show. 
 */ 
funcƟ on showScreen(screenId) {
 // Hide all screens 
 document.querySelectorAll('.screen').forEach(screen => { 
 screen.classList.remove('acƟ ve');
 }); 
 // DeacƟ vate all nav buƩ ons
 navBuƩ ons.forEach(buƩ on => {
 buƩ on.classList.remove('acƟ ve');
 }); 
 // Show the selected screen and acƟ vate its nav buƩ on
 document.getElementById(screenId).classList.add('acƟ ve');
 if (screenId === 'addItemScreen') navAddItemBtn.classList.add('acƟ ve');
 if (screenId === 'inventoryViewScreen') { 
 navInventoryViewBtn.classList.add('acƟ ve');
 renderInventory(); // Re-render inventory when this screen is acƟ ve
 updateInventoryMetrics(); // Update metrics when this screen is acƟ ve
 inventorySearchBar.value = ''; // Clear search bar on screen switch 
 } 
 if (screenId === 'stockModificaƟ onScreen') {
 navStockModificaƟ onBtn.classList.add('acƟ ve');
 populateModifyItemSelect(); // Populate dropdown when this screen is acƟ ve
 updateFinancialSummary(); // Update financial summary 
 modifyQuanƟ tyInput.value = ''; // Clear quanƟ ty input
 reasonSaleRadio.checked = true; // Default to sale 
 toggleSalePriceInput(); // Show/hide sale price input 
 } 
 clearForm(); // Clear the add/edit form when switching screens 
} 
// Event Listeners for NavigaƟ on
navAddItemBtn.addEventListener('click', () => showScreen('addItemScreen')); 
navInventoryViewBtn.addEventListener('click', () => showScreen('inventoryViewScreen')); 
navStockModificaƟ onBtn.addEventListener('click', () => 
showScreen('stockModificaƟ onScreen'));
/** 
 * Handles the submission of the item form (add or edit). 
 * @param {Event} event - The form submission event. 
 */ 
itemForm.addEventListener('submit', funcƟ on(event) {
 event.preventDefault(); // Prevent default form submission 
 const id = itemIdInput.value.trim(); 
 const name = itemNameInput.value.trim(); 
 const quanƟ ty = parseInt(itemQuanƟ tyInput.value);
 const price = parseFloat(itemPriceInput.value); 
 // Basic validaƟ on
 if (!id || !name || isNaN(quanƟ ty) || quanƟ ty < 0 || isNaN(price) || price < 0) {
 showMessage('Please fill in all fields with valid posiƟ ve values.', 'error');
 return; 
 } 
 if (ediƟ ngItemId) {
 // EdiƟ ng exisƟ ng item
 const itemIndex = inventory.findIndex(item => item.id === ediƟ ngItemId);
 if (itemIndex !== -1) { 
 // Check if ID was changed and if new ID is unique 
 if (ediƟ ngItemId !== id && inventory.some(item => item.id === id)) {
 showMessage('Item ID already exists. Please use a unique ID.', 'error'); 
 return; 
 } 
 inventory[itemIndex].id = id; // Update ID if changed 
 inventory[itemIndex].name = name; 
 inventory[itemIndex].quanƟ ty = quanƟ ty;
 inventory[itemIndex].price = price; 
 showMessage('Item updated successfully!', 'success'); 
 } 
 ediƟ ngItemId = null; // Reset ediƟ ng state
 saveItemBtn.textContent = 'Add Item'; // Change buƩ on back
 itemIdInput.removeAƩ ribute('readonly'); // Make ID editable again
 } else { 
 // Adding new item 
 // Check for unique ID when adding a new item 
 if (inventory.some(item => item.id === id)) { 
 showMessage('Item ID already exists. Please use a unique ID.', 'error'); 
 return; 
 } 
 const newItem = { 
 id: id, 
 name: name, 
 quanƟ ty: quanƟ ty,
 price: price // This is the cost price 
 }; 
 inventory.push(newItem); 
 showMessage('Item added successfully!', 'success'); 
 } 
 clearForm(); 
 saveState(); 
 renderInventory(); // Re-render the full inventory (in case we switch back) 
 updateInventoryMetrics(); // Update metrics 
 populateModifyItemSelect(); // Update dropdown 
}); 
/** 
* Clears the form fields on the Add Item screen and resets ediƟ ng state.
 */ 
funcƟ on clearForm() {
 itemIdInput.value = ''; 
 itemNameInput.value = ''; 
 itemQuanƟ tyInput.value = '';
 itemPriceInput.value = ''; 
 ediƟ ngItemId = null;
 saveItemBtn.textContent = 'Add Item'; 
 itemIdInput.removeAƩ ribute('readonly'); // Ensure ID is editable for new entries
 itemNameInput.focus(); // Focus on the first input field 
} 
// Event listener for the clear form buƩ on
clearFormBtn.addEventListener('click', clearForm); 
/** 
 * Populates the form with data of an item to be edited. 
 * @param {string} id - The ID of the item to edit. 
 */ 
funcƟ on editItem(id) {
 const itemToEdit = inventory.find(item => item.id === id); 
 if (itemToEdit) { 
 itemIdInput.value = itemToEdit.id; 
 itemNameInput.value = itemToEdit.name; 
 itemQuanƟ tyInput.value = itemToEdit.quanƟ ty;
 itemPriceInput.value = itemToEdit.price; 
 ediƟ ngItemId = id;
 saveItemBtn.textContent = 'Update Item'; 
 itemIdInput.setAƩ ribute('readonly', 'true'); // Make ID read-only during edit 
 showScreen('addItemScreen'); // Switch to add item screen 
 itemNameInput.focus(); // Focus on the name input for quick ediƟ ng
 showMessage(`EdiƟ ng item: ${itemToEdit.name}`, 'info');
 } 
} 
/** 
 * Deletes an item from the inventory. 
 * @param {string} id - The ID of the item to delete. 
 */ 
funcƟ on deleteItem(id) {
 const iniƟ alLength = inventory.length;
 const deletedItem = inventory.find(item => item.id === id); 
 inventory = inventory.filter(item => item.id !== id); 
 if (inventory.length < iniƟ alLength) {
 showMessage(`Item "${deletedItem ? deletedItem.name : id}" deleted successfully!`, 
'success'); 
 } else { 
 showMessage('Item not found!', 'error'); 
 } 
 saveState(); 
 renderInventory(); // Re-render the full inventory 
 updateInventoryMetrics(); // Update metrics 
 populateModifyItemSelect(); // Update dropdown 
 clearForm(); // Clear the form if the deleted item was being edited 
} 
/** 
 * Filters inventory items based on search input on the Inventory View screen. 
 */ 
inventorySearchBar.addEventListener('input', funcƟ on() {
 const searchTerm = inventorySearchBar.value.toLowerCase().trim(); 
 const filteredItems = inventory.filter(item => 
 item.name.toLowerCase().includes(searchTerm) || 
 item.id.toLowerCase().includes(searchTerm) 
 ); 
 renderInventory(filteredItems); 
}); 
/** 
 * Toggles the visibility of the sale price input based on the selected reason. 
 */ 
funcƟ on toggleSalePriceInput() {
 if (reasonSaleRadio.checked) { 
 salePriceContainer.classList.remove('hidden'); 
 salePriceInput.setAƩ ribute('required', 'true');
 // Set default sale price to item's cost price when selected item changes 
 const selectedItem = inventory.find(item => item.id === modifyItemIdSelect.value); 
 if (selectedItem) { 
 salePriceInput.value = selectedItem.price.toFixed(2); 
 } else { 
 salePriceInput.value = ''; 
 } 
 } else { 
 salePriceContainer.classList.add('hidden'); 
 salePriceInput.removeAƩ ribute('required');
 salePriceInput.value = ''; 
 } 
} 
// Event listeners for reason radio buƩ ons
reasonSaleRadio.addEventListener('change', toggleSalePriceInput); 
reasonDamageRadio.addEventListener('change', toggleSalePriceInput); 
// Event listener for item selecƟ on change to update default sale price
modifyItemIdSelect.addEventListener('change', toggleSalePriceInput); 
/** 
* Handles the submission of the stock modificaƟ on form.
 * @param {Event} event - The form submission event. 
 */ 
stockModificaƟ onForm.addEventListener('submit', funcƟ on(event) {
 event.preventDefault(); 
 const selectedItemId = modifyItemIdSelect.value; 
 const quanƟ tyChange = parseInt(modifyQuanƟ tyInput.value);
 const changeReason = 
document.querySelector('input[name="changeReason"]:checked').value; 
 const salePrice = parseFloat(salePriceInput.value); 
 if (!selectedItemId) { 
 showMessage('Please select an item.', 'error'); 
 return; 
 } 
 if (isNaN(quanƟ tyChange) || quanƟ tyChange <= 0) {
 showMessage('Please enter a valid posiƟ ve quanƟ ty.', 'error');
 return; 
 } 
 if (changeReason === 'sale' && (isNaN(salePrice) || salePrice < 0)) { 
 showMessage('Please enter a valid sale price.', 'error'); 
 return; 
 } 
 const itemToModify = inventory.find(item => item.id === selectedItemId); 
 if (!itemToModify) { 
 showMessage('Selected item not found.', 'error'); 
 return; 
 } 
 if (quanƟ tyChange > itemToModify.quanƟ ty) {
 showMessage('Cannot change more than available quanƟ ty.', 'error');
 return; 
 } 
 // Perform stock modificaƟ on
 itemToModify.quanƟ ty -= quanƟ tyChange;
 if (changeReason === 'sale') { 
 // Profit/Loss = (Sale Price - Cost Price) * QuanƟ ty
 const itemCostPrice = itemToModify.price; 
 const profitLossPerUnit = salePrice - itemCostPrice; 
 const transacƟ onProfitLoss = profitLossPerUnit * quanƟ tyChange;
 if (transacƟ onProfitLoss >= 0) {
 totalProfit += transacƟ onProfitLoss;
 showMessage(`Sold ${quanƟ tyChange} of ${itemToModify.name} for 
₹${salePrice.toFixed(2)} each. Profit: ₹${transacƟ onProfitLoss.toFixed(2)}`, 'success');
 } else { 
 totalLoss += Math.abs(transacƟ onProfitLoss);
 showMessage(`Sold ${quanƟ tyChange} of ${itemToModify.name} for 
₹${salePrice.toFixed(2)} each. Loss: ₹${Math.abs(transacƟ onProfitLoss).toFixed(2)}`, 'info');
 } 
 } else if (changeReason === 'damage') { 
 totalLoss += (quanƟ tyChange * itemToModify.price); // Loss is based on cost price
 showMessage(`Logged ${quanƟ tyChange} of ${itemToModify.name} as damaged. Loss: 
₹${(quanƟ tyChange * itemToModify.price).toFixed(2)}`, 'info');
 } 
 // Remove item if quanƟ ty drops to 0 or below
 if (itemToModify.quanƟ ty <= 0) {
 inventory = inventory.filter(item => item.id !== selectedItemId); 
 showMessage(`${itemToModify.name} quanƟ ty reached zero and was removed from 
inventory.`, 'info'); 
 } 
 saveState(); 
 populateModifyItemSelect(); // Re-populate dropdown to reflect new quanƟƟ es or 
removed items 
 updateFinancialSummary(); // Update profit/loss display 
 updateInventoryMetrics(); // Update overall inventory metrics 
 renderInventory(); // Re-render inventory table if acƟ ve
 modifyQuanƟ tyInput.value = ''; // Clear the quanƟ ty input aŌ er successful modificaƟ on
 salePriceInput.value = ''; // Clear sale price input 
}); 
// IniƟ al load and render when the page loads
document.addEventListener('DOMContentLoaded', () => { 
 loadState(); 
 showScreen('addItemScreen'); // Show the Add Item screen by default 
});
