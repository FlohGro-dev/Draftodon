// Draftodon created by FlohGro
// a file fo helpful functions to integrate Drafts and Mastodon
// - https://mastodon.social/@FlohGro
// - https://flohgro.com
//
// feedback and requests welcome ✌️
//
// do you like this ActionGroup?
// 🚀 consider supporting my work: 
// - https://www.buymeacoffee.com/flohgro
// - https://flohgro.com/donate/


const MastodonVisibilities = ["public", "unlisted", "private", "direct"]
const MastodonEndpoints = {
    "STATUS_UPDATE": "/api/v1/statuses",
    "SCHEDULED_STATUSES": "/api/v1/scheduled_statuses"
}
let DraftodonSettings = {
    "mastodonInstance": "",
    "mastodonHandle": "",
    "characterLimit": 0,
    "characterLimitIndicator": "",
    "threadDivider": "",
    "tagsToAddOnSuccess": []
}
// class defines
class MastodonTextStatusUpdate {
    constructor({
        statusText,
        inReplyToId = null,
        sensitive = null,
        spoilerText = null,
        visibility = "public",
        language = null,
        scheduledAt = null
    }) {
        this.statusText = statusText
        this.inReplyToId = inReplyToId
        this.sensitive = sensitive
        this.spoilerText = spoilerText
        this.visibility = visibility
        this.language = language
        this.scheduledAt = scheduledAt
    }
    getObject() {
        let data = {}
        let isValid = true;
        let isInvalidReasons = []
        if (this.statusText.length == 0) {
            isValid = false
            isInvalidReasons.push("no status update text was provided")
        } else {
            data["status"] = this.statusText
        }
        if (this.inReplyToId) {
            data["in_reply_to_id"] = this.inReplyToId
        }
        if (this.sensitive) {
            data["sensitive"] = this.sensitive
        }
        if (this.spoilerText) {
            data["spoiler_text"] = this.spoilerText
        }
        // check if valid visibility
        if (MastodonVisibilities.includes(this.visibility.toLocaleLowerCase())) {
            data["visibility"] = this.visibility.toLocaleLowerCase()
        } else {
            isValid = false
            isInvalidReasons.push("visibility is set to invalid value: " + this.visibility)
        }
        if (this.language) {
            data["language"] = this.language
        }
        if (this.scheduledAt) {
            data["scheduled_at"] = this.scheduledAt
        }
        if (isValid) {
            return data
        } else {
            alert("invalid post:" + "\n" + isInvalidReasons.join("\n"))
            return undefined
        }
    }
    getText() {
        return this.statusText
    }
    // implemented same way for html preview and general easier preview
    toString() {
        return this.statusText
    }
    toHtmlString() {
        let str = []
        if (this.scheduledAt) {
            let dateTimeSplits = this.scheduledAt.split("T")
            let date = dateTimeSplits[0]
            let timeSplits = dateTimeSplits[1].split(":")
            let time = timeSplits[0] + ":" + timeSplits[1]
            let scheduledAtStr = date + " at " + time + " (UTC)"
            str.push("<span class='info'>" + "<em>scheduled at: </em>" + scheduledAtStr + "</span></br> ");
        }
        if (this.isPoll) {
            str.push("<em>poll:</em><br>")
        }
        str.push("<br>")
        str.push("<strong>" + htmlSafe(this.statusText) + "</strong><br>")
        str.push("<br>")
        str.push("<em>visibility: </em>" + this.visibility + "<br>")
        // disable character counts str.push("<span class='info'>" + this.statusText.length + "/" + DraftodonSettings.characterLimit + " characters</span></br> ");
        return str.join("\n")
    }
}

class MastodonPollStatusUpdate {
    constructor({
        statusText,
        pollOptions,
        expiresIn = 86400,
        allowMultiole = false,
        hideTotals = false,
        inReplyToId = null,
        sensitive = null,
        spoilerText = null,
        visibility = "public",
        language = null,
        scheduledAt = null
    }) {
        this.statusText = statusText
        this.pollOptions = pollOptions
        this.expiresIn = expiresIn
        this.allowMultiole = allowMultiole
        this.hideTotals = hideTotals
        this.inReplyToId = inReplyToId
        this.sensitive = sensitive
        this.spoilerText = spoilerText
        this.visibility = visibility
        this.language = language
        this.scheduledAt = scheduledAt
    }
    getObject() {
        let data = {}
        let pollOptionsObject = {}
        let isValid = true;
        let isInvalidReasons = []
        if (this.statusText.length == 0) {
            isValid = false
            isInvalidReasons.push("no status update text (question) was provided")
        } else {
            data["status"] = this.statusText
        }
        if (this.pollOptions.length == 0) {
            isValid = false
            isInvalidReasons.push("no options for poll provided")
        } else {
            pollOptionsObject["options"] = this.pollOptions
        }

        pollOptionsObject["expires_in"] = this.expiresIn
        pollOptionsObject["multiple"] = this.allowMultiole
        pollOptionsObject["hide_totals"] = this.hideTotals
        if (this.inReplyToId) {
            data["in_reply_to_id"] = this.inReplyToId
        }
        if (this.sensitive) {
            data["sensitive"] = this.sensitive
        }
        if (this.spoilerText) {
            data["spoiler_text"] = this.spoilerText
        }
        // check if valid visibility
        if (MastodonVisibilities.includes(this.visibility.toLocaleLowerCase())) {
            data["visibility"] = this.visibility.toLocaleLowerCase()
        } else {
            isValid = false
            isInvalidReasons.push("visibility is set to invalid value: " + this.visibility)
        }
        if (this.language) {
            data["language"] = this.language
        }
        if (this.scheduledAt) {
            data["scheduled_at"] = this.scheduledAt
        }
        if (isValid) {
            data["poll"] = pollOptionsObject
            return data
        } else {
            alert("invalid post:" + "\n" + isInvalidReasons.join("\n"))
            return undefined
        }
    }
    getText() {
        return this.statusText
    }
    // implemented same way for html preview and general easier preview
    toString() {
        return this.statusText
    }
    toHtmlString() {
        let str = []
        if (this.scheduledAt) {
            let dateTimeSplits = this.scheduledAt.split("T")
            let date = dateTimeSplits[0]
            let timeSplits = dateTimeSplits[1].split(":")
            let time = timeSplits[0] + ":" + timeSplits[1]
            let scheduledAtStr = date + " at " + time + " (UTC)"
            str.push("<span class='info'>" + "<em>scheduled at: </em>" + scheduledAtStr + "</span></br> ");
        }
        if (this.isPoll) {
            str.push("<em>poll:</em><br>")
        }
        str.push("<br>")
        str.push("<strong>" + htmlSafe(this.statusText) + "</strong><br>")
        str.push("<br>")
        str.push("<em>visibility: </em>" + this.visibility + "<br>")
        // disable character counts str.push("<span class='info'>" + this.statusText.length + "/" + DraftodonSettings.characterLimit + " characters</span></br> ");
        return str.join("\n")
    }
}

