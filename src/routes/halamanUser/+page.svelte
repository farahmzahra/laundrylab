<script>
	import icon from '$lib/images/logo.png';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../ApiController.js';
	import '@fontsource/montserrat';

	let form = { 
		email: "",
		notelp: "",
		password: "",
		namaLaundry: "",
		alamat: ""
	}

	function register() {
		if (!isValidEmail(form.email)) {
            alert('Format email salah, silahkan coba lagi!');
            return;
        }

        if (!isValidPhoneNumber(form.notelp)) {
            alert('Format nomor telepon salah, awali dengan 62!');
            return;
        }

		const formData = new FormData();
		formData.append('email', form.email);
		formData.append('notelp', form.notelp);
		formData.append('password', form.password);
		formData.append('namaLaundry', form.namaLaundry);
		formData.append('alamat', form.alamat);

		function postRegister() {
			ApiController({method:'POST', endpoint:'adminRegister', datas: formData}).then(response => {
				// console.log(response);
			})
		}

		postRegister();
	}

	function isValidEmail(email) {
        const emailPattern = /\S+@\S+\.\S+/;
        return emailPattern.test(email);
    }

    function isValidPhoneNumber(phoneNumber) {
        const phoneNumberPattern = /^\d{12}$/;
        return phoneNumberPattern.test(phoneNumber);
    }
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
		<Input type="text" placeholder="Alamat" bind:value={form.alamat} />
	</div>
	<Button type="button" label="Daftar" on:click={register} />
	<h3>Sudah Punya Akun? <a href="/">Masuk Sekarang</a></h3>
</div>
