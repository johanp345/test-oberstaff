<?php 
namespace app\controllers;

use yii\rest\ActiveController;
use yii\data\ActiveDataProvider;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\Cors;
use yii\web\Response;

class ProductController extends ActiveController
{
    public $modelClass = 'app\models\Product';

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

    public function actions()
    {
        $actions = parent::actions();
        
        // Personalizar dataProvider para filtros
        $actions['index']['prepareDataProvider'] = function ($action) {
            $requestParams = \Yii::$app->getRequest()->getQueryParams();
            
            return new ActiveDataProvider([
                'query' => $this->modelClass::find()
                    ->andFilterWhere(['like', 'product.name', $requestParams['name'] ?? null])
                    ->andFilterWhere(['>=', 'price', $requestParams['price_min'] ?? null])
                    ->andFilterWhere(['<=', 'price', $requestParams['price_max'] ?? null])
                    ->andFilterWhere(['=', 'category_id', $requestParams['category'] ?? null])
                    ->joinWith('category'),
                'pagination' => [
                    'pageSize' => 20,
                ],
            ]);
        };

        return $actions;
    }
}