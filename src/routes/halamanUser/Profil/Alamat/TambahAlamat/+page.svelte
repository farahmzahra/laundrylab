<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import icon from '$lib/images/logo.png';
	import profil from '$lib/images/profil-logo.png';
	import location from '$lib/images/location.png';
	import laundry from '$lib/images/laundry-pict.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
	import category3 from '$lib/images/setrika.png';
	import arrow from '$lib/images/down-arrow.png';
	import Button from '$lib/components/button.svelte';
	import Input from '$lib/components/input.svelte';
	import ApiController from '../../../../ApiController.js';
	import '@fontsource/montserrat';

	let form = {
	    notelp: '',
	    alamat: '',
	    kelurahan: '',
	    kecamatan: '',
	    detailalamat: ''
	};
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="container">
	<div class="card-row">
		<div class="title">Tambah Alamat</div>
	</div>
	<br>
	<div>
			<Input type="text" placeholder="Nomor Telepon" bind:value={form.notelp} style="width: 400px;" />
	    <Input type="text" placeholder="Alamat" bind:value={form.alamat} style="width: 400px;" />
	    <Input type="text" placeholder="Kelurahan" bind:value={form.kelurahan} style="width: 400px;" />
	    <Input type="text" placeholder="Kecamatan" bind:value={form.kecamatan} style="width: 400px;" />
	    <Input type="text" placeholder="Detail Alamat" bind:value={form.detailalamat} style="width: 400px;" />
	</div>
	<div class="buttons">
		<Button type="button" label="Tambah Alamat" />
	</div>
</div>