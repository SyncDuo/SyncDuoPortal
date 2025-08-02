export async function loadPublicKey(): Promise<string> {
    const res = await fetch('/syncduo_public.pem');
    if (!res.ok) throw new Error('Failed to load public key');
    const key = await res.text();
    return key.trim();
}