/*****************************************************************************
*                                                                            *
*  Copyright 2016 Vimal Niroshan Sengoden                                    *
*                                                                            *
*  www.vimalniroshan.com                                                     *
*  www.linkedin.com/in/vimalniroshan                                         *
*  https://github.com/vimalniroshan                                          *
*                                                                            *
*  Licensed under the Apache License, Version 2.0 (the "License");           *
*  you may not use this file except in compliance with the License.          *
*  You may obtain a copy of the License at                                   *
*                                                                            *
*    http://www.apache.org/licenses/LICENSE-2.0                              *
*                                                                            *
*  Unless required by applicable law or agreed to in writing, software       *
*  distributed under the License is distributed on an "AS IS" BASIS,         *
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
*  See the License for the specific language governing permissions and       *
*  limitations under the License.                                            *
******************************************************************************/

var username = "Vimal";

var notes = {};

var vocieRequestHandlers = [
    new VoiceRequestHandler([
        "Hey how are you",
        "Hey how are you doing today"
    ], function() {
        voiceAssistant.say("Hello " + username + "! I am good how are you?");
    }),
    new VoiceRequestHandler([
        "I'm good",
        "I'm good too",
        "I'm fine",
        "I'm fine too",
        "great"
    ], function() {
        voiceAssistant.say("Good to know that, How can I help you today?");
    }),
    new VoiceRequestHandler([
        "Open google search"
    ], function() {
        openInNewTab("https://www.google.com");
        voiceAssistant.say("Opened in another tab");
    }),
    new VoiceRequestHandler([
        "What is the time",
        "time please",
        "What is the time now"
    ], function() {
        voiceAssistant.say("Its " + getReadableTime());
    }),
    new VoiceRequestHandler([
        "What is the date",
        "What is the date today"
    ], function() {
        voiceAssistant.say("Its " + new Date().toDateString());
    }),
    new VoiceRequestHandler([
        /^(note|take) down my ((phone number)|(address)) (as )?([- a-z0-9]+)$/gi
    ], function(matchGroups) {
        if(matchGroups[2] === "phone number") {
            notes.phonenumber = matchGroups[6];
            voiceAssistant.say("Noted your phone number : " + notes.phonenumber);
        } else if(matchGroups[2] === "address") {
            notes.address = matchGroups[6];
            voiceAssistant.say("Noted you address : " + notes.address);
        }
    }),
    new VoiceRequestHandler([
        /^what is my ((phone number)|(address))$/gi
    ], function(matchGroups) {
        if(matchGroups[1] === "phone number") {
            if(notes.phonenumber) {
                voiceAssistant.say("Your phone number is : " + notes.phonenumber);
            } else {
                voiceAssistant.say("I don't have your phone number");
            }
        } else if(matchGroups[1] === "address") {
            if(notes.address) {
                voiceAssistant.say("Your address is : " + notes.address);
            } else {
                voiceAssistant.say("I don't have your address");
            }
        }
    }),
    new VoiceRequestHandler([
        "Stop"
    ], function() {
        voiceAssistant.say("Stopping voice assistant", true);
    })
];


function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

function getReadableTime() {
    var d = new Date();
    var hour = d.getHours();
    var isAfterNoon = false;
    if(hour >= 12) {
        isAfterNoon = true;
        if(hour >= 13) {
            hour -= 12;
        }
    }

    hour = hour < 10 ? "0" + hour : hour;
    var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : "" + d.getMinutes();

    return hour + ":" + minutes + (isAfterNoon ? " PM" : " AM");
}
