OraclePolicyAutomation.AddExtension({
    customContainer: function (control, interview) {
        if (control.getProperty("type") === "oda") {
            return {
                mount: function (el) {
                    this.initSdk('Bots');
                },
                update: function (el) {
                    return;
                },
                initSdk: function (name) {
                    var chatWidgetSettings = {
                        URI: 'oda-nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn-xx.yyy.digitalassistant.oci.oraclecloud.com',
                        channelId: 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn',
                        //enableAutocomplete: true,
                        enableSpeech: true,
                        enableBotAudioResponse: true,
                        enableClearMessage: true,
                        openChatOnLoad: true,
                        typingIndicatorTimeout: 60,
                        // initUserHiddenMessage: "Hello",
                        // logoIcon: "../WebWidget/chat.svg",
                        // botIcon: "../WebWidget/chat.svg",
                        // botButtonIcon: "../WebWidget/ChatBot_HomepageIcon.png",
                        // clearMessageIcon: "../WebWidget/clearMessageIcon.svg",
                        // audioResponseOffIcon: "../WebWidget/audioResponseOffIcon.svg",
                        // audioResponseOnIcon: "../WebWidget/audioResponseOnIcon.svg",
                        // closeIcon: "../WebWidget/closeIcon.svg",
                        // attachmentIcon: "../WebWidget/attachmentIcon.svg",
                        // sendIcon: "../WebWidget/sendIcon.svg"
                    };
                    // Default name is Bots
                    if (!name) {
                        name = 'Bots';
                    }
                    setTimeout(() => {
                        window[name] = new WebSDK(chatWidgetSettings);
                        window[name].connect()
                            .then(() => {
                                console.log("Connection Successful");
                                //Bots.sendMessage('hello');
                                document
                                    .getElementsByClassName("oda-chat-button-clear")[0]
                                    .addEventListener(
                                        "click",
                                        e => {
                                            Bots.sendMessage("Hello", { hidden: true });
                                        },
                                        true
                                    );
                                if (Bots.isChatOpened()) {
                                    // If the widget is already opened by the time connection is made
                                    // send Hi immediately
                                    Bots.sendMessage("Hello", {
                                        hidden: true
                                    });
                                } else {
                                    // If widget is closed, add a listener for when the widget is opened
                                    Bots.on("widget:opened", () => {
                                        console.info("Widget is opened!");
                                        Bots.off();
                                        Bots.sendMessage("Hello", {
                                            hidden: true
                                        });
                                    });
                                }
                            })
                            .catch((reason) => {
                                console.log("Connection failed");
                                console.log(reason);
                            });
                    });
                }
            }
        }
    }
});
