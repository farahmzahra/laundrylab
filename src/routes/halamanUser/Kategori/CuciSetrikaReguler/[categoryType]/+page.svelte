<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
	import icon from '$lib/images/logo.png';
	import logo from '$lib/images/logo-user.png';
	import profil from '$lib/images/profil-logo.png';
	import search from '$lib/images/search.png';
	import location from '$lib/images/location.png';
	import arrow from '$lib/images/down-arrow.png';
	import laundry from '$lib/images/laundry-pict.png'
	import line from '$lib/images/line.png';
	import plus from '$lib/images/plus-symbol.png';
	import category1 from '$lib/images/cuci-kering.png';
    import category2 from '$lib/images/cuci-setrika-reg.png';
    import category3 from '$lib/images/cuci-setrika-kilat.png';
    import category4 from '$lib/images/cuci-selimut.png';
    import category5 from '$lib/images/setrika.png';
    import category6 from '$lib/images/cuci-lainnya.png';
	import star from '$lib/images/star-review.png';
	import Button from '$lib/components/button.svelte';
	import ApiController from '../../../../ApiController.js';
	import UserNavbar from '../../../../UserNavbar.svelte';
	import '@fontsource/montserrat';

	let allLaundries = [];
	let sumRates = {};

	$: categoryType = $page.params.categoryType;

	onMount(async () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getLaundriesByKat/${categoryType}`,
                token: token
            });

            console.log('API Response:', response);

            if (response && response.data && response.data.success) {
            	console.log(categoryType);
                allLaundries = response.data.laundries;
                for (const laundry of allLaundries) {
                    sumRates[laundry.email] = await generateSumRate(laundry.email);
                }
                console.log(allLaundries);
            } else {
                console.error('Failed to fetch admin:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching admin:', error);
        }
    });

    function handleClick(event, email) {
	    console.log('Clicked Laundry Email:', email);
	}

    function handleClickKat(event, categoryType) {
	    console.log('Clicked Category:', categoryType);
	}

	async function generateSumRate(email) {
        const token = localStorage.getItem("token");
        let sumRate = 0;
        let numberOfRates = 0;

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAllPenilaianByLaundry/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const rates = response.data.rates;
                sumRate = rates.reduce((total, rate) => {
                    return total + parseInt(rate.rate, 10);
                }, 0);
                numberOfRates = rates.length;
            } else {
                console.error('Failed to fetch rates:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching rates:', error);
        }

        return numberOfRates > 0 ? sumRate / numberOfRates : 0;
    }
</script>

<svelte:head>
	<title>LaundryLab</title>
	<meta name="description" content="Halaman Kategori Cuci Setrika Reguler" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
	<div class="header">
		<img src="{logo}" class="logoUser" alt="Logo User">
	</div>
	<div class="scrollable">
		<br>
		<div class="card-row">
			<div class="title">Kategori</div>
		</div>
		<div class="scrollable-x">
            <div class="card-row">
                <a sveltekit:prefetch href="/halamanUser/Kategori/CuciKering/cuci_kering" on:click={(event) => handleClickKat(event, 'cuci_kering')} class="category-card">
                    <img src="{category1}" class="img-icon-cat" alt="Kategori 1">
                    <div>
                        <div class="card-caption">Cuci Kering</div>
                    </div>
                </a>
                <a sveltekit:prefetch href="/halamanUser/Kategori/CuciSetrikaReguler/cuci_setrika_reguler" on:click={(event) => handleClickKat(event, 'cuci_setrika_reguler')} class="category-card">
                    <img src="{category2}" class="img-icon-cat" alt="Kategori 2">
                    <div>
                        <div class="card-caption">Cuci Setrika Reguler</div>
                    </div>
                </a>
                <a sveltekit:prefetch href="/halamanUser/Kategori/CuciSetrikaKilat/cuci_setrika_kilat" on:click={(event) => handleClickKat(event, 'cuci_setrika_kilat')} class="category-card">
                    <img src="{category3}" class="img-icon-cat" alt="Kategori 3">
                    <div>
                        <div class="card-caption">Cuci Setrika Kilat</div>
                    </div>
                </a>
                <a sveltekit:prefetch href="/halamanUser/Kategori/CuciSelimut/cuci_bedcover_selimut" on:click={(event) => handleClickKat(event, 'cuci_bedcover_selimut')} class="category-card">
                    <img src="{category4}" class="img-icon-cat" alt="Kategori 4">
                    <div>
                        <div class="card-caption">Cuci Bed Cover dan Selimut</div>
                    </div>
                </a>
                <a sveltekit:prefetch href="/halamanUser/Kategori/Setrika/setrika" on:click={(event) => handleClickKat(event, 'setrika')} class="category-card">
                    <img src="{category5}" class="img-icon-cat" alt="Kategori 5">
                    <div>
                        <div class="card-caption">Setrika</div>
                    </div>
                </a>
                <a sveltekit:prefetch href="/halamanUser/Kategori/CuciLainnya/lainnya" on:click={(event) => handleClickKat(event, 'lainnya')} class="category-card">
                    <img src="{category6}" class="img-icon-cat" alt="Kategori 6">
                    <div>
                        <div class="card-caption">Cuci Lainnya</div>
                    </div>
                </a>
            </div>
        </div>
        {#if allLaundries.length > 0}
	        {#each allLaundries as laundry}
	            <div class="card-info-border">
					<div class="card-row-spaceless">
						<img src={laundry.profilPict} class="img-icon-prof" alt="Profil" style="margin-right: 10px;">
						<a sveltekit:prefetch href="{`/halamanUser/Beranda/DetailLaundry/${laundry.email}`}" on:click={(event) => handleClick(event, laundry.email)}>
							<div>
								<div class="card-title">{laundry.namaLaundry}</div>
								<div class="card-caption">{laundry.alamat}</div>
								<div class="laundry-col">
									<a href="" class="sub-title">{laundry.bukaTutupLaundry}</a>
								  	<div class="laundry-col">
								  		<img src="{star}" class="img-icon-star" alt="star">
								  		<div class="laundry-subtitle">{sumRates[laundry.email]?.toFixed(1) || 'N/A'}</div>
								  	</div>
								</div>
							</div>
						</a>
						<img src="{line}" class="spacing" alt="Separator">
						<div>
							<div class="card-title">Cuci Setrika Reguler</div>
							<div class="card-caption">Rp. {laundry.harga}/kg</div>
							<div class="card-caption">Note: {laundry.keterangan}</div>
						</div>
					</div>
				</div>
	        {/each}
	    {:else}
            <p class="centered-items">Belum ada Data</p>
        {/if}
	</div>
	<br><br><br>
	<UserNavbar />
</div>