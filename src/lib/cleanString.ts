/** remove emojis and whitespace */
export function cleanString(string: string): string {
	return string
		.replace(
			/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]| /g,
			''
		)
		.trim()
}
