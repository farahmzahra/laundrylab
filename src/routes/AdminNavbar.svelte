<script>
	import { goto } from '$app/navigation';
	import berandaIcon from '$lib/images/beranda-symbol.png';
	import pesananIcon from '$lib/images/pesanan-symbol.png';
	import laporanIcon from '$lib/images/laporan-symbol.png';
	import profilIcon from '$lib/images/profil-symbol.png';
	import '@fontsource/montserrat';
</script>

<nav class="bottom-navbar">
	<ul class="nav-list">
		<li class="nav-item">
  			<a href="/halamanAdmin" class="nav-button">
      			<img src="{berandaIcon}" alt="Beranda">
      			<span class="nav-label">Beranda</span>
			</a>
  		</li>
  		<li class="nav-item">
  			<a href="/halamanAdmin/Pesanan" class="nav-button">
      			<img src="{pesananIcon}" alt="Pesanan">
      			<span class="nav-label">Pesanan</span>
			</a>
  		</li>
  		<li class="nav-item">
  			<a href="/halamanAdmin/Laporan" class="nav-button">
      			<img src="{laporanIcon}" alt="Laporan">
      			<span class="nav-label">Laporan</span>
			</a>
  		</li>
  		<li class="nav-item">
  			<a href="/halamanAdmin/Profil" class="nav-button">
      			<img src="{profilIcon}" alt="Profil">
      			<span class="nav-label">Profil</span>
			</a>
  		</li>
	</ul>
</nav>