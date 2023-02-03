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
        visibility = "public",
        scheduledAt,
        id
    }) {
        this.statusText = statusText
        this.isPoll = isPoll
        this.visibility = visibility
        this.scheduledAt = scheduledAt
        this.id = id
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
        if (this.isPoll) {
            str.push("<em>poll:</em><br>")
        }
        str.push("<br>")
        str.push("<strong>" + htmlSafe(this.statusText) + "</strong><br>")
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
    Draftodon_readSettingsIntoVars()
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
        }
        return result
    } else {
        // post is not in limits, show character limit and abort publish
        Draftodon_showCharacterLimit()
        return undefined
    }
}

// schedule draft as single post
function Draftodon_scheduleDraftAsSinglePost() {
    Draftodon_readSettingsIntoVars()
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
                let dateTimeSplits = result.getScheduledAt().split("T")
                let date = dateTimeSplits[0]
                let timeSplits = dateTimeSplits[1].split(":")
                let time = timeSplits[0] + ":" + timeSplits[1]
                let scheduledAtStr = date + " at " + time + " (UTC)"
                app.displaySuccessMessage("scheduled post for " + scheduledAtStr)
                addConfiguredTagsToDraft();
            } else {
                app.displayErrorMessage("scheduling post failed, check action log for details")
            }
            return result
        } else {
            // no date was selected and info was displayed, abort
            return undefined
        }
    } else {
        // post is not in limits, show character limit and abort publish
        Draftodon_showCharacterLimit()
        return undefined
    }
}

function Draftodon_publishThreadFromDraft() {
    Draftodon_readSettingsIntoVars()
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

function Draftodon_scheduleThreadFromDraft() {
    Draftodon_readSettingsIntoVars()
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
    return mastodon_publishThread({
        "text": text,
        "scheduleTime": scheduleDate
    })
}

// show scheduled posts
function Draftodon_showScheduledPosts() {
    Draftodon_readSettingsIntoVars()
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
    Draftodon_readSettingsIntoVars()
    let scheduledStatuses = mastodon_getScheduledStatuses()
    // sort them by scheduled date, earliest first
    scheduledStatuses.sort((a, b) => (a.scheduledAt > b.scheduledAt))
    let pSelectStatus = new Prompt()
    pSelectStatus.title = "select scheduled status to update"
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
                    if(rescheduleResult){

                    } else {

                    }
                    break;
                case "delete":
                    let deleteResult = mastodon_deleteScheduledPost(selectedStatus.id);
                    if(deleteResult){
                        app.displaySuccessMessage("Deleted scheduled status \"" + buttonStr + "\"")
                    } else {
                        app.displayErrorMessage("Delete scheduled status \"" + buttonStr + "\" failed")
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
        return true
    } else {
        console.log("Deleted scheduled Post with id: " + id)
        return false
    }
}

// reschedule scheduled post
function mastodon_rescheduleScheduledPost(id) {
    let date = getDateForScheduledPostFromPrompt()
    let mastodon = Mastodon.create(DraftodonSettings.mastodonInstance, DraftodonSettings.mastodonHandle)
    let postRequest = {
        "path": MastodonEndpoints.SCHEDULED_STATUSES + "/" + id,
        "method": "PUT",
        "data": {"scheduled_at": date.toISOString()}
    }
    let response = mastodon.request(postRequest)
    if (!response.success) {
        console.log("Reschedule Failed: " + response.statusCode + ", " + response.error)
        alert("Reschedule Failed: " + response.statusCode + ", " + response.error)
        context.fail()
        return true
    } else {
        console.log("Rescheduled post with id: " + id)
        return false
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
        }
        obj["visibility"] = params["visibility"]
        obj["scheduledAt"] = post["scheduled_at"]
        obj["id"] = post["id"]
        //alert(JSON.stringify(obj) + "\n\n" + obj.id)
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
    DraftodonSettings.mastodonHandle = draft.processTemplate("[[mastodon_handle]]")
    DraftodonSettings.characterLimit = parseInt(draft.processTemplate("[[character_limit]]"))
    DraftodonSettings.characterLimitIndicator = draft.processTemplate("[[character_limit_indicator]]")
    DraftodonSettings.threadDivider = draft.processTemplate("[[thread_divider]]")
    let tagsToAddOnSuccess = []
    let tagsList = draft.processTemplate("[[tags-to-add-on-successfull-publish]]").split(",")
    for (tag of tagsList) {
        tagsToAddOnSuccess.push(tag.trim())
    }
    DraftodonSettings.tagsToAddOnSuccess = tagsToAddOnSuccess
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
    if (DraftodonSettings.tagsToAddOnSuccess.length > 0) {
        for (tag of DraftodonSettings.tagsToAddOnSuccess) {
            draft.addTag(tag)
        }
        draft.update()
    }
}