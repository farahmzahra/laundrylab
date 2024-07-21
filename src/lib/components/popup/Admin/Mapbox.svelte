<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import mapboxgl from 'mapbox-gl';
  import Button from '$lib/components/button.svelte';

  export let latitude;
  export let longitude;

  const dispatch = createEventDispatcher();

  mapboxgl.accessToken = "pk.eyJ1IjoiZmFyYWhtemFocmEiLCJhIjoiY2x4cTFscW01MHZzdjJsb2owNzJtNG5xNCJ9.J0P94XoITm4n3dBWjs4udA";

  onMount(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 14
    });
    const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
  });

  function closePopup() {
    dispatch('close');
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
    <div id="map"></div>
    <div class="centered-items">
      <Button type="button" label="Close" on:click={closePopup} />
    </div>
  </div>
</div>