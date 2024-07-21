<script>
	import icon from '$lib/images/logo.png';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../ApiController.js';
	import '@fontsource/montserrat';

	let form = { 
		email: "",
		password: ""
	}

	function login() {
		const formData = new FormData();
		formData.append('email', form.email);
		formData.append('password', form.password);

		function postLogin() {
			ApiController({method:'POST', endpoint:'login', datas: formData}).then(response => {
				if (response.data.validator == 'petugas') {
					window.location.href = '/Pesanan'
				} else {
					alert('Email/Password salah, silahkan coba lagi!')
				}
			})
		}
		postLogin();
	}
	
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="container">
	<div>
		<h1>Masuk Disini!</h1>
		<h2>Selamat Datang,<br>
		Kami merindukan Anda! </h2>
	</div>
	<div>
		<Input type="text" placeholder="Email" bind:value={form.email} />
		<Input type="password" placeholder="Password" bind:value={form.password} />
	</div>
	<Button type="button" label="Masuk" on:click={login} />
</div>
