// @ts-ignore vendor-specific APIs are not supported by TypeScript
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
// @ts-ignore
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList; // not supported in Safari
// @ts-ignore
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

const grammar = "#JSGF V1.0; grammar direction; public <direction> = " + ["left", "right"].join(" | ") + " ;";

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.lang = "en-US";
recognition.continuous = true;

recognition.start();

recognition.onresult = (event: any) => {
    const result: SpeechRecognitionResultList = event.results;

    console.log("Result:" + result[0][0].transcript);
    console.debug("Alternatives:", result);
    console.debug("Confidence: " + result[0][0].confidence);

    // will be restarted as soon as it properly ended
    // otherwise, results are accumulated over multiple spoken phrases
    // is this good practice?
    recognition.stop();
};

recognition.onend = (event: any) => {
    console.debug("end", event);
    recognition.start();
};

recognition.onnomatch = function (event: any) {
    console.debug("no match", event);
};

recognition.onerror = function (event: any) {
    console.debug("error", event);
};
