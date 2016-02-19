## Telegram Lambda

Proyecto base y de prueba para un bot de Telegram en __Node.js__, pensando que el backend se alojará en __AWS Lambda__ con __DynamoDB__ como capa persistente.

Aún está en desarrollo, por lo que puede que sea inestable.

### Cómo subir tu código a AWS Lambda

Requieres instalar localmente los paquetes de npm con:
```sh
$ npm i
```
Necesitas crear tu propio archivo de entorno,
ya que __AWS Lambda__ no es posible configurar el entorno por lo que debes cambiar manualmente las configuraciones.

El archivo debe ir en `src/env.json` y debe tener una configuración semenjante:

```json
{
  "TELEGRAM_TOKEN": "T0K3N",
  "APPLICATION_WEBHOOK": "https://abcd.execute-api.us-east-1.amazonaws.com/prod/",
  "DYNAMO_TABLE_NAME": "Telegram"
}
```

Por lo que antes de poder probar este código _así como está_ tendrías que configurar el __AWS API Gateway__ crear una tabla en __DynamoDB__ con el nombre de __Telegram__, y con el ___@BotFather___ obtener tu token de bot.

Cuando tengas todo lo anterior y hayas puesto las variables en tu configuración de entorno puedes proceder a empaquetar todo el proyecto en un __.zip__ y enviarlo a __AWS Lambda__ con `npm run zip`.

Además puedes crear un evento en __AWS CloudWatch__ con un tiempo determinado de 1 día para restablecer la url de tu bot, en caso de que se desconfigure el webhook. He leido que pasa sin advertencia alguna.
Tendría que ser un evento con __json__ fijo: `{"webhook":true}`
