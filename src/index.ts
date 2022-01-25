// @ts-ignore vendor-specific APIs are not supported by TypeScript
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
// @ts-ignore
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList; // not supported in Safari
// @ts-ignore
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

// TODO: synthesis seems to be broken on reload
// TODO: how to stop recognition to pick up synthesized voice

/**
 * Synthesis
 */

let availableVoices: SpeechSynthesisVoice[] = [];

const synthesis = window.speechSynthesis;
function selectVoice() {
    const voices = synthesis.getVoices();
    console.debug("voices", voices);
    availableVoices = voices.filter((voice) => voice.name === "Google UK English Male");
    console.debug("filtered voices", availableVoices);
}
selectVoice();

// not defined in firefox
// in chrome, we need to wait until list of voices is fetched from Google's servers
// privacy? offline? can we use a local voice?
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = selectVoice;
}

function speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(`${text}?`);
    utterance.voice = availableVoices[0]; // handle empty array case (TS rule?)
    synthesis.speak(utterance);
}

/**
 * Recognition
 */

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

    speak(result[0][0].transcript);

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
