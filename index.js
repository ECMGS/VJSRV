// Var containing the url of the vines that the user has already watched
let viewedVines = [];
let erroronvideo;
let automaticReplay = false;

/**
 * 	BUTTON HANDLERS
 */

/**
 * 	Handler of the main meme button
 */
const playMemeClick = () => {
	hideMainScreen();
	playVideo(true);
}

/**
 * Handler of the play another meme button	
 */
const playAnotherMemeClick = () => {
	hidePlayAnotherVideoPromptScreen();
	playVideo(true);
}

/**
 * 	Handler of the replay meme button
 */
const replayMemeClick = () => {
	hidePlayAnotherVideoPromptScreen();
	playVideo(false);
}

/**
 * 	Handler of the automatic replay button
 */
const automaticReplayButtonClick = () => {
	automaticReplay = automaticReplay ? false : true;

	const automaticReplayStatus = document.getElementById("automatic-replay-status");
	console.log(automaticReplay);
	automaticReplayStatus.innerText = automaticReplay ? "on" : "off";

	setComponentVisibility("status-bar",automaticReplay);

	updateWatchedVideosStatusBarElement();
}

/**
 * 	DOM handlers
 */


/**
 * 	Shows the player
 */
const showPlayerScreen = () => {
	const player = document.getElementById("player");
	player.classList.remove("hidden");
};

/**
 * 	Hides the player screen
 */
const hidePlayerScreen = () => {
	const player = document.getElementById("player");
	player.outerHTML = "<div id=\"player\"></div>";
}

/**
 * 	Hides main screen
 */
const hideMainScreen = () => {
	const wScreen = document.getElementById("welcome-container");
	wScreen.classList.add("hidden");
}

/**
 * 	Hides the playAnotherVideoPrompt
 */
const hidePlayAnotherVideoPromptScreen = () => {
	const pAVPrompt = document.getElementById("paVideoPromp");
	pAVPrompt.classList.add("hidden");
}

/**
 * 	Shows the playAnotherVideoPrompt
 */
const showPlayAnotherVideoPromtScreen = () => {
	const pAVPrompt = document.getElementById("paVideoPromp");
	pAVPrompt.classList.remove("hidden");

	// Sets the value for the text of the videos watched
	const watchedVideosElement = document.getElementById("watchedVideos");
	const totalVideosElement = document.getElementById("totalVideos");

	watchedVideosElement.innerText = viewedVines.length;
	totalVideosElement.innerText = videos.items.length;
}

const updateWatchedVideosStatusBarElement = () => {
	const watchedVideosStatusBarElement = document.getElementById("watchedVideosStatusBar");
	watchedVideosStatusBarElement.innerText = viewedVines.length;
	
}

/**
 * 	video logic
 */

/**
 * 	Picks a random video from the list
 *
 * 	@returns (string) the videoId
 */
const pickRandomVideo = () => {
	let video; 

	let ret;
	do {
		video = Math.round(Math.random()*(videos.items.length-1));
		ret = videos.items[video].contentDetails.videoId;
	} while (viewedVines.includes(ret));
	viewedVines = [...viewedVines, ret];
	return ret;
}

/**
 * 	Plays a video
 */
const playVideo = (random = true) => {
	showPlayerScreen();

	let videoId = random ? pickRandomVideo() : viewedVines[viewedVines.length-1];

	try {
		let player = new YT.Player('player', {
			height: window.innerHeight,
			width: window.innerWidth,
			videoId: videoId,
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange,
				'onError': onPlayerError 
			},
		})
	} catch (e) {
		onPlayerError();
	}
	
	if (automaticReplay) {
		updateWatchedVideosStatusBarElement();
	}
}

/**
 * Starts the player when loaded
 */
const onPlayerReady = (evt) => {
	errorOnVideo = setTimeout(onPlayerError, 3000);
	console.log("setting timeout")
	evt.target.playVideo();
}

/**
 * manages the state of the player
 */
const onPlayerStateChange = (evt) => {
	switch (evt.data) {
		case YT.PlayerState.ENDED:
			onVideoEnd();
			break;
		case YT.PlayerState.PLAYING:
			clearTimeout(errorOnVideo);
			console.log("Stopping timeout")
			break;
	}
}

/**
 * 	Manages the vehaviour of the player when the video isn't
 * 	available, this is because some videos can get erased or
 * 	put on private.
 */
const onPlayerError = (evt) => {
	if (evt !== undefined) console.log(`The video ${evt.target.getVideoUrl()} can't be loaded\nMaybe it has been deleted by the creator`);
	clearTimeout(errorOnVideo)
	hidePlayerScreen();
	playVideo();
}

/**
 * 	Handler for when the video ends
 */
const onVideoEnd = () => {
	hidePlayerScreen()
	if (automaticReplay == false) {
		showPlayAnotherVideoPromtScreen();
		return;
	}

	playVideo(true);
}

/**
 * 	CUSTOM FUNCTIONS
 */
const setComponentVisibility = (elementId, visible) => {
	const element = document.getElementById(elementId);
	if (!visible) {
		element.classList.add("hidden");	
		return ;
	}
	element.classList.remove("hidden");
}