class MastodonStatusUpdateResult {
    constructor({
        id,
        scheduledAt = null
    }) {
        this.id = id
        this.scheduledAt = scheduledAt
    }
    getId() {
        return this.id
    }
    getScheduledAt() {
        return this.scheduledAt
    }
}

class MastodonScheduledStatus {
    constructor({
        statusText,
        isPoll = false,
        pollOptions = [],
        visibility = "public",
        scheduledAt,
        id,
        spoilerText = null,
        sensitive = null
    }) {
        this.statusText = statusText
        this.isPoll = isPoll
        this.pollOptions = pollOptions
        this.visibility = visibility
        this.scheduledAt = scheduledAt
        this.id = id
        this.spoilerText = spoilerText
        this.sensitive = sensitive
    }
    toString() {
        return (this.isPoll ? "Poll: " : "") + "\"" + this.statusText + "\"\nscheduled at: " + this.scheduledAt + "\n" + (this.visibility != "public" ? "visibility: " + this.visibility : "")
    }
    toHtmlString() {
        let str = []
        let dateTimeSplits = this.scheduledAt.split("T")
        let date = dateTimeSplits[0]
        let timeSplits = dateTimeSplits[1].split(":")
        let time = timeSplits[0] + ":" + timeSplits[1]
        let scheduledAtStr = date + " at " + time + " (UTC)"
        str.push("<span class='info'>" + "<em>scheduled at: </em>" + scheduledAtStr + "</span></br> ");
        str.push("<br>")
        if (this.isPoll) {
            str.push("<em>poll:</em><br>")
        }
        if(this.sensitive){
            let strToAdd = "<em>sensitive:"
            if(this.spoilerText){
                strToAdd = strToAdd + " \"" + this.spoilerText + "\"</em><br>"
            } else {
                strToAdd = strToAdd + "</em><br>"
            }
            str.push(strToAdd)
        }
        str.push("<strong>" + htmlSafe(this.statusText) + "</strong><br>")
        if (this.isPoll) {
            this.pollOptions.forEach(function(option){
                str.push(htmlSafe("- " + option + "\n"))
            })
        }
        str.push("<br>")
        str.push("<em>visibility: </em>" + this.visibility + "<br>")
        return str.join("\n")
    }

}


// functions for Drafts Actions of the Action Group

// adds [[character_limit_indicator]] into draft where it exceeds the configured limits
function Draftodon_showCharacterLimit() {
    Draftodon_readSettingsIntoVars();

    //remove indicator, in case it was called before
    draft.content = removeCharacterLimitIndicatorFromText(draft.content)
    draft.update()

    //info on length
    contentLength = draft.content.length;

    if (contentLength > DraftodonSettings.characterLimit) {
        editor.setTextInRange(DraftodonSettings.characterLimit, 0, DraftodonSettings.characterLimitIndicator);
        excess = contentLength - DraftodonSettings.characterLimit;
        app.displayErrorMessage("post exceeds limits with " + excess.toString() + " characters");
    } else {
        remaining = DraftodonSettings.characterLimit - contentLength;
        app.displayInfoMessage(remaining.toString() + " characters remaining");
    }
    draft.update();
}

// post draft as single post
function Draftodon_publishDraftAsSinglePost() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    let text = removeCharacterLimitIndicatorFromText(draft.content)
    if (isPostInLimits(text, 0)) {
        if (isPostEmpty(text)) {
            // empty draft
            app.displayWarningMessage("Draft is empty")
            context.fail("Draft is empty")
            return undefined
        }

        // valid post, publish it
        let statusUpdate = new MastodonTextStatusUpdate({
            statusText: text
        })
        let result = mastodon_postStatusUpdate(statusUpdate)
        if (result) {
            addConfiguredTagsToDraft();
            app.displaySuccessMessage("published draft")
        } else {
            context.fail()
            app.displayErrorMessage("publishing draft failed, check Action Log for details")
        }
        return result
    } else {
        // post is not in limits, show character limit and abort publish
        if(!isPostEmpty(text)){
            Draftodon_showCharacterLimit()
            context.fail()
        } else {
            app.displayWarningMessage("Draft is empty")
            context.fail("Draft is empty")
        }
        return undefined
    }
}

