## Telegram Lambda

Proyecto base y de prueba para un bot de Telegram en Node.js, pensando que el backend se alojará en AWS Lambda con DynamoDB como capa persistente.

Aún está en desarrollo, por lo que puede que sea inestable.

### Cómo subir tu código a AWS Lambda

Requieres instalar localmente los paquetes de npm con:
```sh
$ npm i
```
Necesitas crear tu propio archivo de entorno,
ya que AWS Lambda no es posible configurar el entorno por lo que debes cambiar manualmente las configuraciones.

El archivo debe ir en `src/env.json` y debe tener una configuración semenjante:

```json
{
  "TELEGRAM_TOKEN": "T0K3N",
  "APPLICATION_WEBHOOK": "https://abcd.execute-api.us-east-1.amazonaws.com/prod/",
  "DYNAMO_TABLE_NAME": "Telegram"
}
```

Por lo que antes de poder probar este código _así como está_ tendrías que configurar el `AWS API Gateway` crear una tabla en `DynamoDB` con el nombre de `Telegram`, y con el `@BotFather` obtener tu token de bot.

Cuando tengas todo lo anterior y hayas puesto las variables en tu configuración de entorno puedes proceder a empaquetar todo el proyecto en un _.zip_ y enviarlo a _AWS Lambda_.
