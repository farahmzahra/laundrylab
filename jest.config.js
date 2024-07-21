module.exports = {
	moduleNameMapper: {
		"^\\$lib$": "<rootDir>/src/lib",
		"^\\$lib/(.*)$": "<rootDir>/src/lib/$1",
		"^\\$app/(.*)$": "<rootDir>/.svelte-kit/runtime/app/$1"
	}
};