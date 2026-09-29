<?php

include "koneksi.php";

$nomor_transaksi = $_POST["nomor_transaksi"];
$tanggal = $_POST["tanggal"];
$total = $_POST["total"];
$bayar = $_POST["bayar"];
$kembalian = $_POST["kembalian"];

$query = "INSERT INTO transaksi 
          (nomor_transaksi, tanggal, total, bayar, kembalian)
          VALUES 
          ('$nomor_transaksi', '$tanggal', '$total', '$bayar', '$kembalian')";

if (mysqli_query($koneksi, $query)) {

    echo "Transaksi berhasil disimpan!";

} else {

    echo "Gagal menyimpan transaksi: " . mysqli_error($koneksi);

}

?>