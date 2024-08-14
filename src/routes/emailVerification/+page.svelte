<script type="text/javascript">
	import { onMount } from 'svelte';
	import ApiController from '../ApiController.js';

	let form = { 
		email: "",
		role: ""
	}

	onMount(async() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		let userEmail = urlParams.get("email")
		let userRole = urlParams.get("role")
		const formData = new FormData();
		formData.append('email', form.email);
		formData.append('role', form.role);
		console.log(userEmail)
		console.log(userRole)

		ApiController({method:'POST', endpoint:'emailVerification', datas: formData}).then(response => {
			console.log(response)
			// alert('Akun anda berhasil diverifikasi, silahkan coba login kembali!');
		})
	})
</script>