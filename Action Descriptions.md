# Draftodon Action Descriptions

## Draftodon Settings

This Action includes the settings for the Actions in this ActionGroup.

It defines several settings as Template Tags that are used by several of the Actions.

The following settings have to be defined by each user if the default values should not be used:

**Mastodon instance & handle**
- `mastodon_instance`: your mastodon instance e.g. `mastodon.social`; Default: `UNDEFINED`
- `mastodon_handle`: your mastodon user handle on the defined instance e.g. `@FlohGro` for `@FlohGro@social.lol`; Default: `UNDEFINED`
- `character_limit`: the character limit for one post / toot on your instance; Default: `500`

> note: if you want to use Draftodon with multiple accounts, please read the instructions by running the `Draftodon Instructions` action.

**compose settings**
- `character_limit_indicator`: some actions allow you to check the character limit in a Draft. therefore they insert an emoji that will show you the position where you exceed the limit, you can redifine the emoji if you want; Default: 🛑
- `thread_divider`: the characters that divide posts in a Thread you want to post; the defined characters have to be in a single line between two posts of the thread; Default: `===`
- `tags-to-add-on-successfull-publish`: if you want to add tags to the drafts that successfully were published / scheduled to mastodon, you can add them here - every action that publishes something to mastodon will add the tags to the draft if they where published successfully. The tags have to be defined as comma separated string; Default: `` (no tags)

> After Success Setting: *Do Nothing*

## Draftodon Setup / Update

This Action is used to setup or update the Draftodon.js file in the iCloud directory of Draft at the path /Library/Scripts/. It downloads the latest version from the GitHub repository of Draftodon at https://github.com/FlohGro-dev/Draftodon.

> After Success Setting: *Do Nothing*

## Draftodon

This Action loads all relevant functions that Draftodon provides. Every Draftodon Action includes this Action.
If you want to make you're own Action based on Draftodon functions simply include this Action at the beginning.
 
> After Success Setting: *Do Nothing*

## insert Mastodon handle

This Action allows you to insert often used Mastodon handles for users that you often mention in your posts. Due to the decentralized architecture it can be difficult to remember all the instances for users. This Action helps out a bit. You can configure the users you often tag (more on that below) and when you run the action it will present a prompt to show you all names you configured. When you pick one it will insert the corresponding user handle.

To configure the Action to your needs you need to edit the "Define Template Tag" Action step in the action. Each line of the Define Template Tag step must consist of two things: [display name],[mastodon user handle] and might look like this (this is the default configuration):
```
FlohGro,@FlohGro@mastodon.social
Drafts App,@drafts@indieapps.space
Mastodon,@Mastodon@mastodon.social
```
The Name before the comma is the name that will be displayed in the prompt, the user handle afterwards will be inserted if you select one of the names. If you like that I would appreciate if you use it to post a shoutout to me :)

To add or remove users and handles, simply add a new line or remove a line that you don't want to use (anymore). You don't need to sort them in the template, since the action will sort the options in the prompt alphabetically.

> After Success Setting: *Do Nothing*

## insert hastag

This Action allows you to insert often used hashtags into your posts. You can configure the hastags you often use in the "Define Template Tag" step of the action. just add each hashtag as new line into the template. When you run the action it will present a prompt to show you all configured hashtags. When you pick one it will insert it into the draft.

Default configuration
```
Mastodon
Draftodon
Drafts
```

To add or remove hashtags, simply add a new line or remove a line that you don't want to use (anymore). You don't need to sort them in the template, since the action will sort the options in the prompt alphabetically. You don't need to add the "#" to the lines, the action will do that automatically if its not used in the line.

> After Success Setting: *Do Nothing*

## show character limit

This Action is helpful if you compose a longer post and you are not sure if it will fit into one post. Simply run that action and it will tell you if you're still within the configured limits (in the Draftodon Settings Action) or you already exceeded the allowed character amount. If you exceed the character amount, the action will insert the configured character (Default: 🛑) to the position in the draft where it exceeds the limit.

> After Success Setting: *Do Nothing*

## post draft

This Action will do excatly what its name implies. it will post the contents of the draft to mastodon. Therefore it will use the configured mastodon instance in "Draftodon Settings".

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

If you run this the first time, you will need to authenticate Drafts for your account (only need to do this once).

> After Success Setting: *Archive*

## schedule draft

This Action will schedule the current draft as prompt to mastodon. It will present a prompt where you can set the date and time when it should be published, when you select a date the draft will be sent to mastodon and schedule it for publishing.
If you want to chack your scheduled posts you can use the "show scheduled posts" Action.

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

If you run this the first time, you will need to authenticate Drafts for your account (only need to do this once).

> After Success Setting: *Archive*

## post draft as poll

