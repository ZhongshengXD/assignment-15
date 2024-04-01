class Cratf {
    constructor({
        name,
        image,
        description,
        supplies
    }) {
        this.name = name;
        this.image = image;
        this.description = description;
        this.supplies = supplies;
    }

    getSection() {
        return `<div class="tree-card" id="${this.name.replace(/\s/g, '')}">
                <h3>${this.name}</h3>
                <img src="crafts/${this.image}" alt="${this.name}">
              </div>`;
    }

    getExpandedSection() {
        const suppliesList = this.supplies.map(supply => `<li>${supply}</li>`).join('');
        return `<div id="${this.name.replace(/\s/g, '')}Modal" class="w3-modal" style="display: none;">
            <div class="w3-modal-content">
              <header class="w3-container w3-teal"> 
                <span onclick="document.getElementById('${this.name.replace(/\s/g, '')}Modal').style.display='none'"
                class="w3-button w3-display-topright">&times;</span>
                <h2>${this.name}</h2>
              </header>
              <div class="w3-container modal-content">
              <div class="modal-image">
              <img src="crafts/${this.image}" alt="${this.name}" style="width:100%">
          </div>
                <div class="modal-description">
                    <p>${this.description}</p>
                    <ul>${suppliesList}</ul>
                </div>
              </div>
            </div>
          </div>`;
    }
}

fetch('/api/crafts')
    .then(response => response.json())
    .then(data => {
        let trees = data.map(item => new Cratf(item));
        displayTrees(trees);
        addModalListeners(trees);
    })
    .catch(error => console.error('Error:', error));

function displayTrees(trees) {
    if (!Array.isArray(trees)) {
        console.error('Invalid argument: trees must be an array');
        return;
    }

    const container = document.getElementById('tree-container');
    let treeHTML = '';
    let modalHTML = '';
    trees.forEach(tree => {
        treeHTML += tree.getSection();
        modalHTML += tree.getExpandedSection();
    });
    container.innerHTML = treeHTML;
    document.body.innerHTML += modalHTML;
}

function addModalListeners(trees) {
    if (!Array.isArray(trees)) {
        console.error('Invalid argument: trees must be an array');
        return;
    }

    trees.forEach(tree => {
        const treeElement = document.getElementById(tree.name.replace(/\s/g, ''));
        treeElement.onclick = () => {
            document.getElementById(tree.name.replace(/\s/g, '') + 'Modal').style.display = 'block';
        };
    });
}