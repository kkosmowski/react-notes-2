## v0.3.3

* switch to JSON translation files

## v0.3.2

* improved code quality and readability (note, notes container, note dialog, selection)
* added translations to "created at", "updated at" and "archived at" 

## v0.3.1

* fixed a bug which prevented user from entering Settings (caused by preventing user from entering deleted category)
* fixed a bug where "Show archived" switch wasn't colored according to current theme 

## v0.3.0

* fixed a bug which prevented user from creating new categories
* fixed a bug which deselected previous note instead of selecting clicked one
* modifying multiple notes updates their updatedAt now
* snackbar width limit adjusted
* fixed a bug which left user at route of category, which was reverted right after creation
* user can no longer access route of a deleted category

## v0.2.0

* implemented a masonry layout
* implemented new way of sorting notes: by update/create time (newest first)
* improved styling of notes
* updated version of material-ui (mui)
* fixed a bug where note content could not be longer than 120 characters

## v0.1.4

* updated readme with LIVE link and missing functionalities
* cleaned up formatting of readme
* version in the sidebar is now a link pointing to this changelog

## v0.1.3

* app is now available as PWA

## v0.1.2

* category dialog added (bulk adding note or multiple notes to one or many categories)
* context menu will now open inside the window
* multiselect Select will now show correct "+x" value