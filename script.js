document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const contextMenu = document.getElementById('context-menu');
    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mouseup', stopDrag);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('click', selectElement);
    canvas.addEventListener('contextmenu', showContextMenu);

    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });

    loadCanvasState();

    let draggingElement = null;
    let selectedElement = null;

    function startDrag(event) {
        if (event.target.classList.contains('draggable')) {
            draggingElement = event.target;
            draggingElement.dataset.offsetX = event.clientX - draggingElement.offsetLeft;
            draggingElement.dataset.offsetY = event.clientY - draggingElement.offsetTop;
        }
    }

    function drag(event) {
        if (draggingElement) {
            draggingElement.style.left = `${event.clientX - draggingElement.dataset.offsetX}px`;
            draggingElement.style.top = `${event.clientY - draggingElement.dataset.offsetY}px`;
        }
    }

    function stopDrag() {
        if (draggingElement) {
            saveCanvasState();
            draggingElement = null;
        }
    }

    function selectElement(event) {
        if (event.target.classList.contains('draggable')) {
            if (selectedElement) {
                selectedElement.classList.remove('selected');
            }
            selectedElement = event.target;
            selectedElement.classList.add('selected');
        } else {
            if (selectedElement) {
                selectedElement.classList.remove('selected');
                selectedElement = null;
            }
        }
    }

    function showContextMenu(event) {
        event.preventDefault();
        if (event.target.classList.contains('draggable')) {
            selectElement(event);
            contextMenu.style.top = `${event.clientY}px`;
            contextMenu.style.left = `${event.clientX}px`;
            contextMenu.style.display = 'block';
        } else {
            contextMenu.style.display = 'none';
        }
    }

    function makeResizable(element) {
        $(element).resizable({
            stop: saveCanvasState
        });
    }

    function saveCanvasState() {
        const elements = Array.from(canvas.children).map(element => {
            return {
                type: element.tagName.toLowerCase(),
                content: element.contentEditable ? element.innerText : element.src || element.srcdoc,
                style: {
                    left: element.style.left,
                    top: element.style.top,
                    width: element.style.width,
                    height: element.style.height
                }
            };
        });
        localStorage.setItem('canvasState', JSON.stringify(elements));
    }

    function loadCanvasState() {
        const savedState = localStorage.getItem('canvasState');
        if (savedState) {
            const elements = JSON.parse(savedState);
            elements.forEach(element => {
                let el;
                switch (element.type) {
                    case 'div':
                        el = document.createElement('div');
                        el.contentEditable = true;
                        el.innerText = element.content;
                        break;
                    case 'img':
                        el = document.createElement('img');
                        el.src = element.content;
                        break;
                    case 'iframe':
                        el = document.createElement('iframe');
                        el.src = element.content;
                        break;
                }
                el.className = 'draggable';
                el.style.left = element.style.left;
                el.style.top = element.style.top;
                el.style.width = element.style.width;
                el.style.height = element.style.height;
                canvas.appendChild(el);
                makeResizable(el);
            });
        }
    }

    window.addEventListener('beforeunload', saveCanvasState);
});

function addText() {
    const canvas = document.getElementById('canvas');
    const textElement = document.createElement('div');
    textElement.className = 'draggable';
    textElement.contentEditable = true;
    textElement.innerText = 'Texto editable';
    textElement.style.left = '50px';
    textElement.style.top = '50px';
    canvas.appendChild(textElement);
    makeResizable(textElement);
    saveCanvasState();
}

function addImage() {
    const canvas = document.getElementById('canvas');
    const imageUrl = prompt('Introduce la URL de la imagen:');
    if (imageUrl) {
        const imgElement = document.createElement('img');
        imgElement.className = 'draggable';
        imgElement.src = imageUrl;
        imgElement.style.width = '200px';
        imgElement.style.height = 'auto';
        imgElement.style.left = '50px';
        imgElement.style.top = '50px';
        canvas.appendChild(imgElement);
        makeResizable(imgElement);
        saveCanvasState();
    }
}

function addIframe() {
    const canvas = document.getElementById('canvas');
    const iframeUrl = prompt('Introduce la URL del iframe:');
    if (iframeUrl) {
        const iframeElement = document.createElement('iframe');
        iframeElement.className = 'draggable';
        iframeElement.src = iframeUrl;
        iframeElement.style.left = '50px';
        iframeElement.style.top = '50px';
        iframeElement.style.width = '300px';
        iframeElement.style.height = '200px';
        canvas.appendChild(iframeElement);
        makeResizable(iframeElement);
        saveCanvasState();
    }
}

function deleteSelectedElement() {
    if (selectedElement) {
        selectedElement.remove();
        saveCanvasState();
        selectedElement = null;
    }
}
