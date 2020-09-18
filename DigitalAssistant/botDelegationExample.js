/**
 * NOTE: SDK configuration settings have been omitted in this example!
 */
 
// assume chatWidgetSettings object is defined

// Initialize SDK
Bots = new WebSDK(chatWidgetSettings); 

const delegate = {
    // modify skill message before it is displayed in the conversation
    beforeDisplay: function (message) {
        //console.log("beforeDisplay", message);
        return message;
    },
    // modify user message before it is sent to ODA
    beforeSend: function (message) {
        //console.log("beforeSend", message);
        // replaces "NNNN/NN/NN" with "NNNN-NN-NN"
        if (message.messagePayload.text.split('/').length === 3 && message.messagePayload.type == 'text') {
            message.messagePayload.text = message.messagePayload.text.replace(/\//g, "-");
        }
        return message;
    },
    // modify user postback message before it is sent to ODA
    beforePostbackSend: function (postback) {
        //console.log("beforePostbackSend", postback);
        return postback;
    }
}

Bots.setDelegate(delegate);

// Connect to ODA
Bots.connect();

// Create global object
window[name] = Bots;
