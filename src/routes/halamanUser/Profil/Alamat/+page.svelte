<script>
	import icon from '$lib/images/logo.png';
	import profil from '$lib/images/profil-logo.png';
	import location from '$lib/images/location.png';
	import laundry from '$lib/images/laundry-pict.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
	import category3 from '$lib/images/setrika.png';
	import arrow from '$lib/images/down-arrow.png';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../../../ApiController.js';
	import '@fontsource/montserrat';
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="scrollable">
		<div class="title-center">Alamat</div><br>
		<div class="card-row">
			<a href="/halamanUser/Profil/Alamat/TambahAlamat">
				<Button type="button" label="Tambah Alamat" />
			</a>
		</div>
		<div class="content">
			<div class="card-info-border">
				<div class="card-row-spaceless">
					<div class="space-style">
						<div class="card-title">Farah | 08123456789</div>
					</div>
					<div class="space-style">
						<div class="card-caption"></div>
					</div>
				</div>
				<div class="card-row-spaceless">
		            <div class="space-style">
		                <div class="card-caption" style="text-align: left;">Jl. Gurami Raya F 2 Limbungan Baru, Rumbai Jl. Gurami Raya F 2 Limbungan Baru, Rumbai</div>
		            </div>
		            <div class="space-style">
		                <div class="card-title-secondary" style="text-align: right;"><a href="#">Ubah</a></div>
		                <div class="card-title-secondary" style="text-align: right;"><a href="#">Hapus</a></div>
		            </div>
		        </div>
			</div>
			<div class="card-info-border">
				<div class="card-row-spaceless">
					<div class="space-style">
						<div class="card-title">Farah | 08123456789</div>
					</div>
					<div class="space-style">
						<div class="card-caption"></div>
					</div>
				</div>
				<div class="card-row-spaceless">
		            <div class="space-style">
		                <div class="card-caption" style="text-align: left;">Jl. Gurami Raya F 2 Limbungan Baru, Rumbai Jl. Gurami Raya F 2 Limbungan Baru, Rumbai</div>
		            </div>
		            <div class="space-style">
		                <div class="card-title-secondary" style="text-align: right;"><a href="#">Ubah</a></div>
		                <div class="card-title-secondary" style="text-align: right;"><a href="#">Hapus</a></div>
		            </div>
		        </div>
			</div>
		</div>
	</div>
</div>