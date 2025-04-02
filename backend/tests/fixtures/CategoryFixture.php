<?php
namespace app\tests\fixtures;

use yii\test\ActiveFixture;

class CategoryFixture extends ActiveFixture
{
    public $modelClass = 'app\models\Category';
    public $dataFile = '@app/tests/_data/category.php';
}