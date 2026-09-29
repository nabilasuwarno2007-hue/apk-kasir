let daftarBelanja = [];
let nomorTransaksiBerikutnya = Number(localStorage.getItem("nomorTransaksiBerikutnya")) || 1;
let totalBelanja = 0;

function formatRupiah(angka) {
    return angka.toLocaleString("id-ID");
}

function hapusBarang(tombol, subtotal, index){
    daftarBelanja.splice(index, 1);
    const baris = tombol.closest("tr");
    if (baris) {
        baris.remove();
    }
    totalBelanja -= subtotal;
    if (totalBelanja < 0) totalBelanja = 0;
    document.getElementById("total").innerText = totalBelanja;
}

function bayar() {
    const uangBayar = parseFloat(document.getElementById("bayar").value);

    if (isNaN(uangBayar)) {
        alert("Masukkan jumlah uang pembayaran!");
        return;
    }

    if (uangBayar < totalBelanja) {
        alert("Uang tidak cukup!");
        return;
    }

    const kembali = uangBayar - totalBelanja;

    document.getElementById("kembalian").innerText = kembali;

    let tanggalTransaksi = tanggal.toLocaleDateString("id-ID");
let jamTransaksi = tanggal.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
});

    const data = new FormData();

data.append("nomor_transaksi", nomorTransaksi);
data.append("tanggal", tanggal.toISOString().slice(0, 19).replace("T", " "));
data.append("total", totalBelanja);
data.append("bayar", uangBayar);
data.append("kembalian", kembali);

fetch("simpan_transaksi.php", {
    method: "POST",
    body: data
})
.then(response => response.text())
.then(hasil => {
    console.log(hasil);
})
.catch(error => {
    console.error("Error:", error);
});


    let daftarBarangStruk = "";

for (let barang of daftarBelanja) {
    daftarBarangStruk += `
    <p>
        ${barang.nama}<br>
        ${barang.jumlah} x Rp${formatRupiah(barang.harga)}
        = Rp${formatRupiah(barang.subtotal)}
    </p>
`;
}

let isiStruk = `
<!DOCTYPE html>
<html>
<head>
    <title>Struk</title>

    <style>
    body {
        font-family: monospace;
        width: 58mm;
        margin: 0 auto;
        font-size: 12px;
    }

    @media print {
        body {
            width: 58mm;
            margin: 0;
        }

        .print {
            display: none;
        }
    }

        h2 {
            text-align: center;
            margin-bottom: 5px;
        }

        p {
            margin: 5px 0;
        }

        .center {
            text-align: center;
        }

        .garis {
            border-top: 1px dashed black;
            margin: 10px 0;
        }

        .total {
            font-weight: bold;
        }

        .print {
            text-align: center;
            margin-top: 20px;
        }

        button {
            padding: 8px 20px;
            cursor: pointer;
        }
    </style>
</head>

<body>

    <h2>NABILA MART</h2>

    <p class="center">
        Jl. Raya loji tegalwaru karawang <br>
        Telp: 0819-4413-5659
    </p>

    <div class="garis"></div>

    <p>
    No Transaksi : ${nomorTransaksi}
    </p>

    <p>
        Kasir : Admin
    </p>

    <p>
    Tanggal : ${tanggalTransaksi}<br>
    Jam : ${jamTransaksi}
    </p>

    <div class="garis"></div>

    <p>Barang</p>

    ${daftarBarangStruk}
    
    <div class="garis"></div>

    <p class="total">
        TOTAL : Rp${formatRupiah(totalBelanja)}
    </p>

    <p>
        BAYAR : Rp${formatRupiah(uangBayar)}
    </p>

    <p>
        KEMBALI : Rp${formatRupiah(kembali)}
    </p>

    <div class="garis"></div>

    <p class="center">
        TERIMA KASIH
    </p>

    <div class="print">
        <button onclick="window.print()">Print</button>
    </div>

</body>
</html>
`;
    const struk = window.open("", "", "width=400,height=600");
    struk.document.write(isiStruk);
    struk.document.close();
    nomorTransaksiBerikutnya++;
    localStorage.setItem("nomorTransaksiBerikutnya", nomorTransaksiBerikutnya);
}

function tambahBarang() {
    const nama = document.getElementById("namaBarang").value.trim();
    const harga = parseFloat(document.getElementById("harga").value);
    const jumlah = parseInt(document.getElementById("jumlah").value, 10);

    if (nama === "") {
        alert("Nama barang harus diisi!");
        return;
    }

    if (isNaN(harga)) {
        alert("Harga harus diisi!");
        return;
    }

    if (isNaN(jumlah)) {
        alert("Jumlah harus diisi!");
        return;
    }

    if (harga <= 0) {
        alert("Harga harus lebih dari 0!");
        return;
    }

    if (jumlah <= 0) {
        alert("Jumlah harus lebih dari 0!");
        return;
    }

    let subtotal = harga * jumlah;
    const indexBarang = daftarBelanja.length;

    daftarBelanja.push({
        nama: nama,
        harga: harga,
        jumlah: jumlah,
        subtotal: subtotal
    });

    totalBelanja += subtotal;
    document.getElementById("total").innerText = totalBelanja;
    const tabel = document.getElementById("daftarBarang");

    const baris = `
        <tr>
            <td>${indexBarang + 1}</td>
            <td>${nama}</td>
            <td>${harga}</td>
            <td>${jumlah}</td>
            <td>${subtotal}</td>
            <td>
               <button onclick="hapusBarang(this, ${subtotal}, ${indexBarang})">
    Hapus
</button>
            </td>
        </tr>
    `;

    tabel.innerHTML += baris;

    document.getElementById("namaBarang").value = "";
    document.getElementById("harga").value = "";
    document.getElementById("jumlah").value = "";
}

document.getElementById("tambahBarangBtn").addEventListener("click", tambahBarang);