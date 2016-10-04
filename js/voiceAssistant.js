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
    this.speechSynthesisUtterance = new SpeechSynthesisUtterance();
    this.speechSynthesisUtterance.lang = LANG; 
    
    speechSynthesis.getVoices(); //This will start loading all voices
    speechSynthesis.onvoiceschanged = function() { // Once the voices are loaded, set the voice for this App.
      voiceAssistantExternalVoicesLoaded = true;
    };
    this.isVoiceReady=false;   
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
    this.speechSynthesisUtterance.voice = voice;  
  } else {
    this.speechSynthesisUtterance.voice = speechSynthesis.getVoices()
      .filter(function(voice) { return voice.name == 'Google UK English Female'; })[0];  
  }

  this.isVoiceReady=true;
};

VoiceAssistant.prototype.listen = function() {
  console.log("Listen called...");
  try{
    if(this.config.onListeningStarts) {
      this.config.onListeningStarts();
    }
    this.speechRecognition.start();    
  } catch(e) {
    console.log(e.message);
  }
};

VoiceAssistant.prototype.stopListening = function() {
  this.speechRecognition.stop();
};

VoiceAssistant.prototype.say = function(text) {
  this.stopListening();
  this.speechSynthesisUtterance.text = text;
  if(this.config.onSpeechStart) {
    this.config.onSpeechStart(text);  
  }
  speechSynthesis.speak(this.speechSynthesisUtterance);
};

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
  this.listen();
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

voiceAssistant.speechSynthesisUtterance.onend = function(event) {
  voiceAssistant.onSpeechStops(event);  
};


function checkVoiceLoading() {
  if(voiceAssistantExternalVoicesLoaded) {
    voiceAssistant.setVoice();
    console.log("Voice Loaded");
    return;
  } else {
    console.log("Voice NOT Loaded waiting again");
    setTimeout(checkVoiceLoading, 2000);
  }
}  

checkVoiceLoading();




