<!-- <script>
    import { onMount } from "svelte";
    import flatpickr from "flatpickr";
    import "flatpickr/dist/flatpickr.css";
    import Chart from "chart.js/auto";
    import { jsPDF } from "jspdf";
    import logo from '$lib/images/logo-admin.png';
    import profil from '$lib/images/profil-logo.png';
    import AdminNavbar from '../../AdminNavbar.svelte';
    import Input from '$lib/components/input.svelte';
    import Button from '$lib/components/button.svelte';
    import ApiController from '../../ApiController.js';

    let startDate = null;
    let endDate = null;
    let revenue = "Rp0";
    let chart;
    let chartData = [];
    let allOrders = [];
    let orderDate = '';

    onMount(async () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPesananByEmailLaundry/${email}`, 
                token: token
            });

            if (response && response.data && response.data.success) {
                allOrders = response.data.orders;
                updateChartData();
              } else {
                console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
            }

            console.log(allOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }

        flatpickr("#startDate", {
            dateFormat: "d M Y",
            onChange: (selectedDates) => {
                startDate = selectedDates[0];
                updateChartData();
            }
        });

        flatpickr("#endDate", {
            dateFormat: "d M Y",
            onChange: (selectedDates) => {
                endDate = selectedDates[0];
                updateChartData();
            }
        });

        const ctx = document.getElementById("revenueChart").getContext("2d");
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: Array.from({ length: chartData.length }, (_, i) => i + 1),
                datasets: [{
                    label: "Pendapatan",
                    data: chartData,
                    borderColor: "red",
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: true, title: { display: true, text: "Hari" } },
                    y: { display: true, title: { display: true, text: "Pendapatan" } }
                }
            }
        });
    });

    function updateChartData() {
        if (!startDate || !endDate) {
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        let filteredOrders = allOrders.filter(order => {
            orderDate = new Date(order.statusPesanan[6].tanggal); //ini emang statusPesanan[0]?????????
            return orderDate >= start && orderDate <= end;

        console.log(orderDate);
        });

        let totalRevenue = 0;
        chartData = filteredOrders.map(order => {
            const totalBayar = parseInt(order.totalBayar);
            if (isNaN(totalBayar)) {
                return 0;
            }
            totalRevenue += totalBayar;
            return totalBayar;
        });

        revenue = `Rp${totalRevenue.toLocaleString('id-ID')}`;
        updateChart();
    }

    function updateChart() {
        if (chart) {
            chart.data.labels = Array.from({ length: chartData.length }, (_, i) => i + 1);
            chart.data.datasets[0].data = chartData;
            chart.update();
        }
    }

    function printPDF() {
        if (!startDate || !endDate) {
            alert('Pilih Tanggal Terlebih Dahulu');
            return;
        }

        // Ensure startDate and endDate are Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            alert('Invalid date selected');
            return;
        }

        const doc = new jsPDF();

        // doc.text(`Tanggal : ${start.toLocaleDateString('id-ID')}`, 10, 10);
        // doc.text(`End Date: ${end.toLocaleDateString('id-ID')}`, 10, 20);
        // doc.text(`Pendapatan Toko Laundry: ${revenue}`, 10, 30);

        const startDateString = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDateString = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        doc.text(`Tanggal yang dipilih:`, 10, 10);
        doc.text(`${startDateString} hingga ${endDateString}`, 10, 20);
        doc.text(`Pendapatan Toko Laundry: ${revenue}`, 10, 30);

        const canvas = document.getElementById('revenueChart');
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.src = url;
            img.onload = function () {
                doc.addImage(img, 'JPEG', 10, 40, 180, 100);

                const filename = `Laporan_${start.toLocaleDateString('id-ID')}_to_${end.toLocaleDateString('id-ID')}.pdf`;

                doc.save(filename);
            };
        });
    }
</script> -->

<!-- <script>
    import { onMount } from "svelte";
    import flatpickr from "flatpickr";
    import "flatpickr/dist/flatpickr.css";
    import Chart from "chart.js/auto";
    import { jsPDF } from "jspdf";
    import logo from '$lib/images/logo-admin.png';
    import profil from '$lib/images/profil-logo.png';
    import AdminNavbar from '../../AdminNavbar.svelte';
    import Input from '$lib/components/input.svelte';
    import Button from '$lib/components/button.svelte';
    import ApiController from '../../ApiController.js';

    let startDate = null;
    let endDate = null;
    let revenue = "Rp0";
    let chart;
    let chartData = [];
    let allOrders = [];
    let filteredOrders = [];
    let formattedOrders = [];

    onMount(async () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPesananByEmailLaundry/${email}`, 
                token: token
            });

            if (response && response.data && response.data.success) {
                allOrders = response.data.orders;
                updateChartData();
            } else {
                console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
            }

            console.log(allOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }

        flatpickr("#startDate", {
            dateFormat: "d M Y",
            onChange: (selectedDates) => {
                startDate = selectedDates[0];
                updateChartData();
            }
        });

        flatpickr("#endDate", {
            dateFormat: "d M Y",
            onChange: (selectedDates) => {
                endDate = selectedDates[0];
                updateChartData();
            }
        });

        const ctx = document.getElementById("revenueChart").getContext("2d");
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: Array.from({ length: chartData.length }, (_, i) => i + 1),
                datasets: [{
                    label: "Pendapatan",
                    data: chartData,
                    borderColor: "red",
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: true, title: { display: true, text: "Hari" } },
                    y: { display: true, title: { display: true, text: "Pendapatan" } }
                }
            }
        });
    });

    function updateChartData() {
        if (!startDate || !endDate) {
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredOrders = allOrders.filter(pesanan => {
            const statusAtIndex6 = pesanan.statusPesanan[6] || {}; // Ensure index [6] exists
            const isActive = statusAtIndex6.active === 'true'; // Check if 'active' is 'true'
            const orderDate = new Date(`${statusAtIndex6.tanggal} ${statusAtIndex6.waktu}`);
            const isRecent = orderDate >= start && orderDate <= end;

            // Include orders that are either not active or more recent than 1 month
            return !(
                isActive &&
                orderDate < new Date(new Date().setMonth(new Date().getMonth() - 1))
            ) && isRecent;
        });

        console.log(filteredOrders); // Log filtered orders to verify

        formattedOrders = filteredOrders.map(order => {
            const statusAtIndex6 = order.statusPesanan[6] || {}; // Ensure index [6] exists
            const tanggal = statusAtIndex6.tanggal ? new Date(statusAtIndex6.tanggal).toLocaleDateString('id-ID') : 'N/A';
            const items = order.pesanan.map(item => item.categoryType).join(', ');
            const totalBayar = parseInt(order.totalBayar) || 0;
            return {
                tanggal,
                items,
                berat: order.pesanan.reduce((sum, item) => sum + parseFloat(item.berat), 0) + ' kg',
                totalBayar: `Rp${totalBayar.toLocaleString('id-ID')}`
            };
        });

        let totalRevenue = 0;
        chartData = filteredOrders.map(order => {
            const totalBayar = parseInt(order.totalBayar);
            if (isNaN(totalBayar)) {
                return 0;
            }
            totalRevenue += totalBayar;
            return totalBayar;
        });

        revenue = `Rp${totalRevenue.toLocaleString('id-ID')}`;
        updateChart();
    }

    function updateChart() {
        if (chart) {
            chart.data.labels = Array.from({ length: chartData.length }, (_, i) => i + 1);
            chart.data.datasets[0].data = chartData;
            chart.update();
        }
    }

    function printPDF() {
        if (!startDate || !endDate) {
            alert('Pilih Tanggal Terlebih Dahulu');
            return;
        }

        // Ensure startDate and endDate are Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            alert('Invalid date selected');
            return;
        }

        const doc = new jsPDF();

        const startDateString = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDateString = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        doc.text(`Tanggal yang dipilih:`, 10, 10);
        doc.text(`${startDateString} hingga ${endDateString}`, 10, 20);
        doc.text(`Pendapatan Toko Laundry: ${revenue}`, 10, 30);

        let yOffset = 40;
        formattedOrders.forEach(order => {
            doc.text(`Pendapatan Tanggal: ${order.tanggal}`, 10, yOffset);
            yOffset += 10;
            doc.text(`- Pesanan: ${order.items}`, 10, yOffset);
            yOffset += 10;
            doc.text(`- Berat: ${order.berat}`, 10, yOffset);
            yOffset += 10;
            doc.text(`- Total Bayar: ${order.totalBayar}`, 10, yOffset);
            yOffset += 20; // Space between orders
        });

        const canvas = document.getElementById('revenueChart');
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.src = url;
            img.onload = function () {
                doc.addImage(img, 'JPEG', 10, yOffset, 180, 100);

                const filename = `Laporan_${start.toLocaleDateString('id-ID')}_to_${end.toLocaleDateString('id-ID')}.pdf`;

                doc.save(filename);
            };
        });
    }
