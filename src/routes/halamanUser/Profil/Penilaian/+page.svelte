<script>
	import icon from '$lib/images/logo.png';
	import profil from '$lib/images/profil-logo.png';
	import location from '$lib/images/location.png';
	import star from '$lib/images/star-review.png';
	import laundry from '$lib/images/laundry-pict.png';
	import category1 from '$lib/images/cuci-setrika.png';
	import category2 from '$lib/images/cuci-kering.png';
	import category3 from '$lib/images/setrika.png';
	import arrowLeft from '$lib/images/left-arrow.png';
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
		<div class="header" style="align-items: center;">
			<div class="title-center">
		      <a href="/halamanUser/Profil">
		        <img src="{arrowLeft}" alt="back" class="back-arrow" />
		      </a>
		      Penilaian Saya
		    </div>
		</div>
		<br>
		<div class="content">
			<div class="card-info-border">
				<div class="card-row">
					<div>
						<div class="card-title">Plaza Laundry</div>
						<div class="card-caption">Cepat dan rapi</div>
						<div class="card-caption-color">Setrika</div>
					</div>
					<div>
						
					</div>
					<div>
						<div class="card-review">
							<img src="{star}">
							<img src="{star}">
							<img src="{star}">
							<img src="{star}">
							<img src="{star}">
						</div><br>
						<div class="card-caption">1 Agustus 2023</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>