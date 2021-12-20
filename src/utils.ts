function genId(size: number): string {
	const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

	let id = '';

	for (let i = 0; i < size; i += 1) {
		id += alpha.charAt(Math.floor(Math.random() * alpha.length));
	}

	return id;
}

export {
	genId
};