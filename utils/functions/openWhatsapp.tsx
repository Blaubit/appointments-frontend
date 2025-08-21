export function openWhatsApp(phone: string, message: string) {
  const isMobile = /Android|iPhone/i.test(navigator.userAgent);
  const isLinux = /Linux/i.test(navigator.userAgent);

  // Fallback URL directo
  const webUrl = isMobile
    ? `https://wa.me/${phone}?text=${message}`
    : `https://web.whatsapp.com/send?phone=${phone}&text=${message}`;

  if (isLinux && !isMobile) {
    // Si es Linux escritorio → ir directo a WhatsApp Web
    window.open(webUrl, "_blank");
    return;
  }

  // Intentar abrir la app si no es Linux escritorio
  const appUrl = `whatsapp://send?phone=${phone}&text=${message}`;
  window.location.href = appUrl;

  // Fallback si no funciona la app
  setTimeout(() => {
    window.open(webUrl, "_blank");
  }, 1500);
}