// schedule draft as single post
function Draftodon_scheduleDraftAsSinglePost() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    let text = removeCharacterLimitIndicatorFromText(draft.content)
    if (isPostInLimits(text, 0)) {
        if (isPostEmpty(text)) {
            // empty draft
            app.displayWarningMessage("Draft is empty")
            context.fail("Draft is empty")
            return undefined
        }
        // valid post, ask for schedule time
        let scheduleDate = getDateForScheduledPostFromPrompt()
        if (scheduleDate) {
            // user selected schedule date
            let statusUpdate = new MastodonTextStatusUpdate({
                statusText: text,
                scheduledAt: scheduleDate.toISOString()
            })
            let result = mastodon_postStatusUpdate(statusUpdate)
            if (result) {
                let scheduledAtStr = getScheduledAtAsReadableString(result.scheduledAt)
                app.displaySuccessMessage("scheduled post for " + scheduledAtStr)
                addConfiguredTagsToDraft();
            } else {
                app.displayErrorMessage("scheduling post failed, check action log for details")
                context.fail()
            }
            return result
        } else {
            // no date was selected and info was displayed, abort
            context.cancel()
            return undefined
        }
    } else {
        // post is not in limits, show character limit and abort publish
        if(!isPostEmpty(text)){
            Draftodon_showCharacterLimit()
        } else {
            app.displayWarningMessage("Draft is empty")
            context.fail("Draft is empty")
        }
        context.fail()
        return undefined
    }
}

function Draftodon_publishThreadFromDraft() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    draft.content = removeCharacterLimitIndicatorFromText(draft.content)
    draft.update()
    let text = draft.content
    if (isPostEmpty(text)) {
        // empty draft
        app.displayWarningMessage("Draft is empty")
        context.fail("Draft is empty")
        return undefined
    }
    return mastodon_publishThread({
        "text": text
    })
}

// attention this does currently not work with the API (at least to my knowledge) - the id of the scheduled post can't be used for the "reply to id"
function Draftodon_scheduleThreadFromDraft() {
    context.fail()
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    draft.content = removeCharacterLimitIndicatorFromText(draft.content)
    draft.update()
    let text = draft.content
    if (isPostEmpty(text)) {
        // empty draft
        app.displayWarningMessage("Draft is empty")
        context.fail("Draft is empty")
        return undefined
    }
    let scheduleDate = getDateForScheduledPostFromPrompt()
    if(!scheduleDate){
        return undefined
    }
    return mastodon_publishThread({
        "text": text,
        "scheduleTime": scheduleDate
    })
}

function Draftodon_publishDraftAsPoll() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    draft.content = removeCharacterLimitIndicatorFromText(draft.content)
    draft.update()
    let text = draft.content
    
    if (isPostEmpty(text)) {
        // empty draft
        app.displayWarningMessage("Draft is empty")
        context.fail("Draft is empty")
        return undefined
    }
    // check if more than one line exists
    let lines = text.split("\n")
    if(!isPostInLimits(text,0)){
        Draftodon_showCharacterLimit()
        return undefined
    }

    if (lines.length == 1) {
        app.displayWarningMessage("Draft has only a single line")
        context.fail("Draft has only a single line")
        return undefined
    }

    let pollQuestion = lines.shift().trim() // first line in poll content
    // loop over remaining lines to create poll options
    let pollOptions = []
    for (let ln of lines) {
        if (ln.length > 0) {
            pollOptions.push(ln.trim())
        }
    }
    // settings for poll
    // - expires in
    // - allow multiple options
    // - hide totals
    const expiresInOptionValues = {
        "1 hour": 3600,
        "6 hours": 21600,
        "24 hours": 86400
    }
    const expiresInOptions = ["1 hour", "6 hours", "24 hours"]
    const defaultExpiresIn = "24 hours"
    let pPollSettings = new Prompt()
    pPollSettings.title = "select settings for poll"
    pPollSettings.message = "\"" + pollQuestion + "\"\n" + pollOptions.map((option) => {
        return "- " + option
    }).join("\n")
    pPollSettings.addSegmentedControl("expiresIn", "expires in", expiresInOptions, defaultExpiresIn)
    pPollSettings.addSwitch("allowMultiple", "allow multiple", false)
    pPollSettings.addSwitch("hideTotals", "hide total answers", false)
    pPollSettings.addButton("publish poll", undefined, true, false)
    if (pPollSettings.show()) {
        // it was not cancelled
        // retrieve settings
        let allowMultiole = pPollSettings.fieldValues["allowMultiple"]
        let hideTotals = pPollSettings.fieldValues["hideTotals"]
        let expiresIn = expiresInOptionValues[pPollSettings.fieldValues["expiresIn"]]
        let statusUpdate = new MastodonPollStatusUpdate({
            statusText: pollQuestion,
            pollOptions: pollOptions,
            allowMultiole: allowMultiole,
            hideTotals: hideTotals,
            expiresIn: expiresIn
        })
        let result = mastodon_postStatusUpdate(statusUpdate)
        if (result) {
            addConfiguredTagsToDraft();
            app.displaySuccessMessage("published poll")
        } else {
            context.fail()
            app.displayErrorMessage("failed publishing poll, check action log for details")
        }
        return result
    } else {
        // user cancelled
        app.displayInfoMessage("Cancelled publishing poll")
        return undefined
    }
}

