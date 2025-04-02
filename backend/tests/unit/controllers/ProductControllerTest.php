<?php
namespace app\tests\unit\controllers;

use app\controllers\ProductController;
use app\models\Product;
use yii\web\Request;
use yii\web\Response;

class ProductControllerTest extends \Codeception\Test\Unit
{
    /**
     * @var \UnitTester
     */
    protected $tester;

    protected function _before()
    {
        // Configurar la base de datos de prueba
        $this->tester->haveFixtures([
            'products' => [
                'class' => \app\tests\fixtures\ProductFixture::class,
            ]
        ]);
    }

    public function testActionIndex()
    {
        $controller = new ProductController('product', \Yii::$app);
        
        // Simular request con filtros
        \Yii::$app->request->setQueryParams(['price_min' => 10]);
        
        $response = $controller->actionIndex();
        
        $this->assertArrayHasKey('data', $response);
        $this->assertNotEmpty($response['data']);
        $this->assertEquals(200, \Yii::$app->response->statusCode);
    }

    public function testActionView()
    {
        $controller = new ProductController('product', \Yii::$app);
        
        // Product existente
        $response = $controller->actionView(1);
        
        // Product no existente
        $this->expectException(\yii\web\NotFoundHttpException::class);
        $controller->actionView(999);
    }

    public function testActionCreate()
    {
        $controller = new ProductController('product', \Yii::$app);
        \Yii::$app->request->setBodyParams([
            'name' => 'Nuevo Producto',
            'price' => 99.99,
            'stock' => 10,
            'category_id' => 1
        ]);
        
        $response = $controller->actionCreate();
        $this->assertEquals(201, \Yii::$app->response->statusCode);
        $this->assertArrayHasKey('id', $response);
    }

    public function testActionUpdate()
    {
        $controller = new ProductController('product', \Yii::$app);
        
        // Actualización válida
        \Yii::$app->request->setBodyParams(['price' => 150]);
        $response = $controller->actionUpdate(1);
        // $this->assertEquals(150, $response['price']);
        
        // Actualización inválida
        \Yii::$app->request->setBodyParams(['price' => -10]);
        $response = $controller->actionUpdate(1);
        $this->assertEquals(400, \Yii::$app->response->statusCode);
    }

    public function testActionDelete()
    {
        $controller = new ProductController('product', \Yii::$app);
        
        // Eliminar existente
        $response = $controller->actionDelete(1);
        $this->assertEquals(204, \Yii::$app->response->statusCode);
        
        // Eliminar no existente
        $this->expectException(\yii\web\NotFoundHttpException::class);
        $controller->actionDelete(999);
    }
}