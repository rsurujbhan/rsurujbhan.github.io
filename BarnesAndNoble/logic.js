RightNow.namespace('Custom.Widgets.robert.ChatTranscriptBN2');
Custom.Widgets.robert.ChatTranscriptBN2 = RightNow.Widgets.ChatTranscript.extend({ 
    /**
     * Place all properties that intend to
     * override those of the same name in
     * the parent inside `overrides`.
     */
    overrides: {
        /**
         * Overrides RightNow.Widgets.ChatTranscript#constructor.
         */
        constructor: function() {
            // Call into parent's constructor
            this.parent();

            // initialize VA tracker
            this._virtualAgentWasHere = false;
        },

        /**
        * Event received when a participant joins the chat. Adds note to transcript.
        * @param type string Event name
        * @param args object Event arguments
        */
        _onChatEngagementParticipantAddedResponse: function(type, args)
        {
            var agent = args[0].data.agent;
            var role = args[0].data.role;
            var message = "";

            // was the VA here?
            if(role === "LEAD" && args[0].data.virtualAgent === true) {
                // this was the VA!
                this._virtualAgentWasHere = true;
            }

            /* original ChatTranscript code start */
            if(role === "LEAD")
            {
                if(RightNow.Chat.UI.Util.hasLeaveScreenIssues())
                {
                    this._appendEJSToChat(this.getStatic().templates.systemMessage, {
                        attrs: this.data.attrs,
                        messages: [this.data.attrs.label_leave_screen_warning],
                        context: null
                    });
                }

                this._transcript.all('.rn_VideoChatAction').remove();
                message = ': ' + agent.greeting;
            }
            else
            {
                message = ' ' + this.data.attrs.label_has_joined_chat;
            }

            this._appendEJSToChat(this.getStatic().templates.participantAddedResponse, {
                template: 'participantAddedResponse',
                attrs: this.data.attrs,
                agentName: this._getAgentIdString(args[0].data.agent.name),
                role: role,
                message: message,
                createdTime: args[0].data.createdTime
            });
            /* original ChatTranscript code end */


            /* custom logic start */
            if(role === "LEAD" && args[0].data.virtualAgent === false && this._virtualAgentWasHere === true) {
                // this was a VA > Agent transfer!
                
                this._appendEJSToChat(this.getStatic().templates.participantAddedResponse, {
                    template: 'participantAddedResponse',
                    attrs: this.data.attrs,
                    agentName: this._getAgentIdString(args[0].data.agent.name),
                    role: role,
                    message: ": " + RightNow.Interface.getMessage("CUSTOM_MSG_CHAT_OVA_PLEASE_WAIT_MSG"),
                    createdTime: Date.now()
                });

                // reset
                this._virtualAgentWasHere = false;
            }
            /* custom logic end */
        }

        /**
         * Overridable methods from ChatTranscript:
         *
         * Call `this.parent()` inside of function bodies
         * (with expected parameters) to call the parent
         * method being overridden.
         */
        // _onOITLoaded: function(args)
        // _onChatDisconnect: function(type, args)
        // _onChatStateChangeResponse: function(type, args)
        // _onChatEngagementParticipantAddedResponse: function(type, args)
        // _onChatEngagementParticipantRemovedResponse: function(type, args)
        // _onChatPostResponse: function(type, args)
        // _setEndUserName: function(args)
        // _onChatPostCompletion: function(type, args)
        // _onChatEngagementConcludedResponse: function(type, args)
        // _fileNotifyResponse: function(type, args)
        // _fileUploadResponse: function(type, args)
        // _agentAbsentUpdateResponse: function(type, args)
        // _coBrowseInvitationResponse: function(type, args)
        // _coBrowsePremiumInvitationResponse: function(type, args)
        // _coBrowseAcceptResponse: function(type, args)
        // _coBrowseStatusResponse: function(type, args)
        // _videoChatInvitationResponse: function(type, args)
        // _videoChatAcceptResponse: function(type, args)
        // _videoChatStatusResponse: function(type, args)
        // _videoChatStatusResponseInlay: function(args)
        // _reconnectUpdateResponse: function(type, args)
        // _onAgentStatusChangeResponse: function(type, args)
        // _preloadImages: function()
        // _appendEJSToChat: function(postText, postData, postID)
        // scroll: function(node)
        // _appendEJSToOtherChatWindow: function(type, args)
        // scroll: function(node)
        // _formatLinks: function(text)
        // _escapeUnbalancedLessThanSignsAndTags: function(inputString)
        // _sanitizeInput: function (inputString)
        // _getAgentIdString: function(agentName)
        // _onApplicationFocus: function()
        // _onApplicationBlur: function()
        // onAllowCoBrowsePremiumClick: function (e)
        // onDeclineCoBrowsePremiumClick: function ()
        // onAllowVideoChatClick: function (e)
        // onDeclineVideoChatClick: function ()
        // sendCoBrowseResponse: function(accepted, coBrowseUrl)
        // sendCoBrowsePremiumResponse: function(accepted, agentEnvironment, coBrowseSessionId)
        // sendVideoChatResponse: function(scope, accepted, videoChatSessionId)
        // sendVideoChatStartedResponse: function()
        // sendVideoChatStoppedResponse: function()
        // sendVideoChatAbortedResponse: function()
        // sendVideoChatErrorResponse: function(error)
    },

    /**
     * Sample widget method.
     */
    methodName: function() {

    }
});