</script>


<svelte:head>
    <title>LaundryLab</title>
    <meta name="description" content="Halaman Laporan" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
    <div class="header">
        <img src="{logo}" class="logo" alt="Logo Petugas">
        <img src="{profil}" alt="Profil">
    </div><br>
    <div class="report-header">Laporan</div>
    <div class="card-row-spaceless">
        <div class="space-style">
            <Input type="text" id="startDate" placeholder="Start Date" bind:value={startDate} style="width: 150px; margin-right: 20px;" />
        </div>
        <div class="space-style">
            <Input type="text" id="endDate" placeholder="End Date" bind:value={endDate}  style="width: 150px;" />
        </div>
    </div>
    <div class="report-revenue">Akumulasi Pendapatan<br>{revenue}</div>
    <div class="report-chart">
        <canvas id="revenueChart"></canvas>
    </div>
    <div class="centered-items">
        <Button label="Cetak PDF" on:click={printPDF} />
    </div>
    <AdminNavbar />
</div> -->

<script>
    import { onMount } from "svelte";
    import flatpickr from "flatpickr";
    import "flatpickr/dist/flatpickr.css";
    import Chart from "chart.js/auto";
    import { jsPDF } from "jspdf";
    import logo from '$lib/images/logo-admin.png';
    import profil from '$lib/images/profil-logo.png';
    import AdminNavbar from '../../AdminNavbar.svelte';
    import Input from '$lib/components/input.svelte';
    import Button from '$lib/components/button.svelte';
    import ApiController from '../../ApiController.js';

    let startDate = null;
    let endDate = null;
    let revenue = "Rp0";
    let chart;
    let chartData = [];
    let allOrders = [];
    let filteredOrders = [];
    let formattedOrders = [];
    const categoryMap = {
        'cuci_kering': 'Cuci Kering',
        'cuci_setrika_reguler': 'Cuci Setrika Reguler',
        'cuci_setrika_kilat': 'Cuci Setrika Kilat',
        'cuci_bedcover_selimut': 'Cuci Bed Cover dan Selimut',
        'setrika': 'Setrika',
        'lainnya': 'Cuci Lainnya'
    };

    onMount(async () => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        try {
            const response = await ApiController({ 
                method: 'GET', 
                endpoint: `getPesananByEmailLaundry/${email}`, 
                token: token
            });

            if (response && response.data && response.data.success) {
                allOrders = response.data.orders;
                updateChartData();
            } else {
                console.error('Failed to fetch orders:', response ? response.data.error : 'No response from server');
            }

            console.log(allOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }

        flatpickr("#startDate", {
            dateFormat: "d M Y",
            onChange: (selectedDates) => {
                startDate = selectedDates[0];
                updateChartData();
            }
        });

        flatpickr("#endDate", {
            dateFormat: "d M Y",
            onChange: (selectedDates) => {
                endDate = selectedDates[0];
                updateChartData();
            }
        });

        const ctx = document.getElementById("revenueChart").getContext("2d");
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: Array.from({ length: chartData.length }, (_, i) => i + 1),
                datasets: [{
                    label: "Pendapatan",
                    data: chartData,
                    borderColor: "red",
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { display: true, title: { display: true, text: "Hari" } },
                    y: { display: true, title: { display: true, text: "Pendapatan" } }
                }
            }
        });
    });

    function updateChartData() {
        if (!startDate || !endDate) {
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredOrders = allOrders.filter(pesanan => {
            const statusAtIndex6 = pesanan.statusPesanan[6] || {}; // Ensure index [6] exists
            const isActive = statusAtIndex6.active === 'true'; // Check if 'active' is 'true'
            const orderDate = new Date(`${statusAtIndex6.tanggal} ${statusAtIndex6.waktu}`);
            const isRecent = orderDate >= start && orderDate <= end;

            // Include orders that are either not active or more recent than 1 month
            return !(
                isActive &&
                orderDate < new Date(new Date().setMonth(new Date().getMonth() - 1))
            ) && isRecent;
        });

        console.log(filteredOrders); // Log filtered orders to verify

        // formattedOrders = filteredOrders.map(order => {
        //     const statusAtIndex6 = order.statusPesanan[6] || {}; // Ensure index [6] exists
        //     const tanggal = statusAtIndex6.tanggal ? new Date(statusAtIndex6.tanggal).toLocaleDateString('id-ID') : 'N/A';
        //     const items = order.pesanan.map(item => item.categoryType).join(', ');
        //     const totalBayar = parseInt(order.totalBayar) || 0;
        //     return {
        //         tanggal,
        //         items,
        //         berat: order.pesanan.reduce((sum, item) => sum + parseFloat(item.berat), 0) + ' kg',
        //         totalBayar: `Rp${totalBayar.toLocaleString('id-ID')}`
        //     };
        // });
        formattedOrders = filteredOrders.map(order => {
            const statusAtIndex6 = order.statusPesanan[6] || {}; // Ensure index [6] exists
            const tanggal = statusAtIndex6.tanggal ? new Date(statusAtIndex6.tanggal).toLocaleDateString('id-ID') : 'N/A';
            const items = order.pesanan.map(item => categoryMap[item.categoryType] || item.categoryType).join(', ');
            const totalBayar = parseInt(order.totalBayar) || 0;
            return {
                tanggal,
                items,
                berat: order.pesanan.reduce((sum, item) => sum + parseFloat(item.berat), 0) + ' kg',
                totalBayar: `Rp${totalBayar.toLocaleString('id-ID')}`
            };
        });

        let totalRevenue = 0;
        chartData = filteredOrders.map(order => {
            const totalBayar = parseInt(order.totalBayar);
            if (isNaN(totalBayar)) {
                return 0;
            }
            totalRevenue += totalBayar;
            return totalBayar;
        });

        revenue = `Rp${totalRevenue.toLocaleString('id-ID')}`;
        updateChart();
    }

    function updateChart() {
        if (chart) {
            chart.data.labels = Array.from({ length: chartData.length }, (_, i) => i + 1);
            chart.data.datasets[0].data = chartData;
            chart.update();
        }
    }

    function printPDF() {
        if (!startDate || !endDate) {
            alert('Pilih Tanggal Terlebih Dahulu');
            return;
        }

        // Ensure startDate and endDate are Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            alert('Invalid date selected');
            return;
        }

        const doc = new jsPDF();

        const startDateString = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDateString = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        let yOffset = 10;

        doc.text(`Tanggal yang dipilih:`, 10, yOffset);
        yOffset += 10;
        doc.text(`${startDateString} hingga ${endDateString}`, 10, yOffset);
        yOffset += 10;

        // Add the chart image
        const canvas = document.getElementById('revenueChart');
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.src = url;
            img.onload = function () {
                doc.addImage(img, 'JPEG', 10, yOffset, 180, 100);
                yOffset += 110; // Adjust offset for chart height and margin

                // Display revenue details after the chart
                doc.text(`Pendapatan Toko Laundry: ${revenue}`, 10, yOffset);
                yOffset += 10;

                formattedOrders.forEach(order => {
                    doc.text(`Pendapatan Tanggal: ${order.tanggal}`, 10, yOffset);
                    yOffset += 10;
                    doc.text(`- Pesanan: ${order.items}`, 10, yOffset);
                    yOffset += 10;
                    doc.text(`- Berat: ${order.berat}`, 10, yOffset);
                    yOffset += 10;
                    doc.text(`- Total Bayar: ${order.totalBayar}`, 10, yOffset);
                    yOffset += 20;
                });

                const filename = `Laporan_${start.toLocaleDateString('id-ID')}_to_${end.toLocaleDateString('id-ID')}.pdf`;
                doc.save(filename);
            };
        });
    }
