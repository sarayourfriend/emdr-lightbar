/**
 * Adapted from https://gist.github.com/rproenca/64781c6a1329b48a455b645d361a9aa3
 */
function isOS() {
	return navigator.userAgent.match(/ipad|iphone/i);
}

function createTextArea(text) {
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.readonly = true;
	document.body.appendChild(textarea);
	return textarea;
}

function selectText(textarea) {
	if (isOS()) {
		const range = document.createRange();
		range.selectNodeContents(textarea);
		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		textarea.setSelectionRange(0, 999999);
	} else {
		textarea.select();
	}
}

function copyToClipboard(textarea) {
	document.execCommand("copy");
	document.body.removeChild(textarea);
}

export function copy(text) {
	const textarea = createTextArea(text);
	selectText(textarea);
	copyToClipboard(textarea);
}
