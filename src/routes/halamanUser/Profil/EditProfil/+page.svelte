<script>
	import arrowLeft from '$lib/images/left-arrow.png';
	import arrow from '$lib/images/down-arrow.png';
	import img from '$lib/images/profile/profile.jpg';
	import Input from '$lib/components/input.svelte';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../../../ApiController.js';
	import '@fontsource/montserrat';

	let form = {
	    fullName: 'Farah Meutia Zahra',
	    email: 'farah@gmail.com',
	    notelp: '08810810881'
	};
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="header" style="align-items: center;">
		<div class="title-center">
	      <a href="/halamanUser/Beranda"> <!-- Link to go back to the previous page -->
	        <img src="{arrowLeft}" alt="back" class="back-arrow" />
	      </a>
	      Ubah Profil Saya
	    </div>
	</div>
	<br>
	<div class="centered-items">
		<div class="profile-img"><img src="{img}"></div>
	</div><br>
	<div class="centered-items">
		<a href="#">Ubah Foto Profil</a>
	</div><br>
	<div>
		<Input type="text" placeholder="Nama Lengkap" bind:value={form.fullName} />
		<Input type="text" placeholder="Email" bind:value={form.email} disabled={true} />
		<Input type="text" placeholder="Nomor Telepon" bind:value={form.notelp} />
	</div>
	<div class="centered-items">
		<Button type="button" label="Ubah" />
	</div>
</div>