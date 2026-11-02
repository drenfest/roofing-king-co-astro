/** Only independent review-platform destinations may supply displayed customer feedback. */
export function isExternalReviewSource(source?:{url:string;platform?:string}):boolean {
 try {
  const url=new URL(source?.url||'');
  const host=url.hostname.toLowerCase();
  return url.protocol==='https:'&&['google.com','share.google','g.page','bbb.org','angi.com','birdeye.com'].some(domain=>host===domain||host.endsWith('.'+domain));
 } catch {return false;}
}
