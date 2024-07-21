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
	    categoryTypes: 'Cuci Setrika Reguler',
	    harga: '5000',
	    keterangan: 'Lama Pengerjaan 3 Hari'
	};

  const dispatch = createEventDispatcher();

  let categoryTypes = [
    { label: 'Cuci Kering', value: 'cuci_kering' },
    { label: 'Cuci Setrika Reguler', value: 'cuci_setrika_reguler' },
    { label: 'Cuci Setrika Kilat', value: 'cuci_setrika_kilat' },
    { label: 'Cuci Bed Cover dan Selimut', value: 'cuci_bedcover_selimut' },
    { label: 'Setrika', value: 'tunai' }
  ];

  function handleSubmit() {

  }
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="container">
	<div class="card-row">
		<div class="title">Edit Kategori</div>
	</div>
	<br>
	<div>
	    <Input type="text" placeholder="Kategori" bind:value={form.categoryTypes} disabled={true} style="width: 400px;" />
      <Input type="text" placeholder="Harga Kiloan" bind:value={form.harga} style="width: 400px;" />
			<Input type="text" placeholder="Keterangan Kategori" bind:value={form.keterangan} style="width: 400px;" />
	</div>
	<div class="buttons">
		<Button type="button" label="Simpan Kategori" />
	</div>
</div>