function Draftodon_scheduleDraftAsPoll() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    draft.content = removeCharacterLimitIndicatorFromText(draft.content)
    draft.update()
    let text = draft.content
    
    if (isPostEmpty(text)) {
        // empty draft
        app.displayWarningMessage("Draft is empty")
        context.fail("Draft is empty")
        return undefined
    }
    
    // check if more than one line exists
    let lines = text.split("\n")
    if(!isPostInLimits(text,0)){
        Draftodon_showCharacterLimit()
        return undefined
    }
    
    let scheduledDate = getDateForScheduledPostFromPrompt()
    if(!scheduledDate){
        // no date selected
        context.cancel()
        return undefined
    }

    if (lines.length == 1) {
        app.displayWarningMessage("Draft has only a single line")
        context.fail("Draft has only a single line")
        return undefined
    }

    let pollQuestion = lines.shift().trim() // first line in poll content
    // loop over remaining lines to create poll options
    let pollOptions = []
    for (let ln of lines) {
        if (ln.length > 0) {
            pollOptions.push(ln.trim())
        }
    }
    // settings for poll
    // - expires in
    // - allow multiple options
    // - hide totals
    const expiresInOptionValues = {
        "1 hour": 3600,
        "6 hours": 21600,
        "24 hours": 86400
    }
    const expiresInOptions = ["1 hour", "6 hours", "24 hours"]
    const defaultExpiresIn = "24 hours"
    let pPollSettings = new Prompt()
    pPollSettings.title = "select settings for poll"
    pPollSettings.message = "\"" + pollQuestion + "\"\n" + pollOptions.map((option) => {
        return "- " + option
    }).join("\n")
    pPollSettings.addSegmentedControl("expiresIn", "expires in", expiresInOptions, defaultExpiresIn)
    pPollSettings.addSwitch("allowMultiple", "allow multiple", false)
    pPollSettings.addSwitch("hideTotals", "hide total answers", false)
    pPollSettings.addButton("publish poll", undefined, true, false)
    if (pPollSettings.show()) {
        // it was not cancelled
        // retrieve settings
        let allowMultiole = pPollSettings.fieldValues["allowMultiple"]
        let hideTotals = pPollSettings.fieldValues["hideTotals"]
        let expiresIn = expiresInOptionValues[pPollSettings.fieldValues["expiresIn"]]
        let statusUpdate = new MastodonPollStatusUpdate({
            statusText: pollQuestion,
            pollOptions: pollOptions,
            allowMultiole: allowMultiole,
            hideTotals: hideTotals,
            expiresIn: expiresIn,
            scheduledAt: scheduledDate.toISOString()
        })
        let result = mastodon_postStatusUpdate(statusUpdate)
        if (result) {
            addConfiguredTagsToDraft();
            let scheduledAtStr = getScheduledAtAsReadableString(result.scheduledAt)
            app.displaySuccessMessage("scheduled poll for " + scheduledAtStr)
        } else {
            context.fail()
            app.displayErrorMessage("failed scheduling poll, check action log for details")
        }
        return result
    } else {
        // user cancelled
        app.displayInfoMessage("Cancelled publishing poll")
        return undefined
    }
}

// post draft with content warning
function Draftodon_publishDraftWithContentWarning() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    let text = removeCharacterLimitIndicatorFromText(draft.content)
    if (isPostInLimits(text, 0)) {
        if (isPostEmpty(text)) {
            // empty draft
            app.displayWarningMessage("Draft is empty")
            context.fail("Draft is empty")
            return undefined
        }
        // first line is spoiler text, rest of draft is status text; at least two lines are necessary
        let lines = text.split("\n")
        let spoilerText = ""
        let statusUpdateText = ""
        if(lines.length == 1){
            //Draft only contains one line\nAt least two lines are required. Ask user for the spoiler text
            let pSpoiler = new Prompt()
            pSpoiler.title = "set spoiler text"
            pSpoiler.message = "the draft only contains one line.\nYou have to add a \"spoiler text\" to post a draft with content warning"
            pSpoiler.addTextField("spoilerText","spoiler text","",{wantsFocus:true})
            pSpoiler.addButton("post")
            
            if(pSpoiler.show()){
                // user selected a text as content warning
                spoilerText = pSpoiler.fieldValues["spoilerText"]
                statusUpdateText = lines.join("\n")
                alert(JSON.stringify(pSpoiler.fieldValues))
            } else {
                context.cancel()
                app.displayInfoMessage("cancelled scheduling post")
                return undefined   
            }
        } else {
            spoilerText = lines.shift()
            statusUpdateText = lines.join("\n")
        }
        if(spoilerText == ""){
            context.cancel()
            app.displayInfoMessage("empty spoiler text is not possible")
            return undefined   
        }
        // valid post, publish it
        let statusUpdate = new MastodonTextStatusUpdate({
            statusText: statusUpdateText,
            sensitive: true,
            spoilerText: spoilerText
        })
        let result = mastodon_postStatusUpdate(statusUpdate)
        if (result) {
            addConfiguredTagsToDraft();
            app.displaySuccessMessage("published draft with content warning")
        } else {
            context.fail()
            app.displayErrorMessage("publishing draft failed, check Action Log for details")
        }
        return result
    } else {
        // post is not in limits, show character limit and abort publish
        if(!isPostEmpty(text)){
            Draftodon_showCharacterLimit()
            context.fail()
        } else {
            app.displayWarningMessage("Draft is empty")
            context.fail("Draft is empty")
        }
        return undefined
    }
}

