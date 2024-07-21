<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import Input from '$lib/components/input.svelte';
  import Button from '$lib/components/button.svelte';

  export let form = {
    alamat: '',
    kelurahan: '',
    kecamatan: '',
    kodePos: '',
    detailAlamat: '',
    longitudeLaundry: null,
    latitudeLaundry: null
  };

  const dispatch = createEventDispatcher();

  mapboxgl.accessToken = "pk.eyJ1IjoiZmFyYWhtemFocmEiLCJhIjoiY2x4cTFscW01MHZzdjJsb2owNzJtNG5xNCJ9.J0P94XoITm4n3dBWjs4udA";

  let map;
  let marker;

  onMount(() => {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [101.4421451952098, 0.5629111224534288],
      zoom: 14
    });

    map.on('click', (e) => {
      const coords = e.lngLat;
      if (marker) {
        marker.setLngLat(coords);
      } else {
        marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
      }
      form.latitudeLaundry = coords.lat.toFixed(6);
      form.longitudeLaundry = coords.lng.toFixed(6);
      console.log('Selected coordinates:', coords);
    });
  });

  function closePopup() {
    dispatch('close');
  }

  async function saveChanges() {
    dispatch('save', { ...form});
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
    <h2>Tambah Alamat</h2>
    <div id="map"></div>
    <div class="centered-items">
      <Input type="text" placeholder="Alamat" bind:value={form.alamat} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Kelurahan" bind:value={form.kelurahan} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Kecamatan" bind:value={form.kecamatan} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Kode Pos" bind:value={form.kodePos} />
    </div>
    <div class="centered-items">
      <Input type="text" placeholder="Detail Alamat" bind:value={form.detailAlamat} />
    </div>
    <input type="hidden" bind:value={form.longitudeLaundry} />
    <input type="hidden" bind:value={form.latitudeLaundry} />
    <div class="centered-items">
      <Button type="button" label="Batal" on:click={closePopup} />
      <Button type="button" label="Simpan" on:click={saveChanges} />
    </div>
  </div>
</div>
