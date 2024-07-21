<script>
	import icon from '$lib/images/logo.png';
	import logo from '$lib/images/logo-user.png';
	import profil from '$lib/images/profil-logo.png';
	import location from '$lib/images/location.png';
	import laundry from '$lib/images/laundry-pict.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
	import category3 from '$lib/images/setrika.png';
	import minus from '$lib/images/minus.png';
	import plus from '$lib/images/plus.png';
	import star from '$lib/images/star-review.png';
	import BottomButton from '$lib/components/bottomButton.svelte';
	import ApiController from '../../ApiController.js'
	import '@fontsource/montserrat';
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="header">
		<img src="{logo}" class="logoUser">
		<img src="{profil}">
	</div>
	<div class="scrollable">
		<div class="card-info">
			<div class="card-row">
				<img src="{laundry}" class="pict">
				<div>
					<div class="card-title colored">Plaza Laundry</div>
					<div class="card-caption">Jl. Budi Sari no 12</div>
					<div class="laundry-col">
						<div class="card-sub colored">Buka</div>
					  	<div class="laundry-col">
					  		<img src="{star}">
					  		<div class="laundry-subtitle colored">4,8</div>
					  	</div>
					</div>
				</div>
				<div>
					<div class="laundry-col">
				    	<img src="{location}" alt="Location Icon" class="icon" />
				    	<div class="laundry-subtitle colored">0.8km</div>
				  	</div>
					<div class="card-sub colored">300 Pesanan</div>
				</div>
			</div>
		</div>
		<div class="card-info-white">
			<div class="card-row-spaceless">
				<img src="{category2}" class="icon-border">
				<div class="space-style">
					<div class="card-title">Cuci Kering</div>
					<div class="card-caption">Rp 5.000/kg</div>
				</div>
				<div class="quantity-controls">
			      <img src="{minus}" class="spacing control-icon">
			      <div class="quantity">1</div>
			      <img src="{plus}" class="spacing control-icon">
			    </div>
			</div>
		</div>
		<div class="card-info-white">
			<div class="card-row-spaceless">
				<img src="{category1}" class="icon-border">
				<div class="space-style">
					<div class="card-title">Cuci Setrika</div>
					<div class="card-caption">Rp 5.000/kg</div>
				</div>
				<div class="quantity-controls">
			      <img src="{minus}" class="spacing control-icon">
			      <div class="quantity">1</div>
			      <img src="{plus}" class="spacing control-icon">
			    </div>
			</div>
		</div>
		<div class="card-info-white">
			<div class="card-row-spaceless">
				<img src="{category3}" class="icon-border">
				<div class="space-style">
					<div class="card-title">Setrika</div>
					<div class="card-caption">Rp 5.000/kg</div>
				</div>
				<div class="quantity-controls">
			      <img src="{minus}" class="spacing control-icon">
			      <div class="quantity">1</div>
			      <img src="{plus}" class="spacing control-icon">
			    </div>
			</div>
		</div>
		<div class="card-row">
			<div class="title">Penilaian</div>
			<div class="sub-title">Lihat Semua</div>
		</div>
		<div class="card-info-white">
			<div class="card-row">
				<div>
					<div class="card-title">Af*******</div>
					<div class="card-caption">Cepat dan rapi</div>
					<div class="card-caption-color">Setrika</div>
				</div>
				<div>
					<div class="card-caption">1 Agustus 2023</div>
				</div>
				<div>
					<div class="card-review">
						<img src="{star}">
						<img src="{star}">
						<img src="{star}">
						<img src="{star}">
						<img src="{star}">
					</div>
				</div>
			</div>
		</div>
	</div>
	<br><br><br>
	<BottomButton label="Pesan" />
</div>