// schedule draft with content warning
function Draftodon_scheduleDraftWithContentWarning() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    let text = removeCharacterLimitIndicatorFromText(draft.content)
    if (isPostInLimits(text, 0)) {
        if (isPostEmpty(text)) {
            // empty draft
            app.displayWarningMessage("Draft is empty")
            context.fail("Draft is empty")
            return undefined
        }
        let scheduledDate = getDateForScheduledPostFromPrompt()
        if(!scheduledDate){
            // no date selected
            context.cancel()
            return undefined
        }
        // first line is spoiler text, rest of draft is status text; at least two lines are necessary
        let lines = text.split("\n")
        let spoilerText = ""
        let statusUpdateText = ""
        if(lines.length == 1){
            //Draft only contains one line\nAt least two lines are required. Ask user for the spoiler text
            let pSpoiler = new Prompt()
            pSpoiler.title = "set spoiler text"
            pSpoiler.message = "the draft only contains one line.\nYou have to add a \"spoiler text\" to post a draft with content warning"
            pSpoiler.addTextField("spoilerText","spoiler text","",{wantsFocus:true})
            pSpoiler.addButton("post")
            if(pSpoiler.show()){
                // user selected a text as content warning
                spoilerText = pSpoiler.fieldValues["spoilerText"]
                statusUpdateText = lines.join("\n")
            } else {
                context.cancel()
                app.displayInfoMessage("cancelled scheduling post")
                return undefined   
            }
        } else {
            spoilerText = lines.shift()
            statusUpdateText = lines.join("\n")
        }
        if(spoilerText == ""){
            context.cancel()
            app.displayInfoMessage("empty spoiler text is not possible")
            return undefined   
        }
        
        // valid post, publish it
        let statusUpdate = new MastodonTextStatusUpdate({
            statusText: statusUpdateText,
            sensitive: true,
            spoilerText: spoilerText,
            scheduledAt: scheduledDate.toISOString()
        })
        let result = mastodon_postStatusUpdate(statusUpdate)
        if (result) {
            addConfiguredTagsToDraft();
            app.displaySuccessMessage("scheduled draft with content warning")
        } else {
            context.fail()
            app.displayErrorMessage("scheduling draft failed, check Action Log for details")
        }
        return result
    } else {
        // post is not in limits, show character limit and abort publish
        if(!isPostEmpty(text)){
            Draftodon_showCharacterLimit()
            context.fail()
        } else {
            app.displayWarningMessage("Draft is empty")
            context.fail("Draft is empty")
        }
        return undefined
    }
}

// show scheduled posts
function Draftodon_showScheduledPosts() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    let scheduledStatuses = mastodon_getScheduledStatuses()
    // sort them by scheduled date, earliest first
    scheduledStatuses.sort((a, b) => (a.scheduledAt > b.scheduledAt))

    let html = createHtml({
        "type": "multiple_posts",
        "posts": scheduledStatuses,
        "publishIntended": false
    })
    previewHtml(html)
}

// edit scheduled statuses
function Draftodon_editScheduledPosts() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    let scheduledStatuses = mastodon_getScheduledStatuses()
    // sort them by scheduled date, earliest first
    scheduledStatuses.sort((a, b) => (a.scheduledAt > b.scheduledAt))

    if (scheduledStatuses.length == 0) {
        // no scheduled posts
        app.displayInfoMessage("no scheduled posts")
        context.cancel()
        return undefined
    }
    let pSelectStatus = new Prompt()
    pSelectStatus.title = "select status to update"
    for (scheduledStatus of scheduledStatuses) {
        let buttonStr = ""
        if (scheduledStatus.isPoll) {
            buttonStr = buttonStr + "poll: "
        }
        buttonStr = buttonStr + scheduledStatus.statusText
        const maxLength = 40
        if (buttonStr.length > maxLength) {
            buttonStr = buttonStr.substring(0, maxLength) + "..."
        }
        pSelectStatus.addButton(buttonStr, {
            "text": buttonStr,
            "id": scheduledStatus.id
        })
    }
    if (pSelectStatus.show()) {
        let selectedStatus = pSelectStatus.buttonPressed
        let pSelectEdit = new Prompt()
        pSelectEdit.title = "select option to edit status"
        pSelectEdit.message = "\"" + selectedStatus.text + "\""
        pSelectEdit.addButton("reschedule")
        pSelectEdit.addButton("delete", "delete", false, true)
        if (pSelectEdit.show()) {
            let selectedOption = pSelectEdit.buttonPressed
            switch (selectedOption) {
                case "reschedule":
                    let rescheduleResult = mastodon_rescheduleScheduledPost(selectedStatus.id)
                    if (rescheduleResult) {
                        app.displaySuccessMessage("Rescheduled status \"" + selectedStatus.text + "\"")
                    } else {
                        context.fail()
                        app.displayErrorMessage("Rescheduled status \"" + selectedStatus.text + "\" failed")
                    }
                    break;
                case "delete":
                    let deleteResult = mastodon_deleteScheduledPost(selectedStatus.id);
                    if (deleteResult) {
                        app.displaySuccessMessage("Deleted scheduled status \"" + selectedStatus.text + "\"")
                    } else {
                        context.fail()
                        app.displayErrorMessage("Delete scheduled status \"" + selectedStatus.text + "\" failed")
                    }
                    break;
            }
            return
        } else {
            // cancelled
            app.displayInfoMessage("no option selected")
            return
        }
    } else {
        app.displayInfoMessage("no status selected")
        return
    }
}

// helper functions (no drafts actions)

// post publishing

function mastodon_postStatusUpdate(statusUpdate) {
    let mastodon = Mastodon.create(DraftodonSettings.mastodonInstance, DraftodonSettings.mastodonHandle)

    let postRequest = {
        "path": MastodonEndpoints.STATUS_UPDATE,
        "method": "POST",
        "data": statusUpdate.getObject()
    }

    let response = mastodon.request(postRequest)

    if (!response.success) {
        console.log("Post Failed: " + response.statusCode + ", " + response.error)
        alert("Post Failed: " + response.statusCode + ", " + response.error)
        context.fail()
        return undefined
    } else {
        console.log("Posted to Mastodon: " + response.responseData["url"])
        let data = response.responseData
        return parseStatusUpdateResponse(data)
    }
}

// retrieve scheduled statuses

