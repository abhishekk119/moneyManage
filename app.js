let counter = 0;
let lastCreatedDiv = null;
let spent = [];


// Load data from localStorage when page loads
window.addEventListener('DOMContentLoaded', (event) => {
    loadFromLocalStorage();
    
    // Add click event to existing clear button (assuming it has id 'clearBtn')
    document.getElementById('clearBtn').addEventListener('click', clearAllData);
});

function saveToLocalStorage() {
    const appState = {
        counter: counter,
        lastCreatedDivId: lastCreatedDiv ? lastCreatedDiv.id : null,
        spent: spent,
        htmlContent: document.body.innerHTML,
        showToday: showToday
    };
    localStorage.setItem('expenseTrackerAppState', JSON.stringify(appState));
}

function loadFromLocalStorage() {
    const savedState = localStorage.getItem('expenseTrackerAppState');
    if (savedState) {
        const appState = JSON.parse(savedState);
        counter = appState.counter;
        spent = appState.spent || [];
        showToday = appState.showToday;
        
        document.body.innerHTML = appState.htmlContent;
        
        // Reattach event listeners to dynamic elements
        if (appState.lastCreatedDivId) {
            lastCreatedDiv = document.getElementById(appState.lastCreatedDivId);
        }
        
        // Reattach button event listeners
        const buttons = document.querySelectorAll('.dynamic-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const divId = this.parentElement.previousElementSibling.id;
                if (document.getElementById(divId).style.display === "block") {
                    document.getElementById(divId).style.display = "none";
                } else {
                    document.getElementById(divId).style.display = "block";
                }
                saveToLocalStorage();
            });
        });
        
        // Reattach click event to clear button after loading
        document.getElementById('clearBtn').addEventListener('click', clearAllData);
    }
}

function clearAllData() {
    localStorage.removeItem('expenseTrackerAppState');
    location.reload(); // Refresh the page to reset to initial state
}

function addDiv() {
    let today = new Date();
    let showToday = today.toDateString();
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
    let hr = document.createElement('hr');
    div.id = `div-${counter++}`;
    document.body.append(div);
    document.body.append(div2);
    lastCreatedDiv = div;
    div2.append(p);
    div2.append(button);
    div2.append(hr);
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
