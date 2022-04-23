const kcalDisplay = (val: number | string) => {
	if (Number.isNaN(val) || typeof val !== 'number') {
		return '...';
	}

	return Math.round(val);
};
export default kcalDisplay;