function mastodon_getScheduledStatuses() {
    // create Mastodon instance
    let mastodon = Mastodon.create(DraftodonSettings.mastodonInstance, DraftodonSettings.mastodonHandle)

    // get scheduled statuses from API
    let response = mastodon.request({
        "path": MastodonEndpoints.SCHEDULED_STATUSES,
        "method": "GET"
    })

    if (!response.success) {
        console.log("Request Failed: " + response.statusCode + ", " + response.error)
        context.fail()
        return undefined
    } else {
        console.log("Request Succeeded: " + response.responseText)
        let data = response.responseData
        return parseGetScheduledStatusesResponse(data)
        //	console.log(`Posted to Mastodon: ${response.responseData["url"]}`)
    }
}

// publish thread using the publishStatusUpdate function
function mastodon_publishThread({
    text,
    scheduleTime = undefined
}) {
    // abort if scheduledTime is provided - not supported through the API
    if (scheduleTime) {
        app.displayErrorMessage("Scheduling Thread is not possible through the API")
        return false;
    }
    // divide into single posts
    let posts = dividePostsinThread(text)
    // add thread numbering to each post
    let postCtr = 1
    let tmpPosts = []
    let statusUpdates = []
    for (post of posts) {
        let postText = post + " " + createPostCountString(postCtr, posts.length)
        let statusUpdate = new MastodonTextStatusUpdate({
            statusText: postText,
            //inReplyToId: (postCtr > 1 ? "id" : null),
            visibility: (postCtr > 1 ? "unlisted" : "public")
        })
        statusUpdates.push(statusUpdate)
        tmpPosts.push(postText)
        postCtr++
    }
    posts = tmpPosts
    // check if all posts are valid
    let isValidThread = areAllPostsinLimits(posts)
    // html preview will also check if the posts are valid to present the thread
    let html = createHtml({
        type: "multiple_posts",
        posts: statusUpdates,
        publishIntended: true
    })
    // if user selects continue in preview, the function returns true
    let continueSelected = previewHtml(html)
    // only if post is valid and continue was selected, we can publish the thread
    if (isValidThread) {
        // post is valid, check if continue was selected
        if (continueSelected) {
            // publish thread
            let count = 1
            let inReplyToId = ""
            let success = true
            const maxRetries = 5;
            for (post of posts) {
                let result = undefined;
                let retryCount = 0
                // loop for retries to avoid failures due to slow response of server
                while (!result) {
                    // let scheduledTime = new Date(scheduleTime)
                    // scheduleTime.setMilliseconds(scheduleTime.getMilliseconds() + ((count - 1) * 10));
                    let statusUpdate = new MastodonTextStatusUpdate({
                        statusText: post,
                        inReplyToId: (count > 1 ? inReplyToId : null),
                        visibility: (count > 1 ? "unlisted" : "public")
                        //                        scheduledAt: (scheduleTime ? scheduledTime.toISOString() : null)
                    })
                    result = mastodon_postStatusUpdate(statusUpdate)
                    retryCount++
                    if (retryCount >= maxRetries) {
                        success = false;
                        break;
                    }
                    sleep(400)
                }
                inReplyToId = result.getId()
                count++
            }
            if (success) {
                app.displaySuccessMessage("published thread")
                addConfiguredTagsToDraft()
                return true;

            } else {
                app.displayErrorMessage("publishing thread failed, check action log for details")
                context.fail()
                return false;
            }

        } else {
            // abort publish thread, user cancelled
            app.displayInfoMessage("publish thread cancelled")
            return undefined
        }
    } else {
        // abort publish thread, user cancelled
        app.displayWarningMessage("thread is invalid reduce length")
        return false
    }
}

// cancel / delete scheduled post
function mastodon_deleteScheduledPost(id) {
    let mastodon = Mastodon.create(DraftodonSettings.mastodonInstance, DraftodonSettings.mastodonHandle)
    let postRequest = {
        "path": MastodonEndpoints.SCHEDULED_STATUSES + "/" + id,
        "method": "DELETE",
    }
    let response = mastodon.request(postRequest)
    if (!response.success) {
        console.log("Delete Failed: " + response.statusCode + ", " + response.error)
        alert("Delete Failed: " + response.statusCode + ", " + response.error)
        context.fail()
        return false
    } else {
        console.log("Deleted scheduled Post with id: " + id)
        return true
    }
}

// reschedule scheduled post
function mastodon_rescheduleScheduledPost(id) {
    let date = getDateForScheduledPostFromPrompt()
    if(!date){
        return false
    }
    let mastodon = Mastodon.create(DraftodonSettings.mastodonInstance, DraftodonSettings.mastodonHandle)
    let postRequest = {
        "path": MastodonEndpoints.SCHEDULED_STATUSES + "/" + id,
        "method": "PUT",
        "data": {
            "scheduled_at": date.toISOString()
        }
    }
    let response = mastodon.request(postRequest)
    if (!response.success) {
        console.log("Reschedule Failed: " + response.statusCode + ", " + response.error)
        app.displayErrorMessage("rescheduling failed, check Action Log for details")
        context.fail()
        return false
    } else {
        console.log("Rescheduled post with id: " + id)
        app.displaySuccessMessage("rescheduled post")
        return true
    }

}

// parse results

// status update post
function parseStatusUpdateResponse(data) {
    let obj;
    if (data["scheduled_at"]) {
        // it was a scheduled post
        obj = new MastodonStatusUpdateResult({
            id: data["id"],
            scheduledAt: data["scheduled_at"]
        })
    } else {
        obj = new MastodonStatusUpdateResult({
            id: data["id"]
        })
    }
    return obj
}

