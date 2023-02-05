# Draftodon Action Group Instructions

**created by [@FlohGro](https://mobile.twitter.com/FlohGro)**

- **Website:** [flohgro.com](https://flohgro.com)  
- **Drafts Forums:** [@FlohGro](https://forums.getdrafts.com/u/flohgro/summary)
- **Mastodon:** [@FlohGro](https://mastodon.social/@FlohGro)

> Welcome to Draftodon - an Action Group for Draft to integrate with Mastodon.
> **IMPORTANT: Before running any other Action, you have to run the "Draftodon Setup/Update" Action which downloads the latest version of Draftodon from this repository.**

Draftodon contains several Actions to integrate Drafts with Mastodon.

The Actions are divided into the following sections:

- general
- compose
- single posts
- thread posts
- utils
- 3rd party
- support development

**Before running any Action in this Action Group, make sure to Setup the `Draftodon.js` file in your directory by running the `Draftodon Setup/Update` Action.**

## Using Draftodon

Since Draftodon contains a lot of Actions and you may not need every single of them, I suggest you reorder the Actions to your needs or delete the ones you don't want to use. You can always recover them by installing the Action Group again from the directory.

Please **never** rename or **delete** the `Draftodon` and `Draftodon Settings` Action at the top of the Action Group (If you do so, most other Action will not work anymore).

You can use Draftodon from the Action List on the side or in the Action Bar over the Keyboard. All unnecessary Actions are disabled in the Action Bar.

Draftodon posts directly to your Mastodon Profile if you run the Actions it will not ask you for further confirmation (if the Draft contains a valid post). If you want another confirmation you can enable the "confirm before running" toggle in the settings of each Action. Otherwise Draftodon works as frictionless as possible.

## Action Descriptions

Every Draftodon Action contains a short description about its purpose / what it does. Due to the big amount of Actions you can also read through all descriptions in the [Action Descriptions](https://github.com/FlohGro-dev/Draftodon/blob/main/Action%20Descriptions.md) file.

## Customizing Actions

All Draftodon Actions work out of the box with no needed configuration from you. Especially the more complex and powerful actions allow you to configure the behavior of them in the action steps. Read through the corresponding [Action Description](https://github.com/FlohGro-dev/Draftodon/blob/main/Action%20Descriptions.md) to find instructions what and how you can configure the Action to your need.

## Support Development

Draftodon is completely free to use for you. However if this Action Group is useful for you and supports your workflows you can give something back to support development.
I enjoy a good coffee ☕️ (weather at home or in an actual coffee shop) and love pizza 🍕.
You can choose the amount you want to donate on those platforms.

<a href="https://www.buymeacoffee.com/flohgro" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 220px !important;" ></a>

<a href="https://www.patreon.com/flohgro" target="_blank"><img src="https://user-images.githubusercontent.com/13785667/162812708-55b96cdc-8c32-4433-a340-6dd4c1f7326d.jpg" alt="Become A patreon" style="height: 110px !important;width: 220px !important;" ></a>

## Feature Requests and Issue Reporting

If you encounter any issues or have additional feature requests you can reach out to me in different ways:

- report / request issues in the GitHub repository [here](https://github.com/FlohGro-dev/Draftodon/issues)
- take part in the conversation in the Drafts forums [here](https://forums.getdrafts.com/t/Draftodon-a-drafts-action-group-for-todoist/12674)
- contact me on other platforms of your choice [here](https://flohgro.com/contactme)

## Created Files

Draftodon will create three new files in your iCloud Drive folder at the path `.../Drafts/Library/Scripts`:

- `DraftodonDataStore.json`: Draftodon Todoist Data Store
  - this file stores data from your Todoist account which is used by several actions
  - the data includes:
    - projects (and their metadata)
    - sections (and their metadata)
    - labels (and their metadata)
  - none of this data leaves your iCloud Account, it is synced in the Drafts directory - it's just used to not always request the data from Todoists API which slows down the process of e.g. creating tasks with settings a lot.
- `DraftodonSettings.json`: Draftodon Action Group Settings
  - this file stores the settings you can modify with the [Draftodon Settings Action](https://github.com/FlohGro-dev/Draftodon/blob/main/Action%20Descriptions.md#Draftodon%20Settings)
- `Draftodon.js`: Draftodon Functions
  - this file contains the functions all the Draftodon Actions use under the hood. This enables the update process without the need to reinstall the complete Action Group.

I don't recommend to delete these files unless you have issues using Draftodon. If you delete the `Draftodon.js` no Action in the Draftodon Action Group will work anymore until you reinstall the file. The Settings and Data Store file will be recreated automatically.

## Changelog

To stay up to date on new updates you can follow me on [Twitter](https://twitter.com/FlohGro) or take part in the converstaion in the [Drafts forums post](https://forums.getdrafts.com/t/Draftodon-a-drafts-action-group-for-todoist/12674)
You can find a changelog of updates to Action Group in the [Changelog](https://github.com/FlohGro-dev/Draftodon#changelog) section of the README in this repository.
