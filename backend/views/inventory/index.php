<?php
$this->title = 'Inventario de productos';

?>

<div id="react-app"></div>

<?php
$this->registerJsFile(
    '@web/js/bundle.js',
    ['depends' => [\yii\web\YiiAsset::class]]
);
?>