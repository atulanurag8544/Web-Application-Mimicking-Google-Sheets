// Keeps track of the selected cell
let selectedCell = null;

// Initialize a 64x64 grid on page load
window.onload = function initializeGrid() {
    const spreadsheet = document.getElementById('spreadsheet');

    // Create headers
    const headerRow = document.createElement('div');
    headerRow.classList.add('header-row');
    headerRow.innerHTML = `<div class="cell header"></div>`;
    for (let col = 0; col < 64; col++) {
        const columnLabel = getColumnLabel(col);
        headerRow.innerHTML += `<div class="cell header">${columnLabel}</div>`;
    }
    spreadsheet.appendChild(headerRow);

    // Create rows
    for (let row = 1; row <= 64; row++) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        newRow.innerHTML = `<div class="cell header">${row}</div>`;

        for (let col = 0; col < 64; col++) {
            const columnLabel = getColumnLabel(col);
            const cellId = `${columnLabel}${row}`;
            newRow.innerHTML += `<div class="cell" contenteditable="true" data-cell="${cellId}" data-type="text"></div>`;
        }
        spreadsheet.appendChild(newRow);
    }

    // Attach cell listeners
    attachCellListeners();
};

// Attach event listeners to editable cells
function attachCellListeners() {
    document.querySelectorAll('.cell[contenteditable="true"]').forEach(cell => {
        cell.addEventListener('focus', () => {
            selectedCell = cell;
            document.getElementById('formulaBar').value = cell.textContent;
        });

        // Save data in cell when Enter key is pressed
        cell.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent default new line behavior
                const formulaBarValue = document.getElementById('formulaBar').value.trim();
                cell.innerHTML = formulaBarValue; // Save the data in the cell
                applyFormula(); // Apply the formula or save the content
                moveToNextCell(); // Move to the next cell
            }
        });

        cell.addEventListener('input', () => {
            if (selectedCell === cell) {
                document.getElementById('formulaBar').value = cell.textContent; // Sync the formula bar
            }
        });
    });
}

// Helper to get column labels (A, B, ..., Z, AA, AB, ...)
function getColumnLabel(index) {
    let label = '';
    while (index >= 0) {
        label = String.fromCharCode((index % 26) + 65) + label;
        index = Math.floor(index / 26) - 1;
    }
    return label;
}

// Apply formula or value from the formula bar
function applyFormula() {
    const formulaBarValue = document.getElementById('formulaBar').value.trim();

    if (!selectedCell) {
        alert('Select a cell to apply the formula.');
        return;
    }

    if (formulaBarValue.startsWith('=')) {
        const operation = formulaBarValue.slice(1).toUpperCase();
        console.log(`Applying formula: ${operation}`); // Debug log
        try {
            if (operation.startsWith('SUM(')) {
                selectedCell.textContent = handleSUM(operation);
            } else if (operation.startsWith('AVERAGE(')) {
                selectedCell.textContent = handleAVERAGE(operation);
            } else if (operation.startsWith('MAX(')) {
                selectedCell.textContent = handleMAX(operation);
            } else if (operation.startsWith('MIN(')) {
                selectedCell.textContent = handleMIN(operation);
            } else if (operation.startsWith('COUNT(')) {
                selectedCell.textContent = handleCOUNT(operation);
            } else if (operation.startsWith('UPPER(')) {
                selectedCell.textContent = handleUPPER(operation);
            } else if (operation.startsWith('LOWER(')) {
                selectedCell.textContent = handleLOWER(operation);
            } else if (operation.startsWith('TRIM(')) {
                selectedCell.textContent = handleTRIM(operation);
            } else if (operation.startsWith('REMOVE_DUPLICATES(')) {
                handleREMOVE_DUPLICATES(operation);
            } else {
                selectedCell.textContent = evalFormula(formulaBarValue.slice(1));
            }
        } catch (err) {
            alert('Error in formula: ' + err.message);
        }
    } else {
        selectedCell.textContent = formulaBarValue;
    }

    document.getElementById('formulaBar').value = selectedCell.textContent;
}

// Create Chart function
function createChart() {
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar', // Example chart type
        data: {
            labels: ['Label 1', 'Label 2', 'Label 3'], // Example labels
            datasets: [{
                label: 'My Dataset',
                data: [12, 19, 3], // Example data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
