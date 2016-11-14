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


var nickName = "Vimal";

var notes = {};

var vocieRequestHandlers = [
    new VoiceRequestHandler([
        /^phone\s?number\s*([- 0-9]+)$/gi   
    ], function(matchGroups) {
        var phoneNumber = matchGroups[1];
        updatePhone(phoneNumber);   
        if(phoneNumber.replace(/[\s-]*/, "").length < 10) {
            $("#phDiv").addClass("has-error");
            voiceAssistant.say("Hey " + nickName + " phone number should have minimum 10 digits. This is an invalid number");        
        } else {
            $("#phDiv").removeClass("has-error");    
        }
    }),
    new VoiceRequestHandler([
        /^date\s?of\s?birth\s*(\d{1,2})(th|rd|st)*\s*(jan|January|Feb|February|March|April|June|July|August|September|October|November|December)\s*(\d{4})\s*$/gi,
        /^\s*date of birth\s*(jan|January|Feb|February|March|April|June|July|August|September|October|November|December)\s*(\d{1,2})(th|rd|st)*\s*(\d{4})$/gi
    ], function(matchGroups) {
        var year = matchGroups[4];
        var month = null;
        var date = null;
        if(isNaN(matchGroups[1])) { // if first group is not a number, month first pattern
            month = matchGroups[1];
            date = matchGroups[2];
        } else { // first group is number, date first pattern
            month = matchGroups[3]; 
            date = matchGroups[1];
        }
        
        if(isValidDate(year, month, date)) {
            updateDOB(date, month, year);
            $("#dtDiv").removeClass("has-error");
        } else {
            updateDOB(null, month, year);
            $("#dtDiv").addClass("has-error");
            voiceAssistant.say("Hey " + nickName + " are you kidding me?, " + month + ", " + year + " doesn't have " + date + " days");
        }
    }),
    new VoiceRequestHandler([
        /^address(\s+line)?\s+((\d+\s+[a-z\s]+)(\s+(apartment|unit|suite)(\s+(\d+)))?)(\s+([ a-z]+))?((\s+(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|District of Columbia|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|AK|AL|AR|AZ|CA|CO|CT|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NC|ND|NE|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY))(\s+(\d{5})))?$/gi,    
    ], function(matchGroups) {
        updateAddress(matchGroups[2], matchGroups[7], matchGroups[9], matchGroups[12], matchGroups[14]);
    }),
    new VoiceRequestHandler([
        /^(apartment|unit|suite)(\s+(\d+))$/gi    
    ], function(matchGroups) {
        updateAddress(null, matchGroups[3], null, null, null); 
    }),
    new VoiceRequestHandler([
        /^city\s+([ a-z]+)$/gi    
    ], function(matchGroups) {
        updateAddress(null, null, matchGroups[1], null, null); 
    }),
    new VoiceRequestHandler([
        /^state\s+(Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|District of Columbia|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|AK|AL|AR|AZ|CA|CO|CT|DC|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NC|ND|NE|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY)$/gi     
    ], function(matchGroups) {
        updateAddress(null, null, null, matchGroups[1], null);
    }),
    new VoiceRequestHandler([
        /^zip\s?code\s+(\d{5})$/gi     
    ], function(matchGroups) {
        updateAddress(null, null, null, null, matchGroups[1]);
    }),
    new VoiceRequestHandler([
        /^Gender\s+(male|female)$/gi     
    ], function(matchGroups) {
        updateGender(matchGroups[1]);
    }),
    new VoiceRequestHandler([
        /^I agree\s*$/gi,
        /^I agree to the Terms and Conditions$/gi    
    ], function() {
        agreeToTheTermsAndCondition();
    }),
    new VoiceRequestHandler([
        /^I disagree\s*$/gi,
        /^I disagree to the Terms and Conditions$/gi    
    ], function() {
        disagreeToTheTermsAndCondition();
    }),
    new VoiceRequestHandler([
        /^(Show( me)?( the)? )?Terms and Conditions$/gi
    ], function() {
        showTermsAndCondition();
        voiceAssistant.say("Showing Terms and Condition");
        voiceAssistant.say("If you want me to read and of the text, select it and say 'read'");
    }),
    new VoiceRequestHandler([
        /^read(\s*the)?(\s*selected)?(\s*text)?$/gi, 
        /^read(\s+it(\s+to\s+me)?)?$/gi
    ], function() {
        var selectedText = getSelectionText();
        if(selectedText && selectedText.length > 0) {
            voiceAssistant.say(selectedText);    
        } else {
            voiceAssistant.say("you didn't select any text to read");
        }
    }),
    new VoiceRequestHandler([
        "close",
        "close it"
    ], function() {
        closeTnCPopup();
    }),
    new VoiceRequestHandler([
        "submit"    
    ], function() {
        submit();
    }),
    new VoiceRequestHandler([
        "reset",
        "clear"
    ], function() {
        reset();
    }),
    new VoiceRequestHandler([
        /^open tab (home|settings|contact)$/gi,
        /^open (home|settings|contact) tab$/gi,
        /^open menu (home|settings|contact)$/gi,
        /^open (home|settings|contact) menu$/gi,
        /^navigate to (home|settings|contact).*$/gi, 
        /^navigate to tab (home|settings|contact)$/gi, 
    ], function(matchGroups) {
        toggleTab(matchGroups[1]);
    }),
    new VoiceRequestHandler([
        "Hey how are you doing today",
        "Hello", 
        "How are you"
    ], function() {
        voiceAssistant.say("Hello " + nickName + "! I am good how are you?");
    })
];


