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

voiceAssistantExternalVoicesLoaded = false;

var LANG = "en-US";
var MAX_SPEECH_LENGTH_CHARS = 150;
var SPEECH_RATE = 0.90; // This should be a float value between 0 and 10, the default being 1.
var SPEECH_PITCH = 1; // This should be a float value between 0 and 2, with a value of 1 being the default. 

function VoiceAssistant() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("No speech recongntion support available in this browser version");
  } else {
    this.speechRecognition = new webkitSpeechRecognition();
    this.speechRecognition.lang = LANG;
    this.speechRecognition.continuous = true;
  }

  if (!('speechSynthesis' in window)) {
    alert('No Speech Synthesis Support');
  } else {
    this._speechSynthesisUtterance = new SpeechSynthesisUtterance();
    this._speechSynthesisUtterance.lang = LANG; 
    this._speechSynthesisUtterance.rate = SPEECH_RATE;
    this._speechSynthesisUtterance.pitch = SPEECH_PITCH;
    
    speechSynthesis.getVoices(); //This will start loading all voices
    speechSynthesis.onvoiceschanged = function() { // Once the voices are loaded, set the voice for this App.
      voiceAssistantExternalVoicesLoaded = true;
    };
    this.isVoiceReady=false;
    this.utterancesToSpeak=0;   
  }
}

VoiceAssistant.prototype.configure = function(config) {
  this.config = config;
  if(config) {
    if(config.continuous) {
      this.speechRecognition.continuous = config.continuous; 
    } else {
      this.speechRecognition.continuous = false;  
    }

    if(config.onInterimResult) {
      this.speechRecognition.interimResults = true;
    } else {
      this.speechRecognition.interimResults = false;  
    }

    if(!config.onFinalResult) {
      throw "There is no listener configured to listen transcripts from Speech Recognition";
    }
  }
};

VoiceAssistant.prototype.setVoice = function(voice) {
  if(voice) {
    this._speechSynthesisUtterance.voice = voice;  
  } else {
    this._speechSynthesisUtterance.voice = speechSynthesis.getVoices()
      .filter(function(voice) { return voice.name == 'Google UK English Female'; })[0];  
  }

  this.isVoiceReady=true;
};

VoiceAssistant.prototype.listen = function() {
  console.log("Listen called...");
  try{
    if(!speechSynthesis.speaking || !speechSynthesis.pending) {
      if(this.config.onListeningStarts) {
        this.config.onListeningStarts();
      }
      this.speechRecognition.start();    
    } else {
      console.log("Speech In-Progress, can't start listen");
    }
  } catch(e) {
    console.log(e.message);
  }
};

VoiceAssistant.prototype.stopListening = function() {
  this.speechRecognition.stop();
};

VoiceAssistant.prototype.say = function(text) {
  this.stopListening();
  if(this.config.onSpeechStart) {
    this.config.onSpeechStart(text);  
  }

  var utterances;

  if(text.length > MAX_SPEECH_LENGTH_CHARS) {
    utterances = splitUtterance(text);
  } else {
    utterances = [text];
  }
  
  this.utterancesToSpeak += utterances.length;

  for(var i = 0; i < utterances.length; i++) {
    console.log(utterances[i]);
    speechSynthesis.speak(this.createSpeechSynthesisUtterance(utterances[i]));  
  }
};

VoiceAssistant.prototype.createSpeechSynthesisUtterance = function(text) {
  var u = new SpeechSynthesisUtterance();
  u.lang = this._speechSynthesisUtterance.lang;
  u.voice = this._speechSynthesisUtterance.voice;
  u.rate = this._speechSynthesisUtterance.rate;
  u.pitch = this._speechSynthesisUtterance.pitch;
  u.onend = this._speechSynthesisUtterance.onend;
  u.text = text;
  
  return u;
}

VoiceAssistant.prototype.onResult = function(event) {
  if (typeof(event.results) == 'undefined') {
    console.log("undefined results from Speech Recognition");
    return;
  }

  if(this.config.onInterimResult || this.config.onFinalResult) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal && this.config.onFinalResult) {
        this.config.onFinalResult(event.results[i][0].transcript);
      } else if(this.config.onInterimResult){
        this.config.onInterimResult(event.results[i][0].transcript);
      }
    }
  }
}; 

VoiceAssistant.prototype.onListeningStops = function(event) {
  if(this.config.onListeningStops) {
      this.config.onListeningStops();    
  }
};

VoiceAssistant.prototype.onSpeechStops = function(event) {
  this.utterancesToSpeak-=1;
  if(this.utterancesToSpeak == 0) {
    this.listen();
  }
}

VoiceAssistant.prototype.isReady = function() {
  return this.isVoiceReady;
};

voiceAssistant = new VoiceAssistant();

voiceAssistant.speechRecognition.onresult = function(event) {
  voiceAssistant.onResult(event);    
};

voiceAssistant.speechRecognition.onstart = function() {
  console.log("Listening started");
};

voiceAssistant.speechRecognition.onend = function(event) {
  voiceAssistant.onListeningStops(event);
};

voiceAssistant._speechSynthesisUtterance.onend = function(event) {
  voiceAssistant.onSpeechStops(event);  
};


function checkVoiceLoading() {
  if(voiceAssistantExternalVoicesLoaded) {
    voiceAssistant.setVoice();
    console.log("Voice Loaded");
    return;
  } else {
    console.log("Voice NOT Loaded waiting...");
    setTimeout(checkVoiceLoading, 2000);
  }
}

function splitUtterance(utterance) {
  var i = 0;
  var start = 0;
  var utterances = [];
  while(start < utterance.length) {
    var tmp = utterance.substr(start, MAX_SPEECH_LENGTH_CHARS);
    var endIdx = tmp.length;
    
    if(tmp.length == MAX_SPEECH_LENGTH_CHARS) {
      var idxOfFullStop = tmp.lastIndexOf(".");
      var idxOfSpace = tmp.lastIndexOf(" ");
      endIdx = Math.max(idxOfFullStop, idxOfSpace) + 1;
    } 
    
    utterances[i] = tmp.substring(0, endIdx);

    console.log("[" + (i) + "] (" + start + ", " + (start + endIdx) + ") " + utterances[i]);
    start += endIdx; 
    i++;
  }
  
  return utterances;
}  

checkVoiceLoading();




