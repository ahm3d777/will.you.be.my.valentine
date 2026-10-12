export interface Personalization {
  to: string;
  from: string;
  msg: string;
}

const clean = (v: string | null, max: number) =>
  (v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

export function readPersonalization(search = window.location.search): Personalization {
  const p = new URLSearchParams(search);
  return {
    to: clean(p.get('to'), 30),
    from: clean(p.get('from'), 30),
    msg: clean(p.get('msg'), 120),
  };
}

export function buildProposalLink(data: Personalization, origin = window.location.origin): string {
  const url = new URL('/', origin);
  if (data.to.trim()) url.searchParams.set('to', data.to.trim());
  if (data.from.trim()) url.searchParams.set('from', data.from.trim());
  if (data.msg.trim()) url.searchParams.set('msg', data.msg.trim());
  return url.toString();
}
