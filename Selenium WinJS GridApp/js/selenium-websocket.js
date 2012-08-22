var messageWebSocket = null;

function sendMessage(msg) {
    messageWriter.writeString(msg);
    messageWriter.storeAsync().done("", sendError);
}

function onMessageReceived(args) {
    try {
        // The incoming message is already buffered.
        var dataReader = args.getDataReader(),
            receivedString = dataReader.readString(dataReader.unconsumedBufferLength),
            receivedData;
        try {
            receivedData = JSON.parse(receivedString);
        } catch (e) {}
        // Use the dataReader to read data from the received message
        console.log(receivedString);

        if (seleniumCommands && receivedData && 'command' in receivedData && receivedData.command in seleniumCommands) {
            console.log('recognized command');
            seleniumCommands[receivedData.command](receivedData);
        }
    } catch (e) {
        console.error('fail to read response ', e);
        onClosed();
    }
}

function onClosed(args) {
    // You can add code to log or display the code and reason
    // for the closure (stored in args.code and args.reason)
    if (messageWebSocket) {
        messageWebSocket.close();
    }
    messageWebSocket = null;
}

function sendError() {
    console.log('sendError', arguments);
}

function startSend() {
    if (!messageWebSocket) {
        var webSocket = new Windows.Networking.Sockets.MessageWebSocket();
        // MessageWebSocket supports both utf8 and binary messages.
        // When utf8 is specified as the messageType, then the developer
        // promises to only send utf8-encoded data.
        webSocket.control.messageType = Windows.Networking.Sockets.SocketMessageType.utf8;
        // Set up callbacks
        webSocket.onmessagereceived = onMessageReceived;
        webSocket.onclosed = onClosed;

        var serverAddress = new Windows.Foundation.Uri('ws://kingfeltjust-lm.saopaulo.corp.yahoo.com:8080/browser_connection/websocket');

        try {
            webSocket.connectAsync(serverAddress).done(function () {
                messageWebSocket = webSocket;
                // The default DataWriter encoding is utf8.
                messageWriter = new Windows.Storage.Streams.DataWriter(webSocket.outputStream);
                messageWriter.writeString('start from winjs');
                messageWriter.storeAsync().done("", sendError);

            }, function (error) {
                console.error('CONNECTION ERROR', error);
                // The connection failed; add your own code to log or display 
                // the error, or take a specific action.
            });
        } catch (error) {
            // An error occurred while trying to connect; add your own code to  
            // log or display the error, or take a specific action.
            console.error('OTHER ERROR', error);
        }

    }
    else {
        // The connection already exists; go ahead and send the message.
        messageWriter.writeString('start from winjs existing connection');
        messageWriter.storeAsync().done("", sendError);
    }
}
startSend();
