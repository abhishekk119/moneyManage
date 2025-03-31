let spent = [];

// Load saved data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadEntries();
    document.getElementById('clear-btn').addEventListener('click', clearAllData);
});

function clearAllData() {
    if (confirm('Are you sure you want to delete all expense data?')) {
        document.getElementById('container').innerHTML = '';
        spent = [];
        localStorage.removeItem('expenseEntries');
    }
}

function loadEntries() {
    const savedData = localStorage.getItem('expenseEntries');
    
    if (savedData) {
        const entries = JSON.parse(savedData);
        spent = entries.spent || [];
        const container = document.getElementById('container');
        container.innerHTML = '';
        
        entries.items.forEach(entry => {
            const p = document.createElement('p');
            p.textContent = new Date(entry.timestamp);
            container.appendChild(p);
            
            if (entry.type === 'End-day') {
                const h4 = document.createElement('h4');
                h4.textContent = `You spent ${entry.sum}/- today`;
                container.appendChild(h4);
                
                const hr = document.createElement('hr');
                container.appendChild(hr);
            } else {
                const h3 = document.createElement('h3');
                h3.textContent = `${entry.amount}/- for ${entry.type}`;
                container.appendChild(h3);
            }
        });
    }
}

function saveEntries() {
    const container = document.getElementById('container');
    const entries = [];
    let currentEntry = null;
    
    container.childNodes.forEach(node => {
        if (node.nodeName === 'P') {
            if (currentEntry) entries.push(currentEntry);
            currentEntry = {
                timestamp: new Date(node.textContent).getTime(),
                type: '',
                amount: 0
            };
        } else if (node.nodeName === 'H3') {
            if (currentEntry) {
                const parts = node.textContent.split('/- for ');
                currentEntry.amount = Number(parts[0]);
                currentEntry.type = parts[1];
                entries.push(currentEntry);
                currentEntry = null;
            }
        } else if (node.nodeName === 'H4') {
            const sum = Number(node.textContent.match(/You spent (\d+)/)[1]);
            entries.push({
                type: 'End-day',
                sum: sum,
                timestamp: Date.now()
            });
        }
    });
    
    if (currentEntry) entries.push(currentEntry);
    
    localStorage.setItem('expenseEntries', JSON.stringify({
        items: entries,
        spent: spent
    }));
}

function addEntry() {
    let timestamp = Date.now();
    let sum = 0;
    let p = document.createElement('p');
    let h3 = document.createElement('h3');
    let hr = document.createElement('hr');
    let h4 = document.createElement('h4');
    
    p.textContent = new Date(timestamp);
    document.getElementById('container').appendChild(p); 
    
    const selectElement = document.getElementById('mySelect');
    let inputVal = document.getElementById("input-area").value;
    const selectedText = selectElement.options[selectElement.selectedIndex].text;
    
    document.getElementById("input-area").value = '';
    
    spent.push(Number(inputVal));
    
    if (selectedText === "Food") {
        document.getElementById('container').appendChild(h3);
        h3.textContent = inputVal + "/-" + " for" + " Food";
    }
    else if (selectedText === "Tea/Cig/Bakery") {
        document.getElementById('container').appendChild(h3);
        h3.textContent = inputVal + "/-" + " for" + " Tea/Cig/Bakery";
    }
    else if (selectedText === "Travel") {
        document.getElementById('container').appendChild(h3);
        h3.textContent = inputVal + "/-" + " for" + " Travel";
    }
    else if (selectedText === "Other") {
        document.getElementById('container').appendChild(h3);
        h3.textContent = inputVal + "/-" + " for" + " Other";
    }
    else {
        document.getElementById('container').appendChild(h4);
        sum = eval(spent.join('+'));
        h4.textContent = "You spent "+ sum + "/-" + " today";
        document.getElementById('container').appendChild(hr);
        spent = [];
    }
    
    saveEntries();
}