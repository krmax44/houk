export function randomString(): string {
	return Math.random()
		.toString(36)
		.slice(2);
}

export function randomObject(): { [key: string]: string } {
	return { [randomString()]: randomString() };
}
