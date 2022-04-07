export default function clickOutside(node: Node, { enabled: initialEnabled, cb }) {
	const handleOutsideClick = ({ target }) => {
		if (!node.contains(target)) {
			cb();
		}
	};

	function update({ enabled }) {
		if (enabled) {
			window.addEventListener('mousedown', handleOutsideClick);
		} else {
			window.removeEventListener('mousedown', handleOutsideClick);
		}
	}

	update({ enabled: initialEnabled });
	return {
		update,
		destroy() {
			window.removeEventListener('mousedown', handleOutsideClick);
		},
	};
}
