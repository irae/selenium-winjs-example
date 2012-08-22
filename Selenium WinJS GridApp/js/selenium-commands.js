
var seleniumCommands = {
    click: function clickElement(data) {
        console.log('should click element ', data.selector);
        var element = document.querySelector(data.selector),
            rect = element.getClientRects()[0];

        if (!element) {
            return false;
        }

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 1,
            (rect.left + element.clientWidth / 2),
            (rect.top + element.clientHeight / 2),
            (rect.left + element.clientWidth / 2),
            (rect.top + element.clientHeight / 2),
            false, false, false, false, /* keys */
            0, /* buttun */
            element);

        element.dispatchEvent(event);
        return true;
    }
}