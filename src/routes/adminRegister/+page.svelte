<script>
	import { onMount } from 'svelte';
	import icon from '$lib/images/logo.png';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../ApiController.js';
	import '@fontsource/montserrat';

	let form = { 
		idAdmin: "",
		email: "",
		notelp: "",
		password: "",
		namaLaundry: "",
		bukaTutupLaundry: 'Tutup'
	}

	let users = [];

    const fetchUsers = async () => {
	    const token = localStorage.getItem('token');
	    try {
	      const response = await ApiController({
	        method: 'GET',
	        endpoint: 'getAdmin',
	        token: token
	      });

	      if (response && response.data && response.data.success) {
	        users = response.data.users;
	        if (users.length > 0) {
	          const lastUserId = users
	            .map(user => parseInt(user.idAdmin))
	            .sort()
	            .pop();
	          const incrementedId = lastUserId + 1;
	          form.idAdmin = incrementedId.toString(); // Ensure it is a string if necessary
	        } else {
	          form.idAdmin = '1'; // Start from 1 if no users exist
	        }
	      } else {
	        console.error('Failed to fetch users:', response ? response.data.error : 'No response from server');
	      }
	    } catch (error) {
	      console.error('Error fetching users:', error);
	    }
	  };

	function register() {
		if (!form.namaLaundry || !form.email || !form.notelp || !form.password) {
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

		const formData = new FormData();
		formData.append('idAdmin', form.idAdmin);
		formData.append('email', form.email);
		formData.append('notelp', form.notelp);
		formData.append('password', form.password);
		formData.append('namaLaundry', form.namaLaundry);
		formData.append('bukaTutupLaundry', form.bukaTutupLaundry);

		ApiController({method:'POST', endpoint:'adminRegister', datas: formData}).then(response => {
			alert('Data Berhasil Ditambahkan!');
			window.location.href = '/'
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
		<h2>Temukan kesempatan karir<br>
		impian Anda setelah bergabung</h2>
	</div>
	<div>
		<Input type="text" placeholder="Email" bind:value={form.email} />
		<Input type="text" placeholder="No. Telepon" bind:value={form.notelp} />
		<Input type="text" placeholder="Password" bind:value={form.password} />
		<Input type="text" placeholder="Nama Laundry" bind:value={form.namaLaundry} />
	</div>
	<Button type="button" label="Daftar" on:click={register} />
	<h3>Sudah Punya Akun? <a href="/">Masuk Sekarang</a></h3>
</div>
