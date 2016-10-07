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

function RequestController(utterance, aliases, action, requestMatcher) {
  this.utterance = utterance;
  this.aliases = aliases;
  this.action = action;
  this.requestMatcher = requestMatcher;
}

RequestController.prototype.match = function(requestText) {
  var lowerCaseRequestText = requestText.toLowerCase()
  return this.utterance.toLowerCase() === lowerCaseRequestText || 
    this.aliases.filter(function(e) {return e.toLowerCase() === lowerCaseRequestText}).length > 0;
};