//retrieve scheduled statuses; returns array of MastodonScheduledStatus
function parseGetScheduledStatusesResponse(data) {
    let result = []
    //app.setClipboard(JSON.stringify(scheduledPostsResponse))
    let count = 0
    for (post of data) {
        let obj = {}
        let params = post["params"]

        obj["statusText"] = params["text"]
        if (params["poll"]) {
            obj["isPoll"] = true
            obj["pollOptions"] = params["poll"]["options"]
        }
        obj["visibility"] = params["visibility"]
        obj["scheduledAt"] = post["scheduled_at"]
        obj["id"] = post["id"]
        if(params["spoiler_text"]){
            obj["spoilerText"] = params["spoiler_text"]
        }
        if(params["sensitive"]){
            obj["sensitive"] = params["sensitive"]
        }
        
        
        //alert(JSON.stringify(obj))
        result.push(new MastodonScheduledStatus(obj))
        count++
    }
    return result
}

// check if post is in given limits
function isPostInLimits(post, offset) {
    const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g;
    // links count as 23 characters
    let unlinked = ""
    // function shall work if only text or the object is used as input
    if (typeof (post) == "object") {
        unlinked = post.getText().replace(urlRegex, "00000000000000000000000");
    } else {
        unlinked = post.replace(urlRegex, "00000000000000000000000");
    }
    return unlinked.length <= (DraftodonSettings.characterLimit - offset) && unlinked.length > 0;
}

function isPostEmpty(post) {
    return post.length == 0 ? true : false
}

function areAllPostsinLimits(posts) {
    if (posts.length == 0) {
        return false;
    }
    for (var post of posts) {
        if (!isPostInLimits(post, 0)) {
            return false;
        }
    }
    return true;
}

// remove character limit indicator from draft 
function removeCharacterLimitIndicatorFromText(text) {
    return text.replaceAll(DraftodonSettings.characterLimitIndicator, "")
}

// get iso date string from selected date in prompt to schedule a post
function getDateForScheduledPostFromPrompt() {
    let p = new Prompt()
    p.title = "select date & time"
    let startDate = new Date()
    startDate.setMinutes(startDate.getMinutes() + 5)
    let startDatePicker = startDate
    startDatePicker.setMinutes(startDatePicker.getMinutes() + 10)
    p.addDatePicker("scheduledDateTime", "", startDate, {
        "minimumDate": startDatePicker,
        "minuteInterval": 15,
        "mode": "dateAndTime"
    })
    p.addButton("schedule")
    p.show()
    if (p.buttonPressed == "schedule") {
        let scheduledDate = p.fieldValues["scheduledDateTime"]
        return scheduledDate
    } else {
        app.displayInfoMessage("no schedule time selected")
        return undefined;
    }

}




// html representations

function previewHtml(html) {
    let preview = new HTMLPreview()
    if (preview.show(html)) {
        // continue was pressed
        return true
    } else {
        // cancel was pressed
        return false
    }
}

function createHtml({
    type,
    posts,
    publishIntended
}) {
    let html = ["<html><head>"];
    html.push("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
    html.push("<style>");
    html.push("body { background: #666; color: #444; font-family: system-ui, -apple-system; margin: 1em auto; max-width:360px; }");
    html.push("p {padding: 1em; background-color: #eee; }");
    html.push("p.error{ background-color: #FFCDDD; color: maroon; font-weight: bold; padding: 1.5em; }\n");
    html.push("p.invalid{ color: maroon; }\n");
    html.push("p.reply { border-left: 5px solid #bbb; }");
    html.push("p.preview{ font-style:italic; background-color: #444; color: #aaa; font-size: .9em; }\n");
    html.push("span.note{ background-color: maroon; color: white; font-weight: bold; border-radius:3px; padding: .25em; font-size: .8em; }\n");
    html.push("span.info{ background-color: grey; color: white; font-weight: bold; border-radius:3px; padding: .25em; font-size: .8em; }\n");
    html.push("</style>");
    html.push("</head><body>");

    if (publishIntended) {
        if (!areAllPostsinLimits(posts)) {
            html.push("<p class='error'>");
            html.push("This draft cannot be posted as a thread. Be sure to divide the draft by using a single line with \"" + DraftodonSettings.threadDivider + "\" of " + DraftodonSettings.characterLimit + " characters or shorter.");
            html.push("</p>");
        } else {
            html.push("<p class='preview'>");
            html.push("Preview posts as they will be posted below. Tap continue to publish them on Mastodon, cancel to go back without posting");
            html.push("</p>");
        }
    }
    if (posts.length > 0) {
        switch (type) {
            case "single_post":
                html.push(getPostAsHtml({
                    "post": posts[0]
                }))
                break;
            case "multiple_posts":
                let ctr = 1;
                for (post of posts) {
                    let obj = {}
                    obj["post"] = post
                    obj["count"] = ctr
                    obj["postAmount"] = posts.length
                    if (publishIntended) {
                        obj["isValid"] = isPostInLimits(post, 0)
                    }
                    if (ctr > 1) {
                        obj["useReply"] = false
                    }
                    html.push(getPostAsHtml(obj))
                    ctr++
                }
                default:
                    break;
        }
    } else {
        if (publishIntended) {
            html.push("<p>Nothing to Publish</p>");
        } else {
            html.push("<p>No Posts</p>")
        }

    }
    html.push("</body></html>");
    return html.join("\n")
}

function htmlSafe(s) {
    return s.replace(/</g, "&lt;").replace(/\n/g, "<br>\n");
}

function postsCountString(current, total) {
    return ` (${current}/${total})`;
}

function getPostAsHtml({
    post,
    isValid = true,
    useReply = false,
    count = 1,
    postAmount = 1
}) {
    let html = [];
    let postStr = post.toString()
    if (isValid) {
        if (useReply) {
            html.push("<p class='valid" + (count > 1 ? " reply" : "") + "'>");
        } else {
            html.push("<p class='valid'>");
        }
        html.push(post.toHtmlString());
        if (!count == 1 && postAmount == 1) {
            html.push(postsCountString(count, postAmount));
        }
        html.push("</p>");
    } else {
        html.push("<p class='invalid" + (count > 1 ? " reply" : "") + "'>");
        html.push("<span class='note'>" + postStr.length + " characters</span> ");
        html.push(post.toHtmlString());
        if (!count == 1 && postAmount == 1) {
            html.push(postsCountString(count, postAmount));
        }
        html.push("</p>");
    }
    return html.join("\n")
}


// settings
// read Mastodon Settings into variables
function Draftodon_readSettingsIntoVars() {
    DraftodonSettings.mastodonInstance = draft.processTemplate("[[mastodon_instance]]")
    // check if instance was set, otherwise return false
    if(DraftodonSettings.mastodonInstance == "UNDEFINED"){
        alert("ERROR:\nyou didn't configure your Mastodon instance in the Draftodon Settings Action.\nThis is necessary to authenticate Drafts and use Draftodon")
        app.displayErrorMessage("Mastodon Instance not configured")
        context.fail()
        return false
    }
    DraftodonSettings.mastodonHandle = draft.processTemplate("[[mastodon_handle]]")
    if(DraftodonSettings.mastodonHandle == "UNDEFINED"){
        alert("ERROR:\nyou didn't configure your Mastodon Handle in the Draftodon Settings Action.\nThis is necessary to authenticate Drafts and use Draftodon")
        app.displayErrorMessage("Mastodon Handle not configured")
        context.fail()
        return false
    }
    DraftodonSettings.characterLimit = parseInt(draft.processTemplate("[[character_limit]]"))
    DraftodonSettings.characterLimitIndicator = draft.processTemplate("[[character_limit_indicator]]")
    DraftodonSettings.threadDivider = draft.processTemplate("[[thread_divider]]")
    let tagsToAddOnSuccess = []
    let tagsList = draft.processTemplate("[[tags-to-add-on-successfull-publish]]").split(",")
    for (tag of tagsList) {
        tagsToAddOnSuccess.push(tag.trim())
    }
    DraftodonSettings.tagsToAddOnSuccess = tagsToAddOnSuccess
    return true;
}

// Utility functions
function dividePostsinThread(input) {
    let paragraphs = input.split("\n" + DraftodonSettings.threadDivider + "\n");
    paragraphs = paragraphs.map((paragraph) => {
        return paragraph.trim()
    })
    return paragraphs;
}

// sleep function
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// creates the string which is appended on each thread post to indicate the position in the thread
function createPostCountString(curPosition, length) {
    return "[" + curPosition + "/" + length + "]"
}

function addConfiguredTagsToDraft() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    if (DraftodonSettings.tagsToAddOnSuccess.length > 0) {
        for (tag of DraftodonSettings.tagsToAddOnSuccess) {
            draft.addTag(tag)
        }
        draft.update()
    }
}

