// Importo el módulo "whatsapp-web.js" y creo una variable "Client" que apunta a la clase "Client" del módulo.
const { Client } = require('whatsapp-web.js');

// Creo un nuevo objeto de la clase "Client" del módulo "whatsapp-web.js" y establezco un caché para el archivo HTML de WhatsApp Web.
const client = new Client({
  webVersionCache: {
    type: "remote",
    remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

// Importo módulos adicionales para generar y mostrar códigos QR y enviar correos electrónicos.
const qrcode = require('qrcode-terminal'); // Genera codigos QR en la terminal
const nodemailer = require('nodemailer'); // npm install nodemailer para enviar correos electrónicos.
const readline = require('readline'); //Recolecta entrada de usuario desde la terminal

// Creo un transporte de correo electrónico usando "nodemailer" con Gmail como proveedor de correo electrónico.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-contraseña'
  }
});
 
// Función asíncrona que ejecuta las operaciones en el chatbot.
async function run() {
  // Estructura "try ... catch" para capturar y tratar cualquier error que se produzca en la función "run()".
  try {
    // Asigna un controlador al evento "qr" para generar un código QR cuando se produce el evento.
    client.on('qr', qr => {
      qrcode.generate(qr, { small: true });
    });
 
    // Asigna un controlador al evento "ready" para indicar que el chatbot está conectado y listo para usar.
    client.on('ready', () => {
      console.log('¡Bienvenido! has conectado tu WhatsApp para que funcione como ChatBoot.');
    });
 
    // Inicializo el objeto "client" y me conecto a WhatsApp usando el método "initialize()".
    await client.initialize();
 
    // Función para obtener la hora actual y usarla para actualizar al usuario.
    function cumprimentar() {
      const dataAtual = new Date();
      const hora = dataAtual.getHours();
 
      // Variable que se usará para almacenar el saludo de "Buenos días", "Buenas tardes" o "Buenas noches".
      let salunat;
 
      // Verifico la hora y selecciona un saludo dependiendo de la hora.
      if (hora >= 0 && hora < 12) {
        salunat = "¡Hola Muy buenos días! 🌞 Te Saluda el ChatBoot de Brayan Alba 👋🏻";
      } else if (hora >= 12 && hora < 18) {
        salunat = "¡Hola buenas tardes! 🖼️ Te Saluda el ChatBoot de Brayan Alba 👋🏻";
      } else {
        salunat = "¡Hola buenas noches 🌒! Te Saluda el ChatBoot de Brayan Alba 👋🏻";
      }
 
      // Retorno el saludo para que se muestre al usuario.
      return salunat;
    }
 
    // Creo un objeto "Date" para obtener la fecha y hora actuales y las devuelvo como una cadena de texto.
    function obtenerFechaHora() {
      const fechaHoraActual = new Date();
      return `La Hora Y la fecha actual Son: ${fechaHoraActual}`;
    }

    // Función que devuelve un mensaje de despedida para el usuario.
    function despedirse() {
      return "Gracias por comunicarte con Brayan Alba 🌻👩🏻‍💻 vuelve pronto!";
    }
 
    // Variable que contiene el texto del menú de opciones.
    const menunat = `
    Bienvenido al ChatBoot de Brayan Alba 👩🏻‍💻🌻, en estos momentos no estoy disponible pero gracias a lo que aprendí programando cree un ChatBot en JavaScript y NodeJS con funciones sencillas así que por favor elija una opción y apenas pueda me comunicare nuevamente con usted :
    1. Quiero Un Saludo 👋🏻
    2. ¿Que hora y que fecha es? ⏰🕰️
    3. Finalizar 🤞🏻
    `;
 
    // Función que retorna una promesa resuelta después de esperar un número específico de milisegundos.
    const delay = ms => new Promise(res => setTimeout(res, ms));
 
    // Controlador de eventos para la recepción de mensajes de WhatsApp.
    client.on('message', async msg => {
      // Comprobar si el mensaje proviene de WhatsApp y no es ninguna de las opciones disponibles (1, 2 o 3).
      if (msg.from.endsWith('@c.us') && !msg.body.match(/^(1|2|3)$/) )
      // Envío un mensaje de estado "escribiendo" al usuario, espero 500 ms, obtenga el saludo de "cumprimementar()" y envío el menú de opciones al usuario. 
      {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        await delay(500);
        const saudacoes = cumprimentar();
        await client.sendMessage(msg.from, `${menunat} `);
      } 
      
      // Si el usuario elige la opción 1 o selecciona "saludo" como respuesta, envío el saludo de "cumprimementar()", luego envío el menú de opciones nuevamente.
      else if (msg.body.match(/(1)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const saudacoes = cumprimentar();
        await client.sendMessage(msg.from, saudacoes);
        await client.sendMessage(msg.from, `${menunat} `);
      }
      
      // Si el usuario elige la opción 2 o selecciona "fecha y hora" como respuesta, envío la fecha y hora actuales usando "obtenerFechaHora()", luego envío el menú de opciones nuevamente.
      else if (msg.body.match(/(2)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const fechaHora = obtenerFechaHora();
        await client.sendMessage(msg.from, fechaHora);
        await client.sendMessage(msg.from, `${menunat} `);
      }

      // Si el usuario elige la opción 3 o selecciona "despedida" como respuesta, enviará el mensaje de despedida "despedirse()" y luego enviará el menú de opciones nuevamente.
      else if (msg.body.match(/(3)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        const despedidaMensaje = despedirse();
        await client.sendMessage(msg.from, despedidaMensaje);
      }

       // Si el usuario introduce la palabra "menu", entonces se enviará el mensaje "menu" y se volverá a mostrar el menú de opciones.
       if (msg.body.match(/menu/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        chat.sendStateTyping();
        await client.sendMessage(msg.from, menu);
      }
    });
 
    // Función para esperar una respuesta del usuario.
    // Se agrega un controlador de eventos para "message" que se ejecutará cuando se reciba un mensaje del usuario. Si el mensaje proviene de WhatsApp, se resuelve la promesa con el mensaje.
    function waitForResponse() {
      return new Promise((resolve, reject) => {
        client.on('message', async msg => {
          if (msg.from.endsWith('@c.us')) {
            resolve(msg);
          }
        });
      });
    }
  // Bloque de captura para manejar errores.
  // Si se produce un error durante la ejecución, se imprimirá un mensaje de error en la consola.
} catch (error) {
  console.error('Error en la ejecución:', error);
}
}
 
// Ejecuta la función "run()" y cualquier error que se produzca se enviará a la consola de error.
run().catch(err => console.error(err));