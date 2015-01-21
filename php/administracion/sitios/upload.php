<?php
$target_path = "../../../img/fotos/";
$target_path = $target_path . basename( $_FILES['imageFile']['name']); 
if(move_uploaded_file($_FILES['imageFile']['tmp_name'],$target_path)) {
	// echo "El archivo ". basename( $_FILES['image']['name']). " ha sido subido";
	echo "{success:true, img:'".basename( $_FILES['imageFile']['name'])."'}";
} else{
	echo "{failure:true}";
}