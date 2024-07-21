<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isAuthenticated = false;

	onMount(() => {
		isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
		if (!isAuthenticated) {
			goto('/');
		}
	});
</script>

<slot></slot>