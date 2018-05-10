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
	script.async = true;
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
}


function onYouTubeIframeAPIReady() {
	player = new YT.Player('hero__video__player', {
		videoId: VIDEO_ID,
		playerVars: {
			autoplay: 1,
			loop: 1,
			controls: 0,
			enablejsapi: 1,
			modestbranding: 1,
			showinfo: 1,
			playlist: VIDEO_ID,
		},
		events: {
			'onReady': onPlayerReady,
		}
	});
}

function onPlayerReady() {
	duration = player.getDuration();
	playbackInterval = setInterval(onTimeUpdate, 100);

	bindTitleClick();
}

function onTimeUpdate () {
	currentTime = player.getCurrentTime();

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
	if ( itemIndex === activeItem ) return;

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

function bindTitleClick() {
	$titles.each(function (index) {
		$(this).click(function () {
			player.seekTo(segments[index]);
		});
	});
}