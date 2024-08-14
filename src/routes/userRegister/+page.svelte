<script>
	import { onMount } from 'svelte';
	import icon from '$lib/images/logo.png';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../ApiController.js';
	import '@fontsource/montserrat';
	import emailjs from '@emailjs/browser';

	let showPassword = "password"

	let form = { 
		idUser: "",
		nama: "",
		email: "",
		notelp: "",
		password: "",
		isValidated: "no"
	}

	let users = [];

    const fetchUsers = async () => {
	    const token = localStorage.getItem('token');
	    try {
	      const response = await ApiController({
	        method: 'GET',
	        endpoint: 'getUser',
	        token: token
	      });

	      if (response && response.data && response.data.success) {
	        users = response.data.users;
	        if (users.length > 0) {
	          const lastUserId = users
	            .map(user => parseInt(user.idUser))
	            .sort((a, b) => a - b)
	            .pop();
	          const incrementedId = lastUserId + 1;
	          form.idUser = incrementedId.toString();
	        } else {
	          form.idUser = '1';
	        }
	      } else {
	        console.error('Failed to fetch users:', response ? response.data.error : 'No response from server');
	      }
	    } catch (error) {
	      console.error('Error fetching users:', error);
	    }
	  };

	function register() {
		if (!form.nama || !form.email || !form.notelp || !form.password) {
	      	alert('Semua kolom harus diisi!');
	      	return;
	    }

		if (!isValidEmail(form.email)) {
            alert('Format email salah, silahkan coba lagi!');
            return;
        }

        if (!isValidPhoneNumber(form.notelp)) {
            alert('Format nomor telepon salah, awali dengan 62!');
            return;
        }

        if (!isValidPassword(form.password)) {
            alert('Password harus mengandung minimal 8 karakter, 1 huruf besar, 1 huruf kecil, dan 1 karakter spesial!');
            return;
        }

		const formData = new FormData();
		formData.append('idUser', form.idUser);
		formData.append('nama', form.nama);
		formData.append('email', form.email);
		formData.append('notelp', form.notelp);
		formData.append('password', form.password);
		formData.append('isValidated', form.isValidated);

		ApiController({method:'POST', endpoint:'userRegister', datas: formData}).then(response => {
			alert('Mohon ditunggu, menambahkan data anda...');
			let templateParams = {
			  link_verification: `http://localhost:5173/emailVerification?email=${form.email}&role=user`,
			  user_email: form.email,
			  reply_to: 'goddessflowerss@gmail.com'
			};
			  emailjs.send("service_x5gcvzg","template_hb5m33o", templateParams, {publicKey: 'UhKTTYlGVnFAdVBzR'
			  }).then(
			  (response) => {
			    console.log('SUCCESS!', response.status, response.text);
			    alert('Data Berhasil Ditambahkan! Validasi Email Untuk Dapat Login!');
				window.location.href = '/'
			  },
			  (error) => {
			    console.log('FAILED...', error);
			  },
			);
		})
	}

	function isValidEmail(email) {
        const emailPattern = /\S+@\S+\.\S+/;
        return emailPattern.test(email);
    }

    function isValidPhoneNumber(phoneNumber) {
        const phoneNumberPattern = /^62\d{9,11}$/;;
        return phoneNumberPattern.test(phoneNumber);
    }

	function isValidPassword(password) {
	    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
	    return passwordPattern.test(password);
	}

    onMount(fetchUsers);
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="container">
	<div>
		<h1>Buat Akun</h1>
		<h2>Temukan laundry pilihan<br>
		Anda setelah bergabung</h2>
	</div>
	<div>
		<Input type="text" placeholder="Nama Lengkap" bind:value={form.nama} />
		<Input type="text" placeholder="Email" bind:value={form.email} />
		<Input type="text" placeholder="No. Telepon" bind:value={form.notelp} />
		<Input type="password" placeholder="Password" bind:value={form.password} isPassword="true"/>
	</div>
	<Button type="button" label="Daftar" on:click={register} />
	<h3>Sudah Punya Akun? <a href="/">Masuk Sekarang</a></h3>
</div>