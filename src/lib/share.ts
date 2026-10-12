export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / insecure contexts
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Uses the phone's native share sheet when available. Returns false if not handled. */
export async function nativeShare(data: { title?: string; text: string; url?: string }): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    await navigator.share(data);
    return true;
  } catch (e) {
    // User cancelled → treat as handled so we don't open another window
    return (e as DOMException)?.name === 'AbortError';
  }
}

export const whatsappUrl = (text: string) => `https://wa.me/?text=${encodeURIComponent(text)}`;
export const messengerUrl = (url: string) =>
  `fb-messenger://share/?link=${encodeURIComponent(url)}`;
