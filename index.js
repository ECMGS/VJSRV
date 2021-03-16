// Var containing the url of the vines that the user has already watched
let viewedVines = [];

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

/**
 * 	video logic
 */

/**
 * 	Picks a random video from the list
 *
 * 	@returns (string) the videoId
 */
const pickRandomVideo = () => {
	const video = Math.round(Math.random()*(videos.items.length-1));

	let ret;
	while (ret == undefined && !viewedVines.includes(ret)) {
		 ret = videos.items[video].contentDetails.videoId;
	}
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
}

/**
 * Starts the player when loaded
 */
const onPlayerReady = (evt) => {
	evt.target.playVideo();
}

/**
 * manages the state of the player
 */
const onPlayerStateChange = (evt) => {
	if (evt.data == YT.PlayerState.ENDED) {
		onVideoEnd();
	}
}

/**
 * 	Manages the vehaviour of the player when the video isn't
 * 	available, this is because some videos can get erased or
 * 	put on private.
 */
const onPlayerError = (evt) => {
	if (evt !== undefined) console.log(`The video ${evt.target.getVideoUrl()} can't be loaded\nMaybe it has been deleted by the creator`);
	hidePlayerScreen();
	playVideo();
}

/**
 * 	Handler for when the video ends
 */
const onVideoEnd = () => {
	hidePlayerScreen()
	showPlayAnotherVideoPromtScreen();
}