function welcomeMessage() {
    voiceAssistant.say("Hey " + nickName + "! I am here to assist you filling the form below. Please say field name followed by value to fill it. For example to fill Phone number.  Say phone number 234-456-2456");
}

function updatePhone(phoneNumber) {
    $("#phoneNumber").val(phoneNumber);
}

function updateDOB(date, month, year) {
    $("#date").val(date);
    $("#month").val(month.capitalizeFirstLetter());
    $("#year").val(year);   
}

function updateAddress(addressLine, unit, city, state, zip) {
    if(addressLine) {
        $("#postalAddress").val(addressLine.toTitleCase());
    }
    if(unit) {
        $("#unit").val(unit); 
    }
    if(city) {
        $("#city").val(city.toTitleCase()); 
    }
    if(state){
        $("#state").val(state.capitalizeFirstLetter()); 
    }
    if(zip){
        $("#zipCode").val(zip);
    }
}

function updateGender(gender) {
    $('input:radio[name=genderRadios]').val([gender.toLowerCase()]);
}

function agreeToTheTermsAndCondition(){
    $("#tnc").prop('checked', true);
}

function disagreeToTheTermsAndCondition(){
    $("#tnc").prop('checked', false);
}

function showTermsAndCondition() {
    $("#tnclink").click();
}

function submit() {
    $("#phDiv").removeClass("has-error"); 
    $("#aDiv").removeClass("has-error"); 
    $("#cDiv").removeClass("has-error"); 
    $("#sDiv").removeClass("has-error"); 
    $("#zDiv").removeClass("has-error"); 
    
    if(!$("#phoneNumber").val()){
        $("#phDiv").addClass("has-error"); 
        voiceAssistant.say("Please  fill-in your phone number to submit"); 
    } else if(!$("#postalAddress").val()) {
        $("#aDiv").addClass("has-error"); 
        voiceAssistant.say("Please  fill-in your address to submit");
    } else if(!$("#city").val()) {
        $("#cDiv").addClass("has-error"); 
        voiceAssistant.say("Please provide proper address to submit");
    } else if(!$("#state").val()) {
        $("#sDiv").addClass("has-error"); 
        voiceAssistant.say("Please provide state to submit");
    } else if(!$("#zipCode").val()) {
        $("#zDiv").addClass("has-error"); 
        voiceAssistant.say("Please provide zip code to submit");
    } else if(!$("#tnc"). prop("checked")) {
        voiceAssistant.say("Please agree to the terms and conditions to submit");     
    } else {
        $("#submit").click();
        voiceAssistant.say("Hey " + nickName + ", your form was successfully submitted"); 
    }
}

function reset() {
    $("#reset").click();
}

function closeTnCPopup() {
    $("#tncClose").click();
}

function toggleTab(tab) {
    $("#" + tab).click();
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function getMonthIndex(monthString){
   return new Date(monthString +" 1, 2016").getMonth();
}

function isValidDate(year, month, date){
   var daysInMonth = new Date(year, getMonthIndex(month)+1, 0).getDate();
   return (date <= daysInMonth);
}

function loadVoices() {
    var selectBox = $('#voices');
    var voices = voiceAssistant.getVoices();
    $(voices).each(function() {
        selectBox.append($("<option>").attr('value', this.name).text(this.name + " - " + (this.localService ? "Local Voice" : "Remote Voice")));
    });
    
    selectBox.val(voiceAssistant.getCurrentVoiceName());
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(word){return word.capitalizeFirstLetter();});
}

