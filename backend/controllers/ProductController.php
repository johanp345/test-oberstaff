<?php
namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use yii\data\ActiveDataProvider;
use yii\filters\Cors;
use app\models\Product;

class ProductController extends Controller
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
                'Access-Control-Request-Headers' => ['*']
            ]
        ];

        return $behaviors;
    }

    public function beforeAction($action)
    {
        Yii::$app->response->format = Response::FORMAT_JSON;
        return parent::beforeAction($action);
    }

    // GET /products (con filtros)
    public function actionIndex()
    {
        try {
            $query = Product::find()->joinWith('category');
            
            // Aplicar filtros
            $params = Yii::$app->request->get();
            
            if (isset($params['name'])) {
                $query->andFilterWhere(['like', 'product.name', $params['name']]);
            }
            
            if (isset($params['price_min'])) {
                $query->andFilterWhere(['>=', 'price', $params['price_min']]);
            }
            
            if (isset($params['price_max'])) {
                $query->andFilterWhere(['<=', 'price', $params['price_max']]);
            }
            
            if (isset($params['category'])) {
                $query->andFilterWhere(['category_id' => $params['category']]);
            }

            // Configurar DataProvider
            $dataProvider = new ActiveDataProvider([
                'query' => $query,
                'pagination' => [
                    'pageSize' => Yii::$app->request->get('per_page', 20),
                ],
                'sort' => [
                    'attributes' => [
                        'name',
                        'id',
                        'price',
                        'stock',
                        'category_id' => [
                            'asc' => ['category.name' => SORT_ASC],
                            'desc' => ['category.name' => SORT_DESC],
                        ]
                    ],
                    'defaultOrder' => ['id' => SORT_DESC]
                ]
            ]);

            return $dataProvider->getModels();

        } catch (\Exception $e) {
            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error al obtener products'];
        }
    }

    // GET /products/{id}
    public function actionView($id)
    {
        try {
            $product = Product::find()
                ->where(['id' => $id])
                ->joinWith('category')
                ->one();

            if (!$product) {
                Yii::$app->response->statusCode = 404;
                return ['error' => 'Product no encontrado'];
            }

            return $product;

        } catch (\Exception $e) {
            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error al obtener el product'];
        }
    }

    // POST /products
    public function actionCreate()
    {
        try {
            $model = new Product();
            $model->load(Yii::$app->request->post(), '');

            if ($model->save()) {
                Yii::$app->response->statusCode = 201;
                return $model;
            }

            Yii::$app->response->statusCode = 400;
            return ['errors' => $model->errors];

        } catch (\Exception $e) {
            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error al crear el product'];
        }
    }

    // PUT /products/{id}
    public function actionUpdate($id)
    {
        try {
            $model = Product::findOne($id);
            
            if (!$model) {
                Yii::$app->response->statusCode = 404;
                return ['error' => 'Product no encontrado'];
            }

            $model->load(Yii::$app->request->post(), '');

            if ($model->save()) {
                return $model;
            }

            Yii::$app->response->statusCode = 400;
            return ['errors' => $model->errors];

        } catch (\Exception $e) {
            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error al actualizar el product'];
        }
    }

    // DELETE /products/{id}
    public function actionDelete($id)
    {
        try {
            $model = Product::findOne($id);
            
            if (!$model) {
                Yii::$app->response->statusCode = 404;
                return ['error' => 'Product no encontrado'];
            }

            if ($model->delete()) {
                Yii::$app->response->statusCode = 204;
                return null;
            }

            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error al eliminar el product'];

        } catch (\Exception $e) {
            Yii::$app->response->statusCode = 500;
            return ['error' => 'Error interno del servidor'];
        }
    }

    // OPTIONS /products
    public function actionOptions()
    {
        Yii::$app->response->statusCode = 204;
        Yii::$app->response->headers->add('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}