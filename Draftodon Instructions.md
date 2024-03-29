# Draftodon Action Group Instructions

**created by [@FlohGro](https://social.lol/@flohgro)**

- **Website:** [flohgro.com](https://flohgro.com)  
- **Drafts Forums:** [@FlohGro](https://forums.getdrafts.com/u/flohgro/summary)
- **Mastodon:** [@FlohGro](https://social.lol/@flohgro)

> Welcome to Draftodon - an Action Group for Draft to integrate with Mastodon.
> **IMPORTANT: Before running any other Action, you have to run the "Draftodon Setup/Update" Action which downloads the latest version of Draftodon from this repository.**

**TL;DR**

- Run Draftodon Setup/Update to download the Draftodon.js file into the iCloud Folder of Drafts
- Configure your 'mastodon_instance' and 'mastodon_handle' in the Draftodon Settings Action by editing the action and change the contents of the Template Tags (DO NOT CHANGE THE NAMES OF THE TEMPLATES).
- Start using Draftodon - “warning” Draftodon posts directly to the configured account once you authenticated it
- Draftodon contains several Actions to integrate Drafts with Mastodon. You can download the Action Group from the [Drafts directory](https://directory.getdrafts.com/g/2GL)

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

Configure your `mastodon_instance` and `mastodon_handle` in the `Draftodon Settings` Action by editing the Action and changing the corresponding "Define Template Tag" steps of the Action.
You can also use Draftodon with multiple accounts. for details checkout the [section](#draftodon-with-multiple-accounts) below.

You can use Draftodon from the Action List on the side or in the Action Bar over the Keyboard. All unnecessary Actions are disabled in the Action Bar.

Draftodon posts directly to your Mastodon Profile if you run the Actions it will not ask you for further confirmation (if the Draft contains a valid post). If you want another confirmation you can enable the "confirm before running" toggle in the settings of each Action. Otherwise Draftodon works as frictionless as possible.

## Action Descriptions

Every Draftodon Action contains a short description about its purpose / what it does. Due to the big amount of Actions you can also read through all descriptions in the [Action Descriptions](https://github.com/FlohGro-dev/Draftodon/blob/main/Action%20Descriptions.md) file.

## Visibility of Posts

Mastodon supports different visibilities for posts. The Actions in Draftodon that publish posts will be default use `public` but you can change that by editing the actions and adapting the template tag "post-visibility" to one of the following valid settings:

- public: Visible to everyone, shown in public timelines.
- unlisted: Visible to public, but not included in public timelines.
- private: Visible to followers only, and to any mentioned users.
- direct: Visible only to mentioned users.

If you want to use Actions with different options for the visibility I recommend to duplicate them and change the visibility setting. Don't forget to rename the Actions for easier identification.

You can find the official documentation of the visibilities in the [Mastodon API documentation](https://docs.joinmastodon.org/entities/Status/#visibility).

## Draftodon with multiple accounts

To use Draftodon with multiple accounts you just need to configure every instance, handle and the corresponding character limit that you might want to use.
I tried to keep this as simple as possible and with no interruption for users with just one accout.

To configure multiple accounts you need to add every instance, handle and character limit to a new line in the `Define Template Tag` steps in the `Draftodon Settings` action.
Lets assume I have two accounts that I want to use with Draftodon. The first account is `@FlohGro@social.lol` and the second one would be `@secoundAccount@mastodon.social`. For this example we assume that social.lol has a character limit of 500 and mastodon.social limits posts to 600 characters.

I have to set the `mastodon_instance` template tag as:

```text
social.lol
mastodon.social
```

The `mastodon_handle` template tag must be configured accordingly to:

```text
@FlohGro
@secondAccount
```

To round it up the `character_limits` template tag should look like this:

```text
500
600
```

Each new account has to be in a separate line and the order is important. As you can see in the example `@FlohGro`, `social.lol` and `500` are in the first line, whereas `@secondAccount`, `mastodon.social` and `600` are in the second line of the corresponding template tags.
If you mix up the order, this will not work.

When you configured multiple accounts in the settings each time you want to publish something to Mastodon, the Action will display a prompt and ask you to pick the account that should publish the post.

## Support Development

Draftodon is completely free to use for you. However if this Action Group is useful for you and supports your workflows you can give something back to support development.
I enjoy a good coffee ☕️ (weather at home or in an actual coffee shop) and love pizza 🍕.
You can choose the amount you want to donate on the platforms linked on [my website](https://flohgro.com/donate/).

<a href="https://www.buymeacoffee.com/flohgro" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 220px !important;" ></a>

<a href="https://www.patreon.com/flohgro" target="_blank"><img src="https://user-images.githubusercontent.com/13785667/162812708-55b96cdc-8c32-4433-a340-6dd4c1f7326d.jpg" alt="Become A patreon" style="height: 110px !important;width: 220px !important;" ></a>

<a href='https://ko-fi.com/flohgro' target='_blank'><img height='35' style='border:0px;height:55px;width:220px' src='https://az743702.vo.msecnd.net/cdn/kofi1.png?v=0' border='0' alt='Buy Me a Coffee at ko-fi.com' />

## Feature Requests and Issue Reporting

If you encounter any issues or have additional feature requests you can reach out to me in different ways:

- report / request issues in the GitHub repository [here](https://github.com/FlohGro-dev/Draftodon/issues)
- take part in the conversation in the Drafts forums [here](https://forums.getdrafts.com/t/draftodon-a-drafts-action-group-for-mastodon/13962)
- reach out on Mastodon by mentioning [@FlohGro](https://social.lol/@flohgro)
- contact me on other platforms of your choice [here](https://flohgro.com/contactme)

## Created Files

Draftodon will create one new file in your iCloud Drive folder at the path `.../Drafts/Library/Scripts`:

- `Draftodon.js`: Draftodon Functions
  - this file contains the functions all the Draftodon Actions use under the hood. This enables the update process without the need to reinstall the complete Action Group.

I don't recommend to delete these files unless you have issues using Draftodon. If you delete the `Draftodon.js` no Action in the Draftodon Action Group will work anymore until you reinstall the file by running the `Draftodon Setup/Update` Action.

## Changelog

To stay up to date on new updates you can follow me on [Mastodon](https://social.lol/@flohgro) or take part in the converstaion in the [Drafts forums post]()
You can find a changelog of updates to Action Group in the [Changelog](https://github.com/FlohGro-dev/Draftodon#changelog) section of the README in this repository.
