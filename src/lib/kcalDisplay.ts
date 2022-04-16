const kcalDisplay = (val) => {
	if (Number.isNaN(val)) {
		return '...';
	}

	return Math.round(val);
};
export default kcalDisplay;
