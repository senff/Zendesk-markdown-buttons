## WHAT DOES THIS JAVASCRIPT DO

- Adds markdown buttons at the top of the editor field/box in Zendesk

## IMPORTANT NOTES
Due to the way Zendesk communicates with the server and sends/receives any updates in the ticket editor textbox, and the fact that this Tampermonkey script is pure front-end, please note the following:

- After using any of the markdown buttons, you will need to manually change anything in the textbox, before sending the ticket, or previewing it. Adding or removing a space anywhere (or any other character) is enough. Without doing that, your changes will not be communicated to the server or saved!
- The standard UNDO functionality (CMD+Z) will **not** work after using any of the buttons. When you type normally, you can still undo your changes, but as soon as you use a markdown button, the undo history will be empty.

## REQUIREMENTS:

### Tampermonkey
- CHROME: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
- FIREFOX: https://addons.mozilla.org/en-GB/firefox/addon/tampermonkey/?src=search

With Tampermonkey, you can add your own custom Javascript code to any site, to modify the functionality.


## INSTALLATION:

1. Install Tampermonkey
2. Create a new script, with name "_Zendesk Markdown Buttons_"
3. Paste the contents of **zendesk-markdown-buttons.user.js** into the code field
4. **SAVE**

## MORE INFORMATION:
https://heinvestigations.wordpress.com/2019/01/14/happy-suite-of-happiness-hacks/
