/**
 * Utility functions for the Focus Dashboard
 */

/**
 * Makes an element draggable
 * @param {HTMLElement} el The element to make draggable
 * @param {HTMLElement} handle The handle to drag the element by
 * @param {string} storageKey Optional localStorage key to save the position
 */
export function makeDraggable(el, handle, storageKey) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        el.style.right = 'auto';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify({
                top: el.style.top,
                left: el.style.left
            }));
        }
    }
}
