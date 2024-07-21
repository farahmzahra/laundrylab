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

    let startDate = "";
    let endDate = "";
    let revenue = "Rp3.500.000";
    let chart;
    let chartData = [200000, 300000, 450000, 600000, 500000, 700000, 900000, 800000, 650000, 500000, 200000, 300000, 450000, 600000, 500000, 700000, 900000, 800000, 650000, 500000, 200000, 300000, 450000, 600000, 500000, 700000, 900000, 800000, 650000, 500000, 200000, 300000, 450000, 600000, 500000, 700000, 900000, 800000, 650000, 500000, 200000, 300000, 450000, 600000, 500000, 700000, 900000, 800000, 650000, 500000];

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
                let allOrder = response.data.orders;
                for (var i = allOrder.length - 1; i >= 0; i--) {
                    allOrder[i].totalBayar
                }
              } else {
                console.error('Failed to fetch order:', response ? response.data.error : 'No response from server');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }

        flatpickr("#startDate", {
            dateFormat: "d M Y",
            onChange: (selectedDates) => {
                startDate = selectedDates[0].toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            }
        });

        flatpickr("#endDate", {
            dateFormat: "d M Y",
            onChange: (selectedDates) => {
                endDate = selectedDates[0].toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
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

    function printPDF() {
        if (!startDate || !endDate) {
            alert('Pilih Tanggal Terlebih Dahulu');
            return;
        }

        const doc = new jsPDF();

        doc.text(`Start Date: ${startDate}`, 10, 10);
        doc.text(`End Date: ${endDate}`, 10, 20);
        doc.text(`Total Accumulated Income: ${revenue}`, 10, 30);

        const canvas = document.getElementById('revenueChart');
        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.src = url;
            img.onload = function () {
                doc.addImage(img, 'JPEG', 10, 40, 180, 100);

                const filename = `Laporan_${startDate.replace(/[^a-zA-Z0-9]/g, '')}_to_${endDate.replace(/[^a-zA-Z0-9]/g, '')}.pdf`;

                doc.save(filename);
            };
        });
    }
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
    </div><br>
    <div class="report-header">Laporan</div>
    <div class="card-row-spaceless">
         <div class="space-style">
            <Input type="text" id="startDate" placeholder="Start Date" readonly bind:value={startDate} style="width: 150px; margin-right: 20px;" />
        </div>
        <div class="space-style">
            <Input type="text" id="endDate" placeholder="End Date" readonly bind:value={endDate}  style="width: 150px;" />
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
            const orderDate = new Date(order.statusPesanan[0].tanggal);
            return orderDate >= start && orderDate <= end;
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
            <Input type="text" id="startDate" placeholder="Start Date" readonly bind:value={startDate} style="width: 150px; margin-right: 20px;" />
        </div>
        <div class="space-style">
            <Input type="text" id="endDate" placeholder="End Date" readonly bind:value={endDate}  style="width: 150px;" />
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
</div>