</script>

<svelte:head>
    <title>LaundryLab</title>
    <meta name="description" content="Halaman Laporan" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<div class="card-container">
    <div class="header">
        <img src="{logo}" class="logo" alt="Logo Petugas">
        <img src="{profil}" alt="Profil">
    </div><br>
    <div class="report-header">Laporan</div>
    <div class="card-row-spaceless">
        <div class="space-style">
            <Input type="text" id="startDate" placeholder="Start Date" bind:value={startDate} style="width: 150px; margin-right: 20px;" />
        </div>
        <div class="space-style">
            <Input type="text" id="endDate" placeholder="End Date" bind:value={endDate}  style="width: 150px;" />
        </div>
    </div>
    <div class="report-revenue">Akumulasi Pendapatan<br>{revenue}</div>
    <div class="report-chart">
        <canvas id="revenueChart"></canvas>
    </div>
   <div class="centered-items">
        <Button label="Cetak PDF" on:click={printPDF} />
    </div>
    <div class="centered-items">
        {#if formattedOrders.length > 0}
            <div class="card-info-border centered-items">
              <div class="card-row centered-items">
                <div>
                  <div class="centered-items"></div>
                  {#each formattedOrders as { tanggal, items, berat, totalBayar }}
                      <div class="card-row-spaceless centered-items">
                        <div>
                          <div class="card-title centered-items">Pendapatan Tanggal: {tanggal}</div>
                            <div class="card-caption centered-items">Total Bayar: {totalBayar}</div>
                            <div class="card-caption centered-items">Dari kategori pesanan {items} dengan berat {berat}</div>
                        </div>
                      </div>
                    <div class="card-border"></div>
                  {/each}
                </div>
              </div>
            </div>
        {/if}
    </div>
    <br><br>
    <br><br>
    <AdminNavbar />
</div>