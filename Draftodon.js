// Draftodon created by FlohGro
// a file fo helpful functions to integrate Drafts and Mastodon
// - https://mastodon.social/@FlohGro
// - https://flohgro.com
//
// feedback and requests welcome ✌️
//
// do you like this Shorcut?
// 🚀 consider supporting my work: 
// - https://www.buymeacoffee.com/flohgro
// - https://flohgro.com/donate/


const MastodonVisibilities = ["public", "unlisted", "private", "direct"]
const MastodonEndpoints = {
    "STATUS_UPDATE": "/api/v1/statuses"
}
let DraftodonSettings = {
    "mastodonInstance":"",
    "mastodonHandle":"",
    "characterLimit":0,
    "characterLimitIndicator":"",
    "threadDivider":""
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
}


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
    Draftodon_readSettingsIntoVars()
    let text = removeCharacterLimitIndicatorFromText(draft.content)
    if (isPostInLimits(text, 0)) {
        // valid post, publish it
        let statusUpdate = new MastodonTextStatusUpdate({statusText: text})
        return mastodon_postStatusUpdate(statusUpdate)
    } else {
        // post is not in limits, show character limit and abort publish
        Draftodon_showCharacterLimit()
        return undefined
    }
}


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
        context.fail()
        return undefined
    } else {
        console.log("Posted to Mastodon: " + response.responseData["url"])
        let data = response.responseData
        return parseStatusUpdateResponse(data)
    }
}

class MastodonStatusUpdateResult{
    constructor({
        id,
        scheduledAt = null
    }){
        this.id = id
        this.scheduledAt = scheduledAt
    }
    getId(){
        return this.id
    }
}

function parseStatusUpdateResponse(data) {
    let obj;
    if(data["scheduled_at"]){
        // it was a scheduled post
        obj = new MastodonStatusUpdateResult({id: data["id"], scheduledAt: data["scheduled_at"]})
    } else {
        obj = new MastodonStatusUpdateResult({id: data["id"]})
    }
    return obj
}




// helper functions (no drafts actions)

function isPostInLimits(post, offset) {
    return post.length < (DraftodonSettings.characterLimit - offset) ? true : false;
}

function removeCharacterLimitIndicatorFromText(text) {
    return text.replaceAll(DraftodonSettings.characterLimitIndicator, "")
}

// Settings
// read Mastodon Settings into variables
function Draftodon_readSettingsIntoVars() {
    DraftodonSettings.mastodonInstance = draft.processTemplate("[[mastodon_instance]]")
    DraftodonSettings.mastodonHandle = draft.processTemplate("[[mastodon_handle]]")
    DraftodonSettings.characterLimit = parseInt(draft.processTemplate("[[character_limit]]"))
    DraftodonSettings.characterLimitIndicator = draft.processTemplate("[[character_limit_indicator]]")
    DraftodonSettings.threadDivider = draft.processTemplate("[[thread_divider]]")
}

