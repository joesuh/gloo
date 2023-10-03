// https://github.com/addpipe/simple-recorderjs-demo
URL = window.URL || window.webkitURL;
var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

function startRecording() {
	console.log("recordButton clicked");
    var constraints = { audio: true, video:false }
	document.getElementById("recordButton").disabled = true;
	document.getElementById("stopButton").disabled = false;
	document.getElementById("pauseButton").disabled = false;
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
		audioContext = new AudioContext();
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input,{numChannels:1})
		rec.record();
		console.log("Recording started");
        addActionClass('listening');
	}).catch(function(err) {
        document.getElementById("recordButton").disabled = false;
        document.getElementById("stopButton").disabled = true;
        document.getElementById("pauseButton").disabled = true;
	});
}

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		rec.stop();
		document.getElementById("pauseButton").innerHTML="Resume";
	}else{
		rec.record()
		document.getElementById("pauseButton").innerHTML="Pause";
	}
}

function addActionClass(addClass){
    if ($(".processing-icons").hasClass('listening')) {
        $(".processing-icons").removeClass( 'listening');
    }
    if ($(".processing-icons").hasClass('speaking')) {
        $(".processing-icons").removeClass( 'speaking');
    }
    if ($(".processing-icons").hasClass('thinking')) {
        $(".processing-icons").removeClass( 'thinking');
    }
    $('.processing-icons').addClass(addClass);
}


function stopRecording() {
    addActionClass('thinking');
	console.log("stopButton clicked");
	document.getElementById("recordButton").disabled = false;
    document.getElementById("stopButton").disabled = true;
    document.getElementById("pauseButton").disabled = true;
	document.getElementById("pauseButton").innerHTML="Pause";
	rec.stop();
	gumStream.getAudioTracks()[0].stop();
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	// var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	// var li = document.createElement('li');
	// var link = document.createElement('a');
	var filename = new Date().toISOString();
	//add controls to the <audio> element
	au.controls = true;
	// au.src = url;
	// //save to disk link
	// link.href = url;
	// link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	// link.innerHTML = "Save to disk";
	// //add the new audio element to li
	// li.appendChild(au);	
    let csrf_token = "{{ csrf_token() }}";
    fetch('/audio', {
        method: "POST", 
        body: blob,
        headers: {
            contentType: "application/json",
            "X-CSRFToken": csrf_token,
        }
    }).then(response => response.json().then(result => {
            console.log('res2 = ', result)
            // console.log("TYPE =",$.type(result));
            // console.log('res3 = ', result.text)
            // console.log('res4 = ', result.audio)
            // console.log('res5 = ', result["audio"])
            // baseURL = "http://127.0.0.1:5555/static/audio/questions/"+result.audio
            baseURL = "https://gloo.pastors.ai/static/audio/questions/"+result.audio
            au.src = baseURL;
            $('#replyAudio').append(au);

            const audio = new Audio(baseURL);
            audio.play();

            addActionClass('speaking');
            document.getElementById('output').innerHTML = result.text;
    }));
}