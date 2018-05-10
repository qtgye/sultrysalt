const vendorScripts = [

	// jquery
	{
		src: 'https://code.jquery.com/jquery-3.3.1.min.js',
		onload: documentReady,
	},

	// youtube
	{
		src: 'https://www.youtube.com/iframe_api',
	}

];




/**
 * Preload vendor scripts
 */
vendorScripts.forEach(({src, onload}) => {
	if ( !src ) return;
	script = document.createElement('script');
	script.type = 'text/javascript';
	script.onload = () => {
		script.remove();
		if ( typeof onload === 'function' ) onload();
	};
	script.src = src;
	document.getElementsByTagName('head')[0].appendChild(script);
});




/**
 * --------------------------------------------------------------------------------------------
 * APP SCRIPTS
 * --------------------------------------------------------------------------------------------
 */

let $titles;
let $video;

let player;
let duration;
let activeItem;
let currentTime = 0;
let playbackInterval;
let VIDEO_ID = '6CgrVt3BGqY';

const segmentDuration = 10;
const segments = [
	segmentDuration*0,
	segmentDuration*1,
	segmentDuration*2
];


function documentReady () {
	$titles = $('.hero__title');
	$video = $('#hero__video__media');

	if ( $video.length ) {
		bindVideoTimeUpdate();
	}

	bindTitleClick();
}


function onYouTubeIframeAPIReady() {
	let _player = document.querySelector('#hero__video__player');
	if ( _player ) {
		player = new YT.Player(_player.id, {
			videoId: VIDEO_ID,
			playerVars: {
				autoplay: 1,
				loop: 1,
				controls: 0,
				enablejsapi: 1,
				modestbranding: 1,
				showinfo: 0,
			},
			events: {
				'onReady': onPlayerReady,
			}
		});
	}
}

function onPlayerReady() {
	// player.loadVideoById({ videoId: VIDEO_ID });
	duration = player.getDuration();
	playbackInterval = setInterval(onTimeUpdate, 100);
}

function onTimeUpdate () {

	if (player) {
		currentTime = player.getCurrentTime();
	}
	else if ( $video.length ) {
		currentTime = $video[0].currentTime;
	}


	switch( true ) {
		case (currentTime >= segments[2]):
			activateItem(2);
			break;
		case (currentTime >= segments[1]):
			activateItem(1);
			break;
		default:
			activateItem(0);
	}

	updateProgessBar();
}

function activateItem( itemIndex ) {
	if ( itemIndex === activeItem || !$titles ) return;

	$titles.filter('.active')
		// Remove active class
		.removeClass('active')
		// Remove progress bar transform
		.find('.hero__title__progress')
		.css('transform', '')
		.end().end()
		// Active cuttent item
		.eq(itemIndex).addClass('active');

	activeItem = itemIndex;

}

function updateProgessBar() {
	if ( typeof activeItem !== 'number' ) return;

	let $activeItem = $titles.eq(activeItem);
	let $activeProgressBar = $activeItem.find('.hero__title__progress');
	let progressRatio = (currentTime - (segmentDuration * activeItem)) / segmentDuration;
	let progressPercent = 100 * progressRatio;
	let transformPercent = progressPercent - 100;

	$activeProgressBar.css('transform', 'translateX('+transformPercent+'%)');

}

function bindVideoTimeUpdate() {
	$video.on('timeupdate', onTimeUpdate);
}

function bindTitleClick() {
	$titles.each(function (index) {
		$(this).click(function () {
			if ($('iframe').length) {
				player.seekTo(segments[index]);
			}
			else if ($video.length) {
				$video[0].currentTime = segments[index];
			}
		});
	});
}