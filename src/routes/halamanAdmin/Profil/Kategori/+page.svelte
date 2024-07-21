<script>
	import icon from '$lib/images/logo.png';
	import logo from '$lib/images/logo-admin.png';
	import profil from '$lib/images/profil-logo.png';
	import laundry from '$lib/images/laundry-pict.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
	import edit from '$lib/images/edit.png';
	import hapus from '$lib/images/delete.png';
	import ApiController from '../../../ApiController.js';
	import '@fontsource/montserrat';
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="header">
		<img src="{logo}" class="logo">
		<img src="{profil}">
	</div>
	<div class="scrollable"><br>
		<div class="card-row">
			<div class="title">Kategori</div>
			<a href="/halamanAdmin/Profil/Kategori/TambahKategori"><div class="sub-title">Tambah</div></a>
		</div>
		<div class="card-info-border">
			<div class="card-row">
				<div>
					<div class="card-row-spaceless">
						<img src="{category1}" class="icon-border">
						<div>
							<div class="card-title">Cuci Setrika Reguler</div>
							<div class="card-caption">Rp 5.000/kg</div>
							<div class="card-caption">Lama Pengerjaan 3 Hari</div>
						</div>
					</div>
				</div>
				<div>
					<div class="card-review" style="margin-top: 20px;">
						<a href="/halamanAdmin/Profil/Kategori/EditKategori"><img src="{edit}" class="search"></a>
						<img src="{hapus}" class="search">
					</div>
				</div>
			</div>
		</div>

	</div>
	<br><br><br>
</div>