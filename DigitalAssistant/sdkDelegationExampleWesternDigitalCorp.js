/**
 * NOTE: SDK configuration settings have been omitted in this example!
 */

// assume chatSettings object is defined

setTimeout(() => {

    // initialize SDK
    const Bots = new WebSDK(chatSettings);

    const delegate = {
        // modify user message before it is sent to ODA
        beforeSend: function (message) {
            console.log("beforeSend", message);
            if (message.messagePayload.type === "attachment" && message.messagePayload.attachment.type === "image") {

                // override to a plain text message (use original image url as the text data)
                message.messagePayload.type = "text";
                message.messagePayload.text = message.messagePayload.attachment.url;

                // remove original attachment sub-object property from the message payload
                delete message.messagePayload.attachment;

                // TEST to use public-facing Internet image (wide open):
                //message.messagePayload.attachment.url = "https://i.imgur.com/JJxxMcE.jpg";
            }
            return message;
        }
    };

    Bots.setDelegate(delegate);

    Bots.on('ready', () => {
        console.log('Digital Assistant Client SDK ready');
    });

    Bots.on(WebSDK.EVENT.WIDGET_OPENED, () => {
        console.log('Digital Assistant widget opened');
    });

    // connect to server
    Bots.connect().then(() => {
        console.log('Digital Assistant Client SDK connection successful');
    }).catch((reason) => {
        console.error('Digital Assistant Client SDK connection failed', reason);
    });

    // global object
    window[name] = Bots;

}, 0);