This Action creates a poll on mastodon from the current draft. The first line in the draft will be treated as the poll "question", every following line will be considered as option for the poll.

An Example Draft might look like this:

```
This is my question?
option 1
option 2
option 3
```

The Action will present a prompt to show you the created poll and you can make adjustments to the default settings like changing the expire date, allowing multiple answers or hiding the totals in the poll.

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

If you run this the first time, you will need to authenticate Drafts for your account (only need to do this once).

> After Success Setting: *Archive*

## schedule draft as poll

This Action creates a poll on mastodon from the current draft and schedules it for the date you select in the first prompt. The first line in the draft will be treated as the poll "question", every following line will be considered as option for the poll.

An Example Draft might look like this:

```
This is my question?
option 1
option 2
option 3
```

The Action will present a prompt to show you the created poll and you can make adjustments to the default settings like changing the expire date, allowing multiple answers or hiding the totals in the poll.

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

If you run this the first time, you will need to authenticate Drafts for your account (only need to do this once).

> After Success Setting: *Archive*

## post draft with content warning

This Action posts the the draft with a content warning.
The first line of the Draft will be considered as the "spoiler text" (the text that will be displayed in mastodon) and everything else will be the hidden text.
Example Draft:
```
this is a spoiler
the text with the actual spoiler
which will be hidden behind the content warning
```

If the draft only consist of one line, the Action will consider the text as the text that shall be hidden and will ask for the spoiler text in a prompt.

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

If you run this the first time, you will need to authenticate Drafts for your account (only need to do this once).

> After Success Setting: *Archive*

## schedule draft with content warning

This Action schedules the the draft with a content warning. You can select the schedule date in the first prompt that appears. 
The first line of the Draft will be considered as the "spoiler text" (the text that will be displayed in mastodon) and everything else will be the hidden text.
Example Draft:
```
this is a spoiler
the text with the actual spoiler
which will be hidden behind the content warning
```

If the draft only consist of one line, the Action will consider the text as the text that shall be hidden and will ask for the spoiler text in a prompt.

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

If you run this the first time, you will need to authenticate Drafts for your account (only need to do this once).

> After Success Setting: *Archive*

## reply to status

This Action lets you reply to a status. To reply to a status just copy the link of it and paste it into the first line of a Draft. Then type your reply below the url. The Action will validate that it is a correct status url and post the reply.

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

If you run this the first time, you will need to authenticate Drafts for your account (only need to do this once).

> After Success Setting: *Archive*

## quote status

This Action lets you quote a status. Since Mastodon does not (yet) support quoting posts this is a small workaround. To quote a status copy the link of it and paste it into the first line of a new Draft. Then type your quoting text (your comment on that post or whatever) below the url. The Action will validate that it is a correct status url and append the following text to your quote before publishing it: `"💬 @[account] [url]`

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

If you run this the first time, you will need to authenticate Drafts for your account (only need to do this once).

> After Success Setting: *Archive*

## post status from prompt

This Action will display a prompt with a text field where you can put in the text for a status you want to post. The text you type into this pormpt will be published to your account. 
The Action creates a new Draft which contains the published post.

> After Success Setting: *Do Nothing*

## post draft with hashtags

This Action is similar to the `post draft` action. It extends it by automatically appending preconfigured hashtags to content of the current Draft.
It is especially useful if you often post statuses with the same hashtags.

To configure the hashtags that the action should append you need to edit it. The first "Define Template Tag" `hashtags-to-append` step defines the used hashtags. You can configure one or more hashtags but each of them must be in a separate line. E.g. if you want to post the draft with the hashtags #Draftodon #Drafts #iOS you need to configure the Template Tag as follows:

```text
Draftodon
Drafts
iOS
```

> note: you don't need to add the `#` character, this will be done automatically.

You can of course duplicate the action and configure different hashtags in each copy - make sure to rename the actions to don't get confused.

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

> After Success Setting: *Archive*

## schedule draft with hashtags

This Action is similar to the `schedule draft` action. It extends it by automatically appending preconfigured hashtags to content of the current Draft.
It is especially useful if you often schedule statuses with the same hashtags.

To configure the hashtags that the action should append you need to edit it. The first "Define Template Tag" `hashtags-to-append` step defines the used hashtags. You can configure one or more hashtags but each of them must be in a separate line. E.g. if you want to post the draft with the hashtags #Draftodon #Drafts #iOS you need to configure the Template Tag as follows:

```text
Draftodon
Drafts
iOS
```

> note: you don't need to add the `#` character, this will be done automatically.

You can of course duplicate the action and configure different hashtags in each copy - make sure to rename the actions to don't get confused.

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

> After Success Setting: *Archive*

## post draft as thread

