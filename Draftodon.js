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
    "STATUS_UPDATE": "/api/v1/statuses",
    "SCHEDULED_STATUSES": "/api/v1/scheduled_statuses"
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
    getScheduledAt(){
        return this.scheduledAt
    }
}

class MastodonScheduledStatus {
    constructor({
        statusText,
        isPoll = false,
        visibility = "public",
        scheduledAt
    }) {
        this.statusText = statusText
        this.isPoll = isPoll
        this.visibility = visibility
        this.scheduledAt = scheduledAt
    }
    toString(){
        return (this.isPoll ? "Poll: " : "") + "\"" + this.statusText + "\"\nscheduled at: " + this.scheduledAt + "\n" + (this.visibility != "public" ? "visibility: " + this.visibility : "")
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
                if(isPostEmpty(text)){
            // empty draft
			app.displayWarningMessage("Draft is empty")
                        context.fail("Draft is empty")
            return undefined
        }

        // valid post, publish it
        let statusUpdate = new MastodonTextStatusUpdate({statusText: text})
        return mastodon_postStatusUpdate(statusUpdate)
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
        if(isPostEmpty(text)){
            // empty draft
			app.displayWarningMessage("Draft is empty")
            context.fail("Draft is empty")
            return undefined
        }
        // valid post, ask for schedule time
		let scheduleDate = getDateForScheduleFromPrompt()
        if(scheduleDate){
            // user selected schedule date
	        let statusUpdate = new MastodonTextStatusUpdate({statusText: text, scheduledAt: scheduleDate.toISOString()})
	        let result = mastodon_postStatusUpdate(statusUpdate)
            app.displaySuccessMessage("scheduled post for " + result.getScheduledAt().split("T")[0] + " " + result.getScheduledAt().split("T")[1])
//            alert(parsedResult.getScheduledAt())
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

// show scheduled posts
function Draftodon_showScheduledPosts(){
Draftodon_readSettingsIntoVars()
let scheduledStatuses = mastodon_getScheduledStatuses()
let resultStr = ""
let count = 1
for(let status of scheduledStatuses){
    resultStr = resultStr + "Post (" + count + ")\n"
    resultStr = resultStr + status.toString()
    resultStr = resultStr + "\n"
    count++
}
if(resultStr.length == 0){
    alert("no scheduled statuses")
} else {
 alert("scheduled statuses:\n" + resultStr)   
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
        context.fail()
        return undefined
    } else {
        console.log("Posted to Mastodon: " + response.responseData["url"])
        let data = response.responseData
        return parseStatusUpdateResponse(data)
    }
}

// retrieve scheduled statuses

function mastodon_getScheduledStatuses(){
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
}
else {
	console.log("Request Succeeded: " + response.responseText)
	let data = response.responseData
    return parseGetScheduledStatusesResponse(data)
//	console.log(`Posted to Mastodon: ${response.responseData["url"]}`)
}
}

// parse results

// status update post
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



//retrieve scheduled statuses; returns array of MastodonScheduledStatus
function parseGetScheduledStatusesResponse(data){
 let result = []
//app.setClipboard(JSON.stringify(scheduledPostsResponse))
let count = 0
for(post of data){
    let obj = {}
    let params = post["params"]
    
    obj["statusText"] = params["text"]
    if(params["poll"]){
        obj["isPoll"] = true
    }
    obj["visibility"] = params["visibility"]
    obj["scheduledAt"] = post["scheduled_at"]
	result.push(new MastodonScheduledStatus(obj))
}
	return result
}


// check if post is in given limits
function isPostInLimits(post, offset) {
    return post.length < (DraftodonSettings.characterLimit - offset) ? true : false;
}

function isPostEmpty(post){
    return post.length == 0 ? true : false
}


// remove character limit indicator from draft 
function removeCharacterLimitIndicatorFromText(text) {
    return text.replaceAll(DraftodonSettings.characterLimitIndicator, "")
}

// get iso date string from selected date in prompt to schedule a post
function getDateForScheduleFromPrompt(){
    let p = new Prompt()
    p.title = "select date & time"
    let startDate = new Date()
	startDate.setMinutes(startDate.getMinutes()+5)
	let startDatePicker = startDate
	startDatePicker.setMinutes(startDatePicker.getMinutes()+10)
	p.addDatePicker("scheduledDateTime","",startDate,{"minimumDate":startDatePicker,"minuteInterval":15,"mode":"dateAndTime"})
	p.addButton("schedule")
	p.show()
	if(p.buttonPressed == "schedule"){
		let scheduledDate = p.fieldValues["scheduledDateTime"]
        return scheduledDate
    } else {
        app.displayInfoMessage("no schedule time selected")
        return undefined;
    }
    
}







// settings
// read Mastodon Settings into variables
function Draftodon_readSettingsIntoVars() {
    DraftodonSettings.mastodonInstance = draft.processTemplate("[[mastodon_instance]]")
    DraftodonSettings.mastodonHandle = draft.processTemplate("[[mastodon_handle]]")
    DraftodonSettings.characterLimit = parseInt(draft.processTemplate("[[character_limit]]"))
    DraftodonSettings.characterLimitIndicator = draft.processTemplate("[[character_limit_indicator]]")
    DraftodonSettings.threadDivider = draft.processTemplate("[[thread_divider]]")
}


