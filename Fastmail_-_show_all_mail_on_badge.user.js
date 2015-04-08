// Written by Michael Stepner, on 7 April 2015.
//
/* The MIT License (MIT):
Copyright (c) 2015 Michael Stepner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
// ==UserScript==
// @name        Fastmail - Control folder badges
// @namespace   http://michaelstepner.com
// @license     http://opensource.org/licenses/MIT
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

