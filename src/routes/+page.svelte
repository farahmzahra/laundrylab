<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import icon from '$lib/images/logo.png';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import ApiController from './ApiController.js';
	import '@fontsource/montserrat';

	let form = { 
		email: '',
		password: ''
	}

	// async function login() {
	//     const formData = new FormData();
	//     formData.append('email', form.email);
	//     formData.append('password', form.password);

	//     try {
	//         const response = await ApiController({
	//             method: 'POST',
	//             endpoint: `login`,
	//             datas: formData,
	//             sendForm: true
	//         });
	//         if (response.data.success) {
	//             const results = response.data.validator;
	//             console.log(results);
	//         } else {
	//             alert('Failed to login: ' + (response.data.error || 'Unknown error'));
	//         }
	//     } catch (error) {
	//         console.error('Error during login:', error);
	//         alert('An error occurred while logging in.');
	//     }
	// }

	function login() {
	    const formData = new FormData();
	    formData.append('email', form.email);
	    formData.append('password', form.password);

	    function postLogin(formData) {
	        ApiController({method:'POST', endpoint:'login', datas: formData}).then(response => {
	            if (response.data.validator == 'user') {
	            	localStorage.setItem('isAuthenticated', 'true');
	        		if (localStorage.getItem('isAuthenticated')) {
	        			localStorage.setItem('id', response.data.id);
	        			localStorage.setItem('email', formData.get('email'));
	        			localStorage.setItem('role', response.data.validator);
	        			localStorage.setItem('token', response.data.token);
	                	window.location.href = '/halamanUser/Beranda'
	        		} else {
	        			alert('User doesnt authenticated');
	        		}
	            } else if (response.data.validator == 'admin') {
	            	localStorage.setItem('isAuthenticated', 'true');
	        		if (localStorage.getItem('isAuthenticated')) {
	        			localStorage.setItem('id', response.data.id);
	        			localStorage.setItem('email', formData.get('email'));
	        			localStorage.setItem('role', response.data.validator);
	        			localStorage.setItem('token', response.data.token);
	                	window.location.href = '/halamanAdmin'
	        		} else {
	        			alert('User doesnt authenticated');
	        		}
	        	}
	        	else if (response.data.validator == 'petugas') {
	            	localStorage.setItem('isAuthenticated', 'true');
	        		if (localStorage.getItem('isAuthenticated')) {
	        			localStorage.setItem('id', response.data.id);
	        			localStorage.setItem('email', formData.get('email'));
	        			localStorage.setItem('role', response.data.validator);
	        			localStorage.setItem('token', response.data.token);
	                	window.location.href = '/halamanPetugas/Pesanan'
	        		} else {
	        			alert('User doesnt authenticated');
	        		}
	            } else {
	                alert('Email/Password salah, silahkan coba lagi!')
	            }
	            console.log(response.data.token)
	        })
	    }
	    postLogin(formData);
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
	<h3>Belum Punya Akun? Buat Akun Baru</h3>
	<div class="link-container">
		<a href="/userRegister">Pelanggan</a>
		<a href="/adminRegister">Pemilik Toko</a>
	</div>
</div>