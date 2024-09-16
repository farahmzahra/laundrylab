<script>
    import { onMount } from 'svelte';
    import logo from '$lib/images/logo-user.png';
    import location from '$lib/images/location.png';
    import star from '$lib/images/star-review.png';
    import disableStar from '$lib/images/gray-star.png';
    import category1 from '$lib/images/cuci-kering.png';
    import category2 from '$lib/images/cuci-setrika-reg.png';
    import category3 from '$lib/images/cuci-setrika-kilat.png';
    import category4 from '$lib/images/cuci-selimut.png';
    import category5 from '$lib/images/setrika.png';
    import category6 from '$lib/images/cuci-lainnya.png';
    import ApiController from '../../ApiController.js';
    import UserNavbar from '../../UserNavbar.svelte';
    import arrowLeft from '$lib/images/left-arrow.png';
    import arrowRight from '$lib/images/right-arrow.png';
    import '@fontsource/montserrat';

    let dataAddresses = [];
    let searchResults = [];
    let nearestLaundries = [];
    let allLaundries = [];
    let allRates = [];
    let selectedAddress = '';
    let searched = false;
    let selectedLatitude = 0;
    let selectedLongitude = 0;
    let sumRates = {};

    let alamatExists = false;
    let jamExists = false;
    let kategoriExists = false;
    let categories = [];
    let filteredLaundries = [];
    let displayedLaundries = [];
    let showAllLaundries = false;
    let loadMoreLimit = 5;
    let totalLaundries = 0;
    let scrollNumber = 0;

    onMount(async () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAlamat/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const users = response.data.users;
                dataAddresses = users.filter(user => user.emailUser === email);
            } else {
                console.error('Failed to fetch users:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getLaundries`,
                token: token
            });

            if (response && response.data && response.data.success) {
                allLaundries = response.data.laundries;
                filteredLaundries = allLaundries;
                totalLaundries = filteredLaundries.length;
                displayedLaundries = filteredLaundries.slice(0, loadMoreLimit);
            } else {
                console.error('Failed to fetch laundries:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching laundries:', error);
        }

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAllPenilaian/${email}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                allRates = response.data.rates;
            } else {
                console.error('Failed to fetch rates:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching rates:', error);
        }

        fetchLaundries();

    });

    async function searchLaundry(query) {
        const token = localStorage.getItem("token");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAdminSearch/${query}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                searchResults = response.data.admin;
                searched = true;
                console.log('Search results:', searchResults);
            } else {
                console.error('Failed to fetch admin:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching admin:', error);
        }
    }

    async function getLongLatForAddress() {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getLongLatUser/${email}/${selectedAddress}`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const user = response.data.users[0];
                selectedLatitude = user.latitudeUser;
                selectedLongitude = user.longitudeUser;
            } else {
                console.error('Failed to fetch latitude and longitude:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching latitude and longitude:', error);
        }
    }

    async function showNearestLaundries() {
        await getLongLatForAddress();

        const token = localStorage.getItem("token");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAllLaundries`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const laundries = response.data.laundries;
                const radius = 10;

                if (Array.isArray(laundries)) {
                    nearestLaundries = laundries
                        .map(laundry => {
                            const distance = haversine(selectedLatitude, selectedLongitude, laundry.latitudeLaundry, laundry.longitudeLaundry);
                            return {
                                ...laundry,
                                distance
                            };
                        })
                        .filter(laundry => laundry.distance <= radius);

                    nearestLaundries.sort((a, b) => a.distance - b.distance);
                } else {
                    console.error('Laundries data is not an array:', laundries);
                }
            } else {
                console.error('Failed to fetch laundries:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching laundries:', error);
        }
    }

    function haversine(lat1, lon1, lat2, lon2) {
        const toRadians = (angle) => angle * (Math.PI / 180);
        const R = 6371;
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLon / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    $: if (selectedAddress) {
        showNearestLaundries();
    }

    function loadAllLaundries() {
        displayedLaundries = filteredLaundries;
        showAllLaundries = true;
    }

    function handleClick(event, email) {
        console.log('Clicked Laundry Email:', email);
    }

    function handleClickKat(event, categoryType) {
        console.log('Clicked Category:', categoryType);
    }

    function getNamaLaundry(email) {
        const laundry = allLaundries.find(user => user.email === email);
        return laundry ? laundry.namaLaundry : '';
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

    async function fetchLaundries() {
        const token = localStorage.getItem("token");

        try {
            const response = await ApiController({
                method: 'GET',
                endpoint: `getAllLaundries`,
                token: token
            });

            if (response && response.data && response.data.success) {
                const laundries = response.data.laundries;

                for (const laundry of laundries) {
                    sumRates[laundry.email] = await generateSumRate(laundry.email);
                }

                console.log(laundries);
            } else {
                console.error('Failed to fetch laundries:', response ? response.data.error : 'No response from server');
                console.log(response.data.laundries);
            }
        } catch (error) {
            console.error('Error fetching laundries:', error);
        }
    }
</script>

<svelte:head>
    <title>LaundryLab</title>
    <meta name="description" content="Halaman Beranda" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
    <div class="header">
        <img src="{logo}" class="logoUser" alt="Logo User">
    </div>
    <div class="scrollable">
        <br>
        <div>
            <input type="text" placeholder="Cari Laundry" on:input="{(e) => searchLaundry(e.target.value)}" style="width: 410px" id="search">
        </div>
        <div class="card-row">
            <div class="title">Kategori</div>
            <div class="card-row-end">
                <div class="next-previous-button">
                   <img src="{arrowLeft}" class="icon-next-previous-backless" alt="arrow1" on:click={() => {
                        let scrollElem = document.getElementById("scrollKat");
                        if (scrollNumber > 0) {
                             scrollNumber -= 100; // Decrease scrollNumber to move left
                             console.log(scrollNumber)
                             scrollElem.scrollBy({
                                left: -100, // Adjust the scroll amount
                                behavior: 'smooth' // Optional: Adds smooth scrolling
                            });
                        }
                    }}>
                    <img src="{arrowRight}" class="icon-next-previous-backless" alt="arrow2" on:click={() => {
                        let scrollElem = document.getElementById("scrollKat");
                        scrollNumber += 100; // Increase scrollNumber to move right
                        console.log(scrollNumber)
                        scrollElem.scrollBy({
                            left: 100, // Adjust the scroll amount
                            behavior: 'smooth' // Optional: Adds smooth scrolling
                        });
                    }}>
                </div>
            </div>
        </div>
        <div class="scrollable-x" id="scrollKat">
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
        {#if searched}
        <div class="card-row">
            <div class="title">Hasil Pencarian</div>
        </div><br>
        <div class="scrollable-x">
            <div class="laundry-list">
                {#if searchResults.length > 0}
                    {#each searchResults as result}
                        <div>
                            <a sveltekit:prefetch href="{`/halamanUser/Beranda/DetailLaundry/${result.email}`}" on:click={(event) => handleClick(event, result.email)}>
                                <div class="laundry-card">
                                    <div class="laundry-image-container">
                                        <img src={result.profilPict} alt="{result.namaLaundry}" class="laundry-image">
                                    </div>
                                    <div class="laundry-title">{result.namaLaundry}</div>
                                    <div class="laundry-col">
                                        <div class="laundry-subtitle">{result.alamat}</div>
                                    </div>
                                    <div class="laundry-col">
                                        <!-- <a href="" class="sub-title">{result.bukaTutupLaundry}</a> -->
                                        {#if result.bukaTutupLaundry === "Buka"}
                                            <a href="" class="sub-title">{result.bukaTutupLaundry}</a>
                                        {:else}
                                            <a href="" class="sub-title" style="color: red;">{result.bukaTutupLaundry}</a>
                                        {/if}
                                        <div class="laundry-col">
                                            <img src="{star}" class="img-icon-star" alt="Star 1">
                                            <div class="laundry-subtitle">{sumRates[result.email]?.toFixed(1) || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    {/each}
                {:else}
                    <p>Tidak ada hasil yang ditemukan</p>
                {/if}
            </div>
        </div>
        {/if}
        <div class="card-row center-all">
            <div class="title">Laundry Terdekat</div>
             {#if dataAddresses.length > 0}
                <div class="location-container">
                    <select bind:value={selectedAddress} class="location-button" id="location">
                        <option value="" disabled selected>Pilih Alamat</option>
                        {#each dataAddresses as address}
                            <option value="{address.idAlamat}">{address.alamat}</option>
                        {/each}
                    </select>
                </div>
            {:else}
                <p>Isi data alamat di Menu Profil!</p>
            {/if}
        </div><br>
        {#if nearestLaundries.length > 0}
            <div class="card-row-end">
                <div class="next-previous-button">
                   <img src="{arrowLeft}" class="icon-next-previous-backless" alt="arrow3" on:click={() => {
                        let scrollElem = document.getElementById("scrollByDistance");
                        if (scrollNumber > 0) {
                             scrollNumber -= 100; // Decrease scrollNumber to move left
                             console.log(scrollNumber)
                             scrollElem.scrollBy({
                                left: -100, // Adjust the scroll amount
                                behavior: 'smooth' // Optional: Adds smooth scrolling
                            });
                        }
                    }}>
                    <img src="{arrowRight}" class="icon-next-previous-backless" alt="arrow4" on:click={() => {
                        let scrollElem = document.getElementById("scrollByDistance");
                        scrollNumber += 100; // Increase scrollNumber to move right
                        console.log(scrollNumber)
                        scrollElem.scrollBy({
                            left: 100, // Adjust the scroll amount
                            behavior: 'smooth' // Optional: Adds smooth scrolling
                        });
                    }}>
                </div>
            </div>
            <div class="scrollable-x" id="scrollByDistance">
                <div class="laundry-list ">
                    {#each nearestLaundries as laundry}
                        <a sveltekit:prefetch href="{`/halamanUser/Beranda/DetailLaundry/${laundry.email}`}" on:click={(event) => handleClick(event, laundry.email)}>
                            <div class="laundry-card">
                                <div class="laundry-image-container">
                                    <img src={laundry.profilPict} alt="{laundry.namaLaundry}" class="laundry-image">
                                </div>
                                <div class="laundry-title">{laundry.namaLaundry}</div>
                                <div class="laundry-col">
                                    <div class="laundry-subtitle">{laundry.alamat}</div>
                                    <div class="laundry-col">
                                        <img src="{location}" alt="Location Icon" class="icon" />
                                        <div class="laundry-subtitle">{laundry.distance.toFixed(2)} km</div>
                                    </div>                    
                                </div>
                                <div class="laundry-col">
                                    <!-- <a href="" class="sub-title">{laundry.bukaTutupLaundry}</a> -->
                                    {#if laundry.bukaTutupLaundry === "Buka"}
                                        <a href="" class="sub-title">{laundry.bukaTutupLaundry}</a>
                                    {:else}
                                        <a href="" class="sub-title" style="color: red;">{laundry.bukaTutupLaundry}</a>
                                    {/if}
                                    <div class="laundry-col">
                                        <img src="{star}" class="img-icon-star" alt="Star 2">
                                        <div class="laundry-subtitle">{sumRates[laundry.email]?.toFixed(1) || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    {/each} 
                </div>
            </div>
        {:else}
            <div class="centered-items">
                <p>Silahkan pilih alamat terlebih dahulu!</p>
            </div>
        {/if}
        <br>
        <div class="card-row">
            <div class="title">Semua Laundry</div>
            <a href="#" on:click="{loadAllLaundries}" class="sub-title">Lihat Semua</a>
        </div><br>
        <div class="card-row-end">
            <div class="next-previous-button">
               <img src="{arrowLeft}" class="icon-next-previous-backless" alt="arrow5" on:click={() => {
                    let scrollElem = document.getElementById("scroll");
                    if (scrollNumber > 0) {
                         scrollNumber -= 100; // Decrease scrollNumber to move left
                         console.log(scrollNumber)
                         scrollElem.scrollBy({
                            left: -100, // Adjust the scroll amount
                            behavior: 'smooth' // Optional: Adds smooth scrolling
                        });
                    }
                }}>
                <img src="{arrowRight}" class="icon-next-previous-backless" alt="arrow6" on:click={() => {
                    let scrollElem = document.getElementById("scroll");
                    scrollNumber += 100; // Increase scrollNumber to move right
                    console.log(scrollNumber)
                    scrollElem.scrollBy({
                        left: 100, // Adjust the scroll amount
                        behavior: 'smooth' // Optional: Adds smooth scrolling
                    });
                }}>
            </div>
        </div>
        <div class="scrollable-x" id="scroll">
		    <div class="laundry-list">
            {#if displayedLaundries.length > 0}
		        {#each displayedLaundries as laundry}
		        <a sveltekit:prefetch href="{`/halamanUser/Beranda/DetailLaundry/${laundry.email}`}" on:click={(event) => handleClick(event, laundry.email)}>
		            <div class="laundry-card">
		                <div class="laundry-image-container">
                            <img src={laundry.profilPict} alt="{laundry.namaLaundry}" class="laundry-image">
		                </div>
		                <div class="laundry-title">{laundry.namaLaundry}</div>
		                <div class="laundry-col">
		                    <div class="laundry-subtitle">{laundry.alamat}</div>
		                </div>
		                <div class="laundry-col">
                            {#if laundry.bukaTutupLaundry === "Buka"}
                                <a href="" class="sub-title">{laundry.bukaTutupLaundry}</a>
                            {:else}
                                <a href="" class="sub-title" style="color: red;">{laundry.bukaTutupLaundry}</a>
                            {/if}
		                    <div class="laundry-col">
		                        <img src="{star}" class="img-icon-star" alt="Star 3">
		                        <div class="laundry-subtitle">{sumRates[laundry.email]?.toFixed(1) || 'N/A'}</div>
		                    </div>
		                </div>
		            </div>
		        </a>
		        {/each}
            {:else}
                <p>Belum ada Data</p>
            {/if}
		    </div>
		</div><br>
        <div class="card-row">
            <div class="title">Penilaian</div>
            <div class="card-row-end">
                <div class="next-previous-button">
                   <img src="{arrowLeft}" class="icon-next-previous-backless" alt="arrow7" on:click={() => {
                        let scrollElem = document.getElementById("scrollRate");
                        if (scrollNumber > 0) {
                             scrollNumber -= 100; // Decrease scrollNumber to move left
                             console.log(scrollNumber)
                             scrollElem.scrollBy({
                                left: -100, // Adjust the scroll amount
                                behavior: 'smooth' // Optional: Adds smooth scrolling
                            });
                        }
                    }}>
                    <img src="{arrowRight}" class="icon-next-previous-backless" alt="arrow8" on:click={() => {
                        let scrollElem = document.getElementById("scrollRate");
                        scrollNumber += 100; // Increase scrollNumber to move right
                        console.log(scrollNumber)
                        scrollElem.scrollBy({
                            left: 100, // Adjust the scroll amount
                            behavior: 'smooth' // Optional: Adds smooth scrolling
                        });
                    }}>
                </div>
            </div>
        </div>
        <div class="scrollable-x" id="scrollRate">
            <div class="laundry-list">
                {#if allRates.length > 0}
                    {#each allRates as rate}
                    <div class="card-info-border">
                        <div class="card-row">
                            <div>
                                <div class="card-title">Ulasanmu untuk {getNamaLaundry(rate.emailLaundry)}</div>
                                <div class="card-caption-bigger">"{rate.ulasan}"</div>
                            </div>
                            <div>
                                <div class="card-review">
                                    {#each { length: 5 } as _, i}
                                        <img src="{i < rate.rate ? star : disableStar}" alt="Star 4" class="img-icon-star">
                                    {/each}
                                </div><br>
                                <div class="card-caption">{rate.tanggal}</div>
                            </div>
                        </div>
                    </div>
                    {/each}
                {:else}
                    <p>Belum ada Data</p>
                {/if}
            </div>
        </div>
    </div>
    <br><br><br>
    <UserNavbar />
</div>