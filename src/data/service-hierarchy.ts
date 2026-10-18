import manifest from '../../migration/route-manifest.json';

/** Service navigation is for parent pages; leaf pages present their content directly. */
export function hasServiceChildren(path:string):boolean{
  return manifest.routes.some(route=>route.path!==path&&route.path.startsWith(path)&&!route.path.slice(path.length).replace(/\/$/,'').includes('/'));
}
