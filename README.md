# Proyecto Yii-Test

Este documento describe los pasos necesarios para instalar y configurar el proyecto desde GitHub.

# Yii-Test Backend

## Requisitos previos

Asegúrate de tener instalados los siguientes componentes en tu sistema:
- PHP (versión 7.4 o superior)
- Composer
- Servidor web (Apache o Nginx)
- MySQL o cualquier base de datos compatible
## Pasos de instalación

1. **Clonar el repositorio**
    ```bash
    git clone https://github.com/usuario/yii-test.git
    cd yii-test
    ```

2. **Instalar dependencias**
    Ejecuta el siguiente comando para instalar las dependencias del proyecto:
    ```bash
    composer install
    ```

3. **Configurar la base de datos**
    para efectos de este test los datos de las conexiones seran expuestos en `config/db.php` pero tenga en cuenta que para producciòn debera usar un archivo .env o variables de entorno de su hosting, una vez configurado los datos de conexion puede ejecutar las migraciones
    ```bash
    php yii migrate
    ```

4. **Iniciar el servidor**
    Puedes iniciar un servidor de desarrollo utilizando el siguiente comando:
    ```bash
    php yii serve
    ```
    El proyecto estará disponible en `http://localhost:8080/inventory` alli podra ver la vista relacionada con el test.

5. **Probar servicios**
    Si deseas probar los servicios disponibles y usar VS Code puedes usar este plugin `https://marketplace.visualstudio.com/items?itemName=humao.rest-client` y usar el archivo test.http que descargas con el repo


## Pruebas Unitarias

Para ejecutar las pruebas, cree una base de datos de prueba apra no interferir con la principal y en la ruta `/config/test.db.php` coloca el nombre de la base de datos luego  utiliza el siguiente comando:
```bash
php tests/bin/yii migrate --interactive=0
php vendor/bin/codecept run
```

# Yii-Test Frontend

## Pasos de instalación

1. **instalar dependencias**
    Debera ubicarse en la ruta /frontend y ejecutar `npm install`

1. **instalar dependencias**
    crear un archivo `.env` en la ruta /frontend con el valor `VITE_API_URL = http://localhost:8080` si no has perzonalizado nada del backend

3. **crear build y hacerlo disponible en el pryecto yii**
    Debera ubicarse en la ruta /frontend y ejecutar `npm run build` con esto se le generará los archivos transpilados para usar en en la vista yii, podrá hacer sus propias configuraciones desde los archivos fuentes pero debrá correr de nuevo `npm run build` para tener los cambios disponibles en yii, tambien pouede ejecutar el frontend independiente en modo de test con el comando `npm run dev`
