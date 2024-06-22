document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const contextMenu = document.getElementById('context-menu');
    const colorPicker = document.getElementById('colorPicker');
    const fontColorPicker = document.getElementById('fontColorPicker');
    const fontSizePicker = document.getElementById('fontSizePicker');
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
    let undoStack = [];
    let redoStack = [];

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
                    height: element.style.height,
                    backgroundColor: element.style.backgroundColor || '',
                    color: element.style.color || '',
                    fontSize: element.style.fontSize || '',
                    fontWeight: element.style.fontWeight || '',
                    fontStyle: element.style.fontStyle || '',
                    textDecoration: element.style.textDecoration || ''
                }
            };
        });
        undoStack.push(JSON.stringify(elements));
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
                el.style.backgroundColor = element.style.backgroundColor;
                el.style.color = element.style.color;
                el.style.fontSize = element.style.fontSize;
                el.style.fontWeight = element.style.fontWeight;
                el.style.fontStyle = element.style.fontStyle;
                el.style.textDecoration = element.style.textDecoration;
                canvas.appendChild(el);
                makeResizable(el);
            });
        }
    }

    function undo() {
        if (undoStack.length > 1) {
            const currentState = undoStack.pop();
            redoStack.push(currentState);
            const previousState = undoStack[undoStack.length - 1];
            restoreCanvasState(previousState);
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            const nextState = redoStack.pop();
            undoStack.push(nextState);
            restoreCanvasState(nextState);
        }
    }

    function restoreCanvasState(state) {
        canvas.innerHTML = '';
        const elements = JSON.parse(state);
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
            el.style.backgroundColor = element.style.backgroundColor;
            el.style.color = element.style.color;
            el.style.fontSize = element.style.fontSize;
            el.style.fontWeight = element.style.fontWeight;
            el.style.fontStyle = element.style.fontStyle;
            el.style.textDecoration = element.style.textDecoration;
            canvas.appendChild(el);
            makeResizable(el);
        });
        localStorage.setItem('canvasState', state);
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

function duplicateElement() {
    if (selectedElement) {
        const clone = selectedElement.cloneNode(true);
        clone.classList.remove('selected');
        clone.style.left = `${parseInt(clone.style.left) + 20}px`;
        clone.style.top = `${parseInt(clone.style.top) + 20}px`;
        canvas.appendChild(clone);
        makeResizable(clone);
        saveCanvasState();
    }
}

function changeBackgroundColor() {
    if (selectedElement) {
        colorPicker.click();
    }
}

function setBackgroundColor(color) {
    if (selectedElement) {
        selectedElement.style.backgroundColor = color;
        saveCanvasState();
    }
}

function formatText(command) {
    if (selectedElement && selectedElement.contentEditable === 'true') {
        document.execCommand(command, false, null);
        saveCanvasState();
    }
}

function changeFontSize() {
    if (selectedElement && selectedElement.contentEditable === 'true') {
        fontSizePicker.click();
    }
}

function setFontSize(size) {
    if (selectedElement) {
        selectedElement.style.fontSize = `${size}px`;
        saveCanvasState();
    }
}

function changeFontColor() {
    if (selectedElement && selectedElement.contentEditable === 'true') {
        fontColorPicker.click();
    }
}

function setFontColor(color) {
    if (selectedElement) {
        selectedElement.style.color = color;
        saveCanvasState();
    }
}
