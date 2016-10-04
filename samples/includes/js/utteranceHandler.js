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

var voiceRequestController = [
  new RequestController("I do not know if I am looking for a Refinance or a Line of Credit", 
                        [
                          "Refinance or a Line of Credit",
                          "refinance or line of credit",
                          "I am not sure if I am looking for a Refinance or a Line of Credit"
                        ],
                        function() {
                          voiceAssistant.say("Hello John. Yes, home owners often find that confusing. Let me get that information for you. Would you like to read through what I have found yourself or would you like me to guide you to your answer?");
                        }),
  new RequestController("Bring information up", 
                        [
                          "Bring up",
                          "Bring it up"
                        ],
                        function() {
                          voiceAssistant.say("Sure thing. Do you already own the house?");
                        }),
  new RequestController("Yes", 
                        [
                          "Yeah",
                          "True"
                        ],
                        function() {
                          voiceAssistant.say("For how many years?");
                        }),
  new RequestController("4 years", 
                        [
                          "years",
                          "months"
                        ],
                        function() {
                          voiceAssistant.say("Are you looking to reduce your interest rate or get some cash out of this loan?");
                        }),
  new RequestController("Yes looking for cash out", 
                        [
                          "looking for cash out",
                          "cash out"
                        ],
                        function() {
                          voiceAssistant.say("Will you be using the cash immediately?");
                        }),
  new RequestController("Yes", 
                        [
                          "Yeah",
                          "True"
                        ],
                        function() {
                          voiceAssistant.say("All of it? Or in small portions?");
                        }),
  new RequestController("Most of it", 
                        [
                          "small portions",
                          "All of it"
                        ],
                        function() {
                          voiceAssistant.say("I would recommend selecting 'This will be a Refinance' option then. This would be a cash out Refinance.");
                        }),
  new RequestController("Ok thank you", 
                        [
                          "thanks"
                        ],
                        function() {
                          voiceAssistant.say("You are welcome.");
                        }),
  new RequestController("What are points in pricing a mortgage", 
                        [
                          "pricing",
                          "points in pricing"
                        ],
                        function() {
                          voiceAssistant.say("Hello John. Would you like to read through what I have found yourself or would you like me to read out your answer?");
                        }),
  new RequestController("Read through the information", 
                        [
                          "Read through",
                          "Read me",
                          "Read it out please"
                        ],
                        function() {
                          voiceAssistant.say("Points, also known as “discount points,” are fees paid directly to the lender at closing in exchange for a reduced interest rate. This is also called “buying down the rate,” which can, in turn, lower your monthly mortgage payments. A point is equal to 1% of your mortgage amount (or $1,000 for every $100,000).");
                        }),
  new RequestController("what is my loan status", 
                        [
                          "loan status",
                          "status"
                        ],
                        function() {
                          voiceAssistant.say("Hello John! Tracking your loan now. You loan application# ending in 2298 is in Underwriting. This is Step 3 of 6, which means it is approximately 50% complete. It moved into Underwriting on October 15th 2015. Current Loan Officer assigned is Alex Doe, contact # 222- 281 – 2345  Following documents are required from you: 1.Most recent 3 paystubs 2.Flood Certificate for subject property 3.Proof of Earnest Money Deposit of $1200");
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