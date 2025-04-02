<?php

namespace app\controllers;

use yii\rest\ActiveController;
use yii\filters\Cors;
use yii\web\Response;

class CategoryController extends ActiveController
{
    public $modelClass = 'app\models\Category';
    public function behaviors()
    {
        $behaviors = parent::behaviors();

        // Configuración CORS
        $behaviors['cors'] = [
            'class' => Cors::class,
            'cors' => [
                // 'Origin' => ['http://localhost:3000'],
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
}
