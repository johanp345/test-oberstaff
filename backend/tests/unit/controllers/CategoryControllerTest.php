<?php
namespace app\tests\unit\controllers;

use app\controllers\CategoryController;
use app\models\Category;
use yii\web\Request;

class CategoryControllerTest extends \Codeception\Test\Unit
{
    /**
     * @var \UnitTester
     */
    protected $tester;

    protected function _before()
    {
        $this->tester->haveFixtures([
            'categories' => [
                'class' => \app\tests\fixtures\CategoryFixture::class, 
            ]
        ]);
    }

    public function testActionIndex()
    {
        $controller = new CategoryController('category', \Yii::$app);
        $response = $controller->actionIndex();
        
        $this->assertNotEmpty($response);
        $this->assertEquals(200, \Yii::$app->response->statusCode);
    }

}