function getScheduledAtAsReadableString(scheduledDate) {
    let dateTimeSplits = scheduledDate.split("T")
    let date = dateTimeSplits[0]
    let timeSplits = dateTimeSplits[1].split(":")
    let time = timeSplits[0] + ":" + timeSplits[1]
    return date + " at " + time + " (UTC)"
}


function Draftodon_followFlohGro() {
    if(!Draftodon_readSettingsIntoVars()){
        return undefined
    }
    const userIdFlohGro = "108132565867141294"
    ///api/v1/accounts/mastodon.social/108132565867141294/follow
    let mastodon = Mastodon.create(DraftodonSettings.mastodonInstance, DraftodonSettings.mastodonHandle)
    // use hard path, since it didn't work otherwise
    let postRequest = {
        "path": "/api/v2/search?q=@flohgro@mastodon.social&resolve=true&limit=5",
        "method": "GET",
    }

    let response = mastodon.request(postRequest)

    let foundAccount = false
    if (!response.success) {
        console.log("Resolve User failed: " + response.statusCode + ", " + response.error)
        // set found account var to false
        foundAccount = false

    } else {
        // successfully retrieved account(s), check if correct account is included
        let data = response.responseData
        //check if accounts param is available
        if (data["accounts"]) {
            for (account of data["accounts"]) {
                let acct = account["acct"]
                let id = account["id"]
                let username = account["username"]
                // check if correct account was found
                if (acct == "FlohGro@mastodon.social" && username == "FlohGro") {
                    let followRequest = {
                        "path": "/api/v1/accounts/" + id + "/follow",
                        "method": "POST",
                        //"data": {}
                    }
                    let followResponse = mastodon.request(followRequest)
                    if (followResponse.success) {
                        foundAccount = true
                        app.displaySuccessMessage("youre now following @FlohGro - thank you 😍")
                        break;
                    } else {
                        foundAccount = false;
                    }
                }
            }

        } else {
            // set found account var to false
            foundAccount = false
        }
    }
    if (!foundAccount) {
        // open the url since account was not found
        app.openURL("https://mastodon.social/@FlohGro", true)
    }
}

function Draftodon_supportDevelopment(){
    let pSupport = new Prompt()
    pSupport.title = "select method"
    pSupport.message = "thank you for your interest in supporting my work ☺️\nI really appreciate that.\nSelect your prefered service to support me below"
    pSupport.addButton("buymeacoffee")
    pSupport.addButton("ko-fi")
    pSupport.addButton("patreon")
    if(pSupport.show()){
        switch(pSupport.buttonPressed){
            case "buymeacoffee": app.openURL("https://buymeacoffee.com/flohgro",true); break;
            case "ko-fi": app.openURL("https://ko-fi.com/flohgro",true); break;
            case "patreon": app.openURL("https://patreon.com/flohgro",true); break;
        }
    } else {
        app.displayInfoMessage("cancelled supporting development 😪")
    }
    
}
