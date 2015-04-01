// Written by Michael Stepner, on 31 March 2015.
//
/* Unlicence (abridged):
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
// @version     0.0.2
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant       GM_addStyle
// ==/UserScript==



var foldersToShowAll = "[href='/mail/Folder_Name/?u=0xx00000'],[href='/mail/Folder_Name2/?u=0xx00000']";


/////// Functions that control badges

function showAllOnBadge (jNode) {
    // Always display badge with total number of messages (read and unread).
    var nMessagesStr = jNode.prop('title');
    var nMessages = nMessagesStr.replace("This folder is empty.","0").replace(/conversation[s]*/, "");
    jNode.children(".v-FolderSource-badge").text(nMessages);
    jNode.children(".v-FolderSource-badge").removeClass("u-hidden");
}
function alwaysShowBadge (jNode) {
    // Always display badge with number of unread messages, even if there are 0.
    jNode.children(".v-FolderSource-badge").removeClass("u-hidden");
}
function neverShowBadge (jNode) {
    // Never display badge.
    jNode.children(".v-FolderSource-badge").addClass("u-hidden");
}

/////// waitForKeyElements

//waitForKeyElements (foldersToShowAll, showAllOnBadge,false);

/////// Mutation Observer
// Note: there is certainly a narrower observer that could be set

var targetNodes         = $("*");
var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver;
var myObserver          = new MutationObserver (mutationHandler);
var obsConfig           = { childList: false, characterData: false, attributes: true, subtree: true, attributeFilter:['class'] };

//--- Add a target node to the observer. Can only add one node at a time.
targetNodes.each ( function () {
    myObserver.observe (this, obsConfig);
} );

function mutationHandler (mutationRecords) {
    //console.info ("mutationHandler:");
    //window.alert("hello");

    mutationRecords.forEach ( function (mutation) {
        //console.log (mutation.type);
        //console.log (mutation.target);
        if(mutation.target.classList.contains("v-FolderSource")) {
            console.log (mutation.target);
            $(foldersToShowAll).each(function() {
                showAllOnBadge ($(this));
            });
        }
    } );
}

// Note: could have used SetInterval instead of Mutation Observer to loop and perform fix every n seconds.
