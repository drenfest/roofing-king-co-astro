import fs from 'node:fs/promises';
import * as cheerio from 'cheerio';

await import('./apply-product-parents.mjs');

// Authoring step: derive the menu from the same hierarchy shown in page breadcrumbs.
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const hubs=await read('src/data/product-pillar.json');
const details=await read('src/data/product-details.json');
const navigation=await read('src/data/navigation.json');
const root={label:'Products',href:'/products/',classes:'rk-menu-item rk-menu-item-has-children rk-menu-products',children:[]};
// Trex stops at category collections; its individual products remain on those pages.
for(const [path,page]of [...Object.entries(hubs),...Object.entries(details)]){
  if(details[path]&&path.startsWith('/products/decking/composite/trex/'))continue;
  // Commercial components stay discoverable in their collections and companion links.
  if(details[path]&&path.startsWith('/products/roofing/commercial/mule-hide/'))continue;
  const trail=page.breadcrumbs.slice(2);
  let parent=root;
  for(let i=0;i<trail.length;i++){
    const crumb=trail[i];const href=crumb.href || (i===trail.length-1?path:undefined);
    if(!href)throw new Error('Missing navigation destination for '+crumb.label);
    let child=parent.children.find(item=>item.href===href);
    if(!child){child={label:crumb.label,href,classes:'rk-menu-item',children:[]};parent.children.push(child);}
    parent=child;
  }
}
function finalize(item){
  if(item.children.length&&!item.classes.includes('rk-menu-item-has-children'))item.classes+=' rk-menu-item-has-children';
  if(item.href==='/products/gutters/guards/alu-rex/')item.label='Alu-Rex / T-Rex';
  item.children.forEach(finalize);
}
finalize(root);
const index=navigation.items.findIndex(item=>item.href==='/products/');
if(index<0)navigation.items.splice(1,0,root);else navigation.items[index]=root;
await fs.writeFile('src/data/navigation.json',JSON.stringify(navigation,null,2)+'\n');

// Keep the temporary imported-page header in step until those pages migrate.
const shell=await read('src/data/imported-shell.json');const $=cheerio.load(shell.header,null,false);
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function markup(item,depth=0){
  return `<li class="${item.classes} rk-menu-depth-${depth}" data-rk-menu-item><div class="rk-menu-row"><a class="rk-menu-link rk-menu-link-depth-${depth}" href="${escape(item.href)}">${escape(item.label)}</a>${item.children.length?`<button class="rk-submenu-toggle" type="button" aria-expanded="false" aria-label="Toggle ${escape(item.label)} submenu" data-rk-submenu-toggle><span aria-hidden="true"></span></button>`:''}</div>${item.children.length?`<ul class="sub-menu rk-submenu rk-submenu-depth-${depth}" data-rk-submenu>${item.children.map(child=>markup(child,depth+1)).join('')}</ul>`:''}</li>`;
}
const existing=$('.rk-nav-list > .rk-menu-products');
if(existing.length)existing.replaceWith(markup(root));else $('.rk-nav-list > li').first().after(markup(root));
shell.header=$.html();await fs.writeFile('src/data/imported-shell.json',JSON.stringify(shell,null,2)+'\n');
console.log('Products navigation synchronized for native and imported headers.');
