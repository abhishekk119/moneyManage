// Original variables and functions (unchanged)
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

// NEW: Simplified localStorage functionality
function saveToLocalStorage() {
    // Save the entire body's HTML (simple approach)
    localStorage.setItem('expenseTrackerHTML', document.body.innerHTML);
    
    // Save variables
    localStorage.setItem('expenseTrackerData', JSON.stringify({
        counter: counter,
        spent: spent,
        showToday: showToday,
        lastCreatedDivId: lastCreatedDiv ? lastCreatedDiv.id : null,
        amtInputDisabled: document.getElementById("amt-input").disabled,
        btnDisabled: document.getElementById("btn").disabled,
        btn2Disabled: document.getElementById("btn2").disabled
    }));
}

function loadFromLocalStorage() {
    const savedHTML = localStorage.getItem('expenseTrackerHTML');
    const savedData = localStorage.getItem('expenseTrackerData');
    
    if (savedHTML && savedData) {
        // Restore HTML first
        document.body.innerHTML = savedHTML;
        
        // Restore variables
        const parsedData = JSON.parse(savedData);
        counter = parsedData.counter;
        spent = parsedData.spent;
        showToday = parsedData.showToday;
        
        // Restore last created div reference
        if (parsedData.lastCreatedDivId) {
            lastCreatedDiv = document.getElementById(parsedData.lastCreatedDivId);
        }
        
        // Restore form states
        document.getElementById("amt-input").disabled = parsedData.amtInputDisabled;
        document.getElementById("btn").disabled = parsedData.btnDisabled;
        document.getElementById("btn2").disabled = parsedData.btn2Disabled;
        
        // Reattach event listeners to all buttons
        document.querySelectorAll('.dynamic-btn').forEach(button => {
            const divId = button.closest('div').previousElementSibling.id;
            button.addEventListener('click', function() {
                const div = document.getElementById(divId);
                if (div.style.display === "block") {
                    div.style.display = "none";
                } else {
                    div.style.display = "block";
                }
                saveToLocalStorage();
            });
        });
    }
}

function clearAllData() {
    if (confirm("Are you sure you want to delete all expense data? This cannot be undone.")) {
        localStorage.clear();
        location.reload(); // Simplest way to reset everything
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    
    // Save when leaving the page
    window.addEventListener('beforeunload', saveToLocalStorage);
});
