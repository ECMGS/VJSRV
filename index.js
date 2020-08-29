// Var containing the url of the vines that the user has already watched
let viewedVines = [];

/*
 *
 * BUTTON HANDLERS
 *
 */


/**
 * 	Shows the player when the meme-button has been hit
 */
const mButtonClick = () => {
	const wScreen = document.getElementById("welcome-container");
	const player = document.getElementById("player");

	wScreen.classList.add("hidden");
	player.classList.remove("hidden");

	playVideo();
}

/**
 * Play another video handler
 */
const paVclick = () => {
	const pAVPrompt = document.getElementById("paVideoPromp");
	const player = document.getElementById("player");


	pAVPrompt.classList.add("hidden");
	player.classList.remove("hidden");

	playVideo();
}

/*
 *
 * 	VIDEO HANDLERS
 *
 */

/**
 * 	Chooses a random video from the file
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
 * 	Loads and plays the video
 */
const playVideo = () => {
	try {
		let player = new YT.Player('player', {
			height: window.innerHeight,
			width: window.innerWidth,
			videoId: pickRandomVideo(),
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
 * removes the content created by the youtube api and resets the div
 */
const removePlaverDiv = () => {
	const player = document.getElementById("player");
	player.outerHTML = "<div id=\"player\"></div>";
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
		viewAVPromp();
	}
}

/**
 * 	Manages the vehaviour of the player when the video isn't
 * 	available, this is because some videos can get erased or
 * 	put on private.
 */
const onPlayerError = (evt) => {
	if (evt !== undefined) console.log(`The video ${evt.target.getVideoUrl()} can't be loaded\nMaybe it has been deleted by the creator`);
	removePlaverDiv();
	playVideo();
}

/*
 * 	OTHER LOGIC
 */

/**
 * Shows a selection screen for when the video ends
 */
const viewAVPromp = () => {
	// When the video ends, it asks the user if he wants to see another video
	removePlaverDiv();

	//shows the prompt for playing another video
	const pAVPrompt = document.getElementById("paVideoPromp");
	pAVPrompt.classList.remove("hidden");
}

