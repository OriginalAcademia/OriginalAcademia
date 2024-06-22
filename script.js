document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', startDrag);
    canvas.addEventListener('mouseup', stopDrag);
    canvas.addEventListener('mousemove', drag);

    let draggingElement = null;

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
        draggingElement = null;
    }
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
        canvas.appendChild(iframeElement);
    }
}