This Action allows you to post a Thread to mastodon. 
To compose a Thread, write everything you want to post into one single draft. You can separate posts with the configured characters in the "Draftodon Settings" Action, by Default with === (three equal signs) on single lines. Example:
```
This is the first post in the Thread
it might have multiple lines
==
This is the second post in the Thread
==
This is the third post in the Thread
```

The Action will:
- separate the draft by the configured characters into separate posts
- append a "position indicator string" like "[3/5]" to each post to show the current position and the length of the Thread in each post
- check if each post is valid (character limit is not exceeded)
- show you an html preview of the thread to check how it will look on mastodon (if any post in the Thread is not valid, it will be displayed in the html preview)
- publish the Thread on Mastodon if it is valid AND you select "continue" in the html preview
	- the first post of the thread will be a public post, every subsequent post will be an unlisted reply - therefore it won't clutter up the public timelines of your followers, if they open the first post, they will see all subsequent replies.

The Action contains the "Template Tag" `post-visibility`, which allows to specify the visibility of the published post and defaults to `public`. You can find information about supported visibilities by opening the Draftodon Instructions.

If you run this the first time, you will need to authenticate Drafts for your account (only need to do this once).

> After Success Setting: *Archive*

## show scheduled posts

This Action retrieves all scheduled posts from your mastodon account and displays them in an html preview so you can check your upcoming posts.
The displayed posts will be sorted by the scheduled data, so the first post in the preview will be the next one that is published

> After Success Setting: *Do Nothing*

## edit scheduled posts

This Action retrieves all scheduled posts from your mastodon account and shows a prompt with their status update texts. If you select one of them you can choose to reshedule the selected post or delete it.
This Action works best together with the show scheduled posts action - first run this to check your scheduled posts and then edit the posts you want to change.

> After Success Setting: *Do Nothing*

## import bookmark

This Action allows you to import bookmarked statuses from your account. It will retrieve them from mastodon and present them in a HTML preview. Each status in the preview will contain a small import button. When you tap / click that button the status will be imported as new draft.

The Action allows you to hide already imported statuses in the HTML preview. This works based on the title of the created drafts. Since I think that this will often be edited I disabled it by default. If you don't plan to edit the titles of the imported statuses you can enable it by changing the "Template Tag" `hide-already-imported` from `false` to `true`. This might slow down the creation of the HTML preview so play around with it and decide what you prefer

If you want to automatically assign tags to the imported drafts please use the "After Success" setting of the action.

> After Success Setting: *Do Nothing*

## import favorite

This Action allows you to import favorited statuses from your account. It will retrieve them from mastodon and present them in a HTML preview. Each status in the preview will contain a small import button. When you tap / click that button the status will be imported as new draft.

The Action allows you to hide already imported statuses in the HTML preview. This works based on the title of the created drafts. Since I think that this will often be edited I disabled it by default. If you don't plan to edit the titles of the imported statuses you can enable it by changing the "Template Tag" `hide-already-imported` from `false` to `true`. This might slow down the creation of the HTML preview so play around with it and decide what you prefer

If you want to automatically assign tags to the imported drafts please use the "After Success" setting of the action.

> After Success Setting: *Do Nothing*

## import from home timeline

This Action allows you to import statuses from your accounts home timeline. It will retrieve the 20 newest statuses from mastodon and present them in a HTML preview. Each status in the preview will contain a small import button. When you tap / click that button the status will be imported as new draft.

The Action allows you to hide already imported statuses in the HTML preview. This works based on the title of the created drafts. Since I think that this will often be edited I disabled it by default. If you don't plan to edit the titles of the imported statuses you can enable it by changing the "Template Tag" `hide-already-imported` from `false` to `true`. This might slow down the creation of the HTML preview so play around with it and decide what you prefer

If you want to automatically assign tags to the imported drafts please use the "After Success" setting of the action.

> After Success Setting: *Do Nothing*

## post with Ivory

This Action will send the current draft to the compose window of the [Ivory Mastodon client](https://tapbots.social/@ivory). You can e.g. add images in the compose window and publish it from there

> After Success Setting: *Archive*

## post with Mona

This Action will send the current draft to the compose window of the [Mona Mastodon client](https://mastodon.social/@MonaApp). You can e.g. add images in the compose window and publish it from there

> After Success Setting: *Archive*

## follow @FlohGro

If you run this Action you will follow @FlohGro@mastodon.social on Mastodon with your configured Account. 
I appreciate you following me and my work in the Social Network. 
You can of course delete this Action if you're already following me, after running it or if you don't want to follow me.

> After Success Setting: *Do Nothing*

## support development

I developed all of this in my free time. 
If these Actions (or others I created) are useful for you and you want to give something back, then you can run this action, pick the platform you prefer and support me there or become a member. 
Thank you very much in advance!

> After Success Setting: *Do Nothing*