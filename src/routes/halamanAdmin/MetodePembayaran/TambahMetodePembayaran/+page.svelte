<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import icon from '$lib/images/logo.png';
	import logo from '$lib/images/logo-admin.png';
	import profil from '$lib/images/profil-logo.png';
	import location from '$lib/images/location.png';
	import laundry from '$lib/images/laundry-pict.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
	import category3 from '$lib/images/setrika.png';
	import arrow from '$lib/images/down-arrow.png';
	import Button from '$lib/components/button.svelte';
	import Input from '$lib/components/input.svelte';
	import ApiController from '../../../ApiController.js';
	import '@fontsource/montserrat';

	let form = {
	    paymentMethod: '',
	    namaBank: '',
	    noRekBank: '',
	    qrqris: '',
	    catatan: ''
	};

  const dispatch = createEventDispatcher();

  let paymentMethods = [
    { label: 'Transfer Bank', value: 'bank' },
    { label: 'QRIS', value: 'qris' },
    { label: 'Tunai', value: 'tunai' }
  ];

  function handleSubmit() {
    // Handle form submission based on selected payment method
    if (form.paymentMethod === 'bank') {
      // Handle bank payment method
      console.log('Bank selected:', form.namaBank, form.noRekBank);
    } else if (form.paymentMethod === 'qr') {
      // Handle QR payment method
      console.log('QR selected:', form.qrInfo);
    } else {
      // Handle cash payment method
      console.log('Cash selected');
    }
  }
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="container">
	<div class="header">
		<img src="{logo}" class="logo">
		<img src="{profil}">
	</div><br>
	<div class="card-row">
		<div class="title">Tambah Metode Pembayaran</div>
	</div>
	<br>
	<div>
	    <Input type="dropdown" placeholder="Pilih Metode Pembayaran" bind:value={form.paymentMethod} options={paymentMethods} />
	    {#if form.paymentMethod === 'bank'}
	      	<Input placeholder="Nama Bank" bind:value={form.namaBank} style="width: 400px;" />
	      	<Input placeholder="Nomor Rekening Bank" bind:value={form.noRekBank} style="width: 400px;" />
	      	<Input placeholder="Catatan" bind:value={form.catatan} style="width: 400px;" />
	    {:else if form.paymentMethod === 'qris'}
			<Input type="file" accept="image/*" label="Pilih Foto QR Code QRIS" bind:value={form.qrqris} style="width: 400px;" />
			<Input placeholder="Catatan" bind:value={form.catatan} style="width: 400px;" />
		{:else if form.paymentMethod === 'tunai'}
	      	<Input placeholder="Catatan" bind:value={form.catatan} style="width: 400px;" />
	    {/if}
	</div>
	<div class="buttons">
		<Button type="button" label="Tambah Metode" />
	</div>
</div>