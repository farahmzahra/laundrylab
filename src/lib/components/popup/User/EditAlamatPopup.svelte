<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import Input from '$lib/components/input.svelte';
  import Button from '$lib/components/button.svelte';

  export let alamatForm = {
    alamat: '',
    kelurahan: '',
    kecamatan: '',
    kodePos: '',
    detailAlamat: '',
    longitudeUser: null,
    latitudeUser: null
  };

  mapboxgl.accessToken = "pk.eyJ1IjoiZmFyYWhtemFocmEiLCJhIjoiY2x4cTFscW01MHZzdjJsb2owNzJtNG5xNCJ9.J0P94XoITm4n3dBWjs4udA";

  const dispatch = createEventDispatcher();
  let map;
  let marker;
  let mapContainer;

  function initializeMap() {
    const defaultCenter = [101.4421451952098, 0.5629111224534288];
    const center = alamatForm.longitudeUser !== null && alamatForm.latitudeUser !== null
      ? [alamatForm.longitudeUser, alamatForm.latitudeUser]
      : defaultCenter;

    if (!map) {
      map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 14
      });

      map.on('click', (e) => {
        const coords = e.lngLat;
        if (marker) {
          marker.setLngLat(coords);
        } else {
          marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
        }
        alamatForm.latitudeUser = parseFloat(coords.lat.toFixed(6));
        alamatForm.longitudeUser = parseFloat(coords.lng.toFixed(6));
        console.log('Selected coordinates:', coords);
      });
    } else {
      map.setCenter(center);
      if (marker) {
        marker.setLngLat(center);
      } else {
        marker = new mapboxgl.Marker().setLngLat(center).addTo(map);
      }
    }
  }

  $: if (mapContainer && alamatForm.longitudeUser !== null && alamatForm.latitudeUser !== null) {
    initializeMap();
  }

  onMount(() => {
    initializeMap();
  });

  function closePopup() {
    dispatch('close');
  }

  async function saveChanges() {
    if (!alamatForm.alamat || !alamatForm.kelurahan || !alamatForm.kecamatan || !alamatForm.kodePos || !alamatForm.detailAlamat) {
        alert('Semua kolom harus terisi!');
        return;
    }
    
    dispatch('save', { ...alamatForm });
  }

  function handleKeyDown(event) {
    if (event.target.classList.contains('popup-overlay') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      closePopup();
    }
  }
</script>

<div class="popup-overlay" tabindex="0" role="button" aria-label="Close popup" on:click={closePopup} on:keydown={handleKeyDown}>
  <div class="popup" on:click|stopPropagation>
    <h2>Ubah Alamat</h2>
    <div id="map" bind:this={mapContainer} style="width: 100%; height: 200px;"></div>
    <div class="centered-items">
      <Input type="text" placeholder="Alamat" bind:value={alamatForm.alamat} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Kelurahan" bind:value={alamatForm.kelurahan} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Kecamatan" bind:value={alamatForm.kecamatan} />
    </div>
    <div class="centered-items">
      <Input type="number" placeholder="Kode Pos" bind:value={alamatForm.kodePos} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Detail Alamat" bind:value={alamatForm.detailAlamat} />
    </div>
    <input type="hidden" bind:value={alamatForm.longitudeUser} />
    <input type="hidden" bind:value={alamatForm.latitudeUser} />
    <div class="centered-items">
      <Button type="button" label="Batal" on:click={closePopup} />
      <Button type="button" label="Simpan" on:click={saveChanges} />
    </div>
  </div>
</div>

