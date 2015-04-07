// Written by Michael Stepner, on 7 April 2015.
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
// @version     0.0.4
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant    	GM_registerMenuCommand
// ==/UserScript==


///// Retrieve configuration

// GM_setValue ("foldersShowAllOnBadge",  "Folder_Name;Folder_Name2");
// GM_setValue ("foldersAlwaysShowBadge", "");
// GM_setValue ("foldersNeverShowBadge", "");

var foldersShowAllOnBadge  = GM_getValue ("foldersShowAllOnBadge",  "");
var foldersAlwaysShowBadge = GM_getValue ("foldersAlwaysShowBadge", "");
var foldersNeverShowBadge  = GM_getValue ("foldersNeverShowBadge", "");


///// Add menu commands for configuration
GM_registerMenuCommand ("Folders to show TOTAL number of messages on badge", changeShowAll);
GM_registerMenuCommand ("Folders to ALWAYS show badge", changeAlwaysShow);
GM_registerMenuCommand ("Folders to NEVER show badge", changeNeverShow);

function promptAndChangeStoredValue (userPrompt, GMvarname) {
	currentVal = GM_getValue (GMvarname, "");
    newVal = prompt (userPrompt, currentVal);
    if (newVal!=null) {
    	GM_setValue (GMvarname, newVal);
    }
}
function changeShowAll () {
    promptAndChangeStoredValue (
    	'List folders to show TOTAL number of messages on badge (separated by semicolons):',
    	"foldersShowAllOnBadge"
    );
}
function changeAlwaysShow () {
    promptAndChangeStoredValue (
    	'List folders to ALWAYS show badge (separated by semicolons):',
    	"foldersAlwaysShowBadge"
    );
}
function changeNeverShow () {
    promptAndChangeStoredValue (
    	'List folders to NEVER show badge (separated by semicolons):',
    	"foldersNeverShowBadge"
    );
}


///////////////////////////////

///// Define selectors
var selectorsShowAllOnBadge = "[href^='/mail/" + foldersShowAllOnBadge.split(";").join("/?u='],[href^='/mail/") + "/?u=']";
var selectorsAlwaysShowBadge = "[href^='/mail/" + foldersAlwaysShowBadge.split(";").join("/?u='],[href^='/mail/") + "/?u=']";
var selectorsNeverShowBadge = "[href^='/mail/" + foldersNeverShowBadge.split(";").join("/?u='],[href^='/mail/") + "/?u=']";

///// Functions that control badges
function showAllOnBadge (jNode) {
    // Always display badge with total number of messages (read and unread), even if there are 0.
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


///// Mutation Observer
var targetNodes         = $("*"); // Note: there is certainly a narrower observer that could be set
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
			$(selectorsShowAllOnBadge).each(function() {
				showAllOnBadge ($(this));
			});
            $(selectorsAlwaysShowBadge).each(function() {
                alwaysShowBadge ($(this));
            });
            $(selectorsNeverShowBadge).each(function() {
                neverShowBadge ($(this));
            });
		}
    } );
}

