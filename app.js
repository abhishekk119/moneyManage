let counter = 0;
let lastCreatedDiv = null;
let spent = [];

let today = new Date();
let showToday = today.toDateString();

function addDiv() {
    let timestamp = Date.now();
    document.getElementById("amt-input").disabled = false;
    document.getElementById("btn").disabled = false;
    document.getElementById("btn2").disabled = true;
    let button = document.createElement('button');
    button.classList.add('dynamic-btn');
    let p = document.createElement('p');
    p.textContent = showToday;
    button.textContent = 'Hide/Show';
    let div = document.createElement('div');
    div.classList.add('dynamic-div1');
    let div2 = document.createElement('div');
    div.id = `div-${counter++}`;
    document.body.append(div);
    document.body.append(div2);
    lastCreatedDiv = div;
    div2.append(p);
    div2.append(button);
    button.addEventListener('click', function() {
        if (document.getElementById(div.id).style.display === "block") {
            document.getElementById(div.id).style.display = "none";
        } else {
            document.getElementById(div.id).style.display = "block";
        }
        saveToLocalStorage();
    });
    saveToLocalStorage();
}

function addEntry() {
    let now = new Date();
    let thetime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    let inputVal = document.getElementById("amt-input").value;
    const selectElement = document.getElementById('mySelect');
    const selectedText = selectElement.options[selectElement.selectedIndex].text;
    let h3 = document.createElement('h3');
    h3.classList.add('dynamic-h3');
    let h4 = document.createElement('h4');
    h4.classList.add('dynamic-h4');
    let sum = 0;

    spent.push(Number(inputVal));

    if (inputVal && inputVal !== ' ') {
        if (selectedText === "Food") {
            lastCreatedDiv.append(h3);
            h3.textContent = inputVal + '/-' + ' for ' + ' Food' + " " + " " + " " + thetime;
        }
        else if (selectedText === "Tea/Cig/Bakery") {
            lastCreatedDiv.append(h3);
            h3.textContent = inputVal + '/-' + ' for ' + ' Tea/Cig/Bakery' + " " + " " + " " + thetime;
        }
        else if (selectedText === "Travel") {
            lastCreatedDiv.append(h3);
            h3.textContent = inputVal + '/-' + ' for ' + ' Travel' + " " + " " + " " + thetime;
        }
        else if (selectedText === "Grocery") {
            lastCreatedDiv.append(h3);
            h3.textContent = inputVal + '/-' + ' for ' + ' Grocery' + " " + " " + " " + thetime;
        }
        else if (selectedText === "Other") {
            lastCreatedDiv.append(h3);
            h3.textContent = inputVal + '/-' + ' for ' + ' Other' + " " + " " + " " + thetime;
        }
        else {
            lastCreatedDiv.append(h4);
            sum = eval(spent.join('+'));
            h4.textContent = 'Total spent: ' + sum + '/- ';
            document.getElementById("btn2").disabled = false;
            document.getElementById("amt-input").disabled = true;
            document.getElementById("btn").disabled = true;
            spent = [];
        }
    } else {
        alert("Please enter a value");
    }

    document.getElementById("amt-input").value = ' ';
    saveToLocalStorage();
}

// ===== LOCAL STORAGE FUNCTIONALITY =====
// (Added without modifying existing functions)

// Save current state to local storage
function saveToLocalStorage() {
    const dataToSave = {
        counter: counter,
        lastCreatedDivId: lastCreatedDiv ? lastCreatedDiv.id : null,
        spent: [...spent],
        showToday: showToday,
        divs: []
    };

    // Save all div elements
    document.querySelectorAll('.dynamic-div1').forEach(div => {
        const divData = {
            id: div.id,
            content: div.innerHTML,
            display: div.style.display,
            dateElement: null
        };

        // Find the corresponding date/button div
        const nextSibling = div.nextElementSibling;
        if (nextSibling && nextSibling.querySelector('button.dynamic-btn')) {
            divData.dateElement = nextSibling.innerHTML;
        }

        dataToSave.divs.push(divData);
    });

    localStorage.setItem('expenseTrackerData', JSON.stringify(dataToSave));
}

// Load data from local storage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('expenseTrackerData');
    if (!savedData) return;

    const parsedData = JSON.parse(savedData);
    counter = parsedData.counter;
    spent = [...parsedData.spent];
    showToday = parsedData.showToday;

    // Recreate all div elements
    parsedData.divs.forEach(divData => {
        // Create content div
        const div = document.createElement('div');
        div.id = divData.id;
        div.className = 'dynamic-div1';
        div.innerHTML = divData.content;
        div.style.display = divData.display || 'block';
        document.body.appendChild(div);

        // Create date/button div if it exists
        if (divData.dateElement) {
            const div2 = document.createElement('div');
            div2.innerHTML = divData.dateElement;
            document.body.appendChild(div2);

            // Reattach event listener to button
            const button = div2.querySelector('button.dynamic-btn');
            if (button) {
                button.addEventListener('click', function() {
                    if (document.getElementById(div.id).style.display === "block") {
                        document.getElementById(div.id).style.display = "none";
                    } else {
                        document.getElementById(div.id).style.display = "block";
                    }
                    saveToLocalStorage();
                });
            }
        }

        // Set lastCreatedDiv if this is the most recent one
        if (divData.id === parsedData.lastCreatedDivId) {
            lastCreatedDiv = div;
        }

        // Restore disabled states if this div has a summary
        if (div.querySelector('.dynamic-h4')) {
            document.getElementById("btn2").disabled = false;
            document.getElementById("amt-input").disabled = true;
            document.getElementById("btn").disabled = true;
        }
    });
}

// Clear all data (call this from your HTML button)
function clearAllData() {
    if (confirm("Are you sure you want to delete all expense data? This cannot be undone.")) {
        // Clear local storage
        localStorage.removeItem('expenseTrackerData');
        
        // Remove all dynamically created elements
        document.querySelectorAll('.dynamic-div1').forEach(div => div.remove());
        document.querySelectorAll('div').forEach(div => {
            if (div.querySelector('button.dynamic-btn')) {
                div.remove();
            }
        });
        
        // Reset variables
        counter = 0;
        lastCreatedDiv = null;
        spent = [];
        
        // Reset form controls
        document.getElementById("amt-input").disabled = false;
        document.getElementById("btn").disabled = false;
        document.getElementById("btn2").disabled = true;
        document.getElementById("amt-input").value = '';
    }
}

// Load saved data when page loads
window.addEventListener('DOMContentLoaded', loadFromLocalStorage);