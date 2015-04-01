// Written by Michael Stepner, on 29 March 2015.
//
/*** Unlicence (abridged):
This is free and unencumbered software released into the public domain.
It is provided "AS IS", without warranty of any kind.

For the full legal text of the Unlicense, see <http://unlicense.org>
*/
// ==UserScript==
// @name        Fastmail - Control folder badges
// @namespace   http://michaelstepner.com
// @license     http://unlicense.org
// @description Turn badges on or off for specific folders, or show total # of messages.
// @include     https://www.fastmail.com/mail/*
// @version     0.0.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant       GM_addStyle
// ==/UserScript==

function showAllOnBadge (jNode) {
    // Always display badge with total number of messages (read and unread).
    var nMessagesStr = jNode.prop('title');
    var nMessages = nMessagesStr.replace("This folder is empty.","0").replace(/conversation[s]*/, "")
    jNode.children(".v-FolderSource-badge").text(nMessages);
    jNode.children(".v-FolderSource-badge").removeClass("u-hidden")
}
function alwaysShowBadge (jNode) {
    // Always display badge with number of unread messages, even if there are 0.
    jNode.children(".v-FolderSource-badge").removeClass("u-hidden")
}
function neverShowBadge (jNode) {
    // Never display badge.
    jNode.children(".v-FolderSource-badge").addClass("u-hidden")
}

waitForKeyElements ("[href='/mail/Folder_Name/?u=0xx00000']", showAllOnBadge);
