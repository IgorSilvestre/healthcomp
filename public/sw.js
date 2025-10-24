/* Service Worker para notificações locais.
   Nota: Para push real em background, seria necessário integrar com Web Push/VAPID e um servidor.
*/
self.addEventListener('install', () => {
  // Ativa imediatamente a nova versão do SW
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Assume controle das páginas abertas
  event.waitUntil(self.clients.claim());
});

// Recebe mensagens da página para exibir notificações
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data && data.type === 'notify' && data.payload) {
    const { title, options } = data.payload;
    // Garante que temos um registration para notificar
    self.registration.showNotification(title || 'Notificação', options || {});
  }
});

// Foco/abertura do app ao clicar na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const url = '/schedule';
      let client = allClients.find((c) => c.url.includes(url));
      if (client) {
        client.focus();
      } else {
        self.clients.openWindow(url);
      }
    })()
  );
});
