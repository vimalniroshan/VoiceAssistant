/*****************************************************************************
*                                                                            *
*  Copyright 2016 Vimal Niroshan Sengoden                                    *
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

var username = "Vimal Niroshan";

var voiceRequestController = [
  new RequestController("I do not know if I'm looking for a Refinance or a Line of Credit", 
                        [
                          "refinance or line of credit",
                          "I'm not sure if I'm looking for a Refinance or a Line of Credit",
                          "I'm not sure if I'm looking for a Refinance or Line of Credit",
                          "I'm not sure if I'm looking for Refinance or a Line of Credit",
                          "I'm not sure if I'm looking for Refinance or Line of Credit",
                          "I don't know if I'm looking for a refinance or a line of credit",
                          "I don't know if I'm looking for a refinance or line of credit",
                          "I don't know if I'm looking for refinance or a line of credit",
                          "I don't know if I'm looking for refinance or line of credit",
                          "I do not know if I'm looking for a refinance or a line of credit",
                          "I do not know if I'm looking for a refinance or line of credit",
                          "I do not know if I'm looking for refinance or a line of credit",
                          "I do not know if I'm looking for refinance or line of credit",
                          "whats the difference between a refinance and a line of credit"
                        ],
                        function() {
                          voiceAssistant.say("Hello " + username + ". Yes, home owners often find that confusing. Let me get that information for you. Would you like to read through the details or can I guide you?");
                        }),
  new RequestController("Guide me", 
                        [
                          "Help me",
                          "Guide me please",
                          "Help me please"
                        ],
                        function() {
                          voiceAssistant.say("Sure thing. Do you already own the house?");
                        }),
  new RequestController("yes I do", 
                        [
                          "Yeah"
                        ],
                        function() {
                          voiceAssistant.say("For how many years?");
                        }),
  new RequestController("4 years", 
                        [
                          "4 years",
                          "5 years",
                          "6 years",
                          "7 years",
                          "8 years",
                          "9 years",
                          "10 years"
                        ],
                        function() {
                          voiceAssistant.say("Are you looking to reduce your interest rate or get some cash out of this loan?");
                        }),
  new RequestController("Yes looking for cash out", 
                        [
                          "looking for cash out",
                          "looking for some cash",
                          "yes looking for some cash",
                          "cash out"
                        ],
                        function() {
                          voiceAssistant.say("Will you be using the cash immediately?");
                        }),
  new RequestController("yes immediately", 
                        [
                          "immediately",
                          "yes"

                        ],
                        function() {
                          voiceAssistant.say("All of it? Or in small portions?");
                        }),
  new RequestController("Most of it", 
                        [
                          "All of it"
                        ],
                        function() {
                          voiceAssistant.say("Okay, I would recommend selecting Refinance option. This would be a cash out Refinance.");
                        }),
  new RequestController("small portions", 
                        [
                          "small portion"
                        ],
                        function() {
                          voiceAssistant.say("Okay, I would recommend selecting Line of Credit option");
                        }),
  new RequestController("thank you", 
                        [
                          "thanks",
                          "okay thank you"
                        ],
                        function() {
                          voiceAssistant.say("You welcome. Good Luck!");
                        }),
  new RequestController("What are points in pricing a mortgage", 
                        [
                          "What are points",
                          "I don't understand what points are",
                          "I do not understand what points are",
                          "points in pricing"
                        ],
                        function() {
                          voiceAssistant.say("Hello " + username + ". Would you like to read through the information or can I explain?");
                        }),
  new RequestController("Read through the information", 
                        [
                          "Read through",
                          "Read through my self",
                          "Read it myself"
                        ],
                        function() {
                          //load the links and say
                          openInNewTab("http://www.investopedia.com/articles/pf/06/payingforpoints.asp");
                          voiceAssistant.say("Displaying the requested information now");
                        }),
  new RequestController("Please explain", 
                        [
                          "explain",
                          "Read it out please",
                          "Go ahead"
                        ],
                        function() {
                          voiceAssistant.say("Points are also known as “discount points”. They are fees paid directly to the lender at closing in exchange for a reduced interest rate. This is also called “buying down the rate,” which can, in turn, lower your monthly mortgage payments. A point is equal to 1% of your mortgage amount (or $1,000 for every $100,000).");
                        }),
  new RequestController("what is my loan status", 
                        [
                          "loan status",
                          "status"
                        ],
                        function() {
                          voiceAssistant.say("Hello " + username + "! Tracking your loan now. Your loan application number ending in 2-2-9-8 is in Underwriting. This is Step 3 of 6, which means it is approximately 50% complete. It moved into Underwriting on October 15th 2016. Loan Officer assigned is Alex Doe, contact number 222-281–2345. Following documents are required from you: - Most recent three paystubs and Proof of $1200 Earnest Money Deposit.");
                        }),
  new RequestController("Can you email this information to me please", 
                        [
                          "email this information",
                          "email this"
                        ],
                        function() {
                          voiceAssistant.say("Yes, right away");
                        })
];

function handleRequest(requestText) {
  var match = voiceRequestController.filter(function(e) {
    return e.match(requestText);
  });

  if(match.length > 0) {
    match[0].action();
  } else {
    voiceAssistant.say("Sorry I could not understand what you said"); 
  }  
}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}