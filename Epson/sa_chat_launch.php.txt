<rn:meta title="#rn:msg:LIVE_CHAT_LBL#" template="standard.php" clickstream="chat_request"/>

<div class="rn_Hero">
    <div class="rn_HeroInner">
        <div class="rn_HeroCopy">
            <h1>#rn:msg:SUBMIT_QUESTION_OUR_SUPPORT_TEAM_CMD#</h1>
        </div>
    </div>
</div>

<div id="rn_PageContent" class="rn_PageContent rn_AskQuestion rn_Container">
    <div class="rn_Padding">
        <form id="rn_QuestionSubmit">
                <div id="rn_ErrorLocation"></div>

                <rn:widget path="input/FormInput" name="Incident.Subject" required="true" label_input="How Can We Help?"/>
                <rn:widget path="input/FormInput" name="Contact.Name.First" label_input="#rn:msg:FIRST_NAME_LBL#" required="true"/>
                <rn:widget path="input/FormInput" name="Contact.Name.Last" label_input="#rn:msg:LAST_NAME_LBL#" required="true"/>
                <rn:widget path="input/FormInput" name="Contact.Emails.PRIMARY.Address" required="true" label_input="#rn:msg:EMAIL_ADDR_LBL#"/>

                <!-- optional fields -->
                <!-- <rn:widget path="input/CustomAllInput" table="Incident" chat_visible_only="true" always_show_mask="false" /> -->

                <br />

                 <rn:widget path="input/SmartAssistantDialog" label_submit_button="Finish Submitting - Let's Chat!" label_cancel_button="#rn:msg:EDIT_QUESTION_CMD#" label_solved_button="#rn:msg:MY_QUESTION_IS_ANSWERED_MSG#" display_answers_inline="true" label_prompt="#rn:msg:FLLOWING_ANS_HELP_IMMEDIATELY_MSG#" display_button_as_link="label_cancel_button" dialog_width="800px"/>

                 <rn:widget path="input/FormSubmit" label_button="Chat Now" error_location="rn_ErrorLocation" />
        </form>
    </div>
</div>

<script>
    var submitRequests = 0;

    function handleSubmitRequest(type, args) {
        //console.log("handleSubmitRequest");
        submitRequests++;
        if (submitRequests === 2) {
            //console.log("ready!");
            document.getElementById("rn_QuestionSubmit").method = "post";
            document.getElementById('rn_QuestionSubmit').action = "/app/chat/chat_landing";
        }
    }

    function ready(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function pageReady() {
        RightNow.Event.subscribe("evt_formButtonSubmitRequest", handleSubmitRequest, this);
    }

    ready(pageReady);
</script>
