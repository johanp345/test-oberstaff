<?php
namespace app\controllers;

use Yii;
use yii\rest\Controller;
use yii\web\Response;
use yii\filters\Cors;
use yii\filters\auth\HttpBearerAuth;

class CategoryController extends Controller
{
    public $enableCsrfValidation = false;

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        // Configuración CORS
        $behaviors['cors'] = [
            'class' => Cors::class,
            'cors' => [
                'Origin' => ['*'],
                'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                'Access-Control-Request-Headers' => ['*'],
            ],
        ];

        // Formato de respuesta JSON
        $behaviors['contentNegotiator'] = [
            'class' => \yii\filters\ContentNegotiator::class,
            'formats' => [
                'application/json' => Response::FORMAT_JSON,
            ],
        ];

        return $behaviors;
    }

    // GET /categories
    public function actionIndex()
    {
        $db = Yii::$app->db;
        try {
            $categories = $db->createCommand("SELECT * FROM category")->queryAll();
            return $this->asJson( $categories);
        } catch (\Exception $e) {
            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error al obtener las categorías'];
        }
    }

    // GET /categories/{id}
    public function actionView($id)
    {
        $db = Yii::$app->db;
        try {
            $category = $db->createCommand("SELECT * FROM category WHERE id = :id")
                ->bindValue(':id', $id)
                ->queryOne();

            if (!$category) {
                Yii::$app->response->statusCode = 404;
                return ['error' => 'Categoría no encontrada'];
            }

            return $this->asJson($category);
        } catch (\Exception $e) {
            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error al obtener la categoría'];
        }
    }

    // POST /categories
    public function actionCreate()
    {
        $request = Yii::$app->request;
        $name = $request->post('name');

        if (empty($name)) {
            Yii::$app->response->statusCode = 400;
            return ['error' => 'El nombre es requerido'];
        }

        $db = Yii::$app->db;
        $transaction = $db->beginTransaction();
        try {
            $result = $db->createCommand()->insert('category', [
                'name' => $name
            ])->execute();

            if ($result) {
                $id = $db->getLastInsertID();
                $transaction->commit();
                Yii::$app->response->statusCode = 201;
                return ['id' => $id, 'nombre' => $name];
            }

            $transaction->rollBack();
            Yii::$app->response->statusCode = 400;
            return ['error' => 'Error al crear la categoría'];

        } catch (\Exception $e) {
            $transaction->rollBack();
            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error en el servidor'];
        }
    }

    // PUT /categories/{id}
    public function actionUpdate($id)
    {
        $request = Yii::$app->request;
        $name = $request->getBodyParam('name');

        if (empty($name)) {
            Yii::$app->response->statusCode = 400;
            return ['error' => 'El nombre es requerido'];
        }

        $db = Yii::$app->db;
        $transaction = $db->beginTransaction();
        try {
            $result = $db->createCommand()->update('category', 
                ['name' => $name],
                'id = :id',
                [':id' => $id]
            )->execute();

            $transaction->commit();
            
            if ($result) {
                return ['id' => $id, 'name' => $name];
            }

            Yii::$app->response->statusCode = 404;
            return ['error' => 'Categoría no encontrada'];

        } catch (\Exception $e) {
            $transaction->rollBack();
            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error al actualizar la categoría'];
        }
    }

    // DELETE /categories/{id}
    public function actionDelete($id)
    {
        $db = Yii::$app->db;
        $transaction = $db->beginTransaction();
        try {
            $result = $db->createCommand()->delete('category', 'id = :id', [':id' => $id])->execute();

            $transaction->commit();
            
            if ($result) {
                Yii::$app->response->statusCode = 204;
                return null;
            }

            Yii::$app->response->statusCode = 404;
            return ['error' => 'Categoría no encontrada'];

        } catch (\Exception $e) {
            $transaction->rollBack();
            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error al eliminar la categoría'];
        }
    }

    // OPTIONS /categories
    public function actionOptions()
    {
        Yii::$app->response->statusCode = 200;
    }
}