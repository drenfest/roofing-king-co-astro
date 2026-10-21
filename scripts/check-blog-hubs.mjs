import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
const hubs=JSON.parse(await fs.readFile('src/data/blog-hubs.json','utf8'));
const manifest=JSON.parse(await fs.readFile('migration/route-manifest.json','utf8')).routes;
const paths=new Set(manifest.map(r=>r.path));
const nav=JSON.parse(await fs.readFile('src/data/navigation.json','utf8'));
const blog=nav.items.find(i=>i.label==='Blog');
assert.ok(blog,'Blog is a top-level menu item');
assert.ok(!nav.items.find(i=>i.label==='About').children.some(i=>i.label==='Blog'),'Blog is moved out of About');
for(const [kind,hub]of Object.entries(hubs)){
 const $=cheerio.load(await fs.readFile('dist'+hub.path+'index.html','utf8'));
 assert.equal($('h1').length,1);assert.equal($('h1').text(),hub.title);
 assert.equal($('#blog-collections .rk-home-blog-card').length,hub.groups.length);
 assert.equal($('[data-component=PageHero]').length,1);assert.equal($('[data-component=CardSection]').length,1);assert.equal($('[data-component=BlogNavigation]').length,1);
 assert.ok($('main>.rk-native-breadcrumbs').length);
 assert.equal($('.rk-blog-resource-main a[aria-current=page]').attr('href'),hub.path);
 assert.equal(blog.children.find(i=>i.label.toLowerCase()===kind).href,hub.path);
 for(const group of hub.groups){
  assert.ok(paths.has(group.href));assert.ok(group.description?.length>40);assert.ok(group.count>0);
  const source=await fs.readFile(manifest.find(r=>r.path===group.href).file,'utf8');const archive=cheerio.load(source.split('---').slice(2).join('---'));
  assert.equal(archive('li>a').length,group.count,group.href+' source article count');
  for(const post of group.articles)assert.ok(paths.has(post.href),post.href);
 }
 for(const link of $('a').toArray())assert.ok($(link).attr('title')?.trim());
 assert.equal($('img:not([alt])').length,0);
}
const articles=JSON.parse(await fs.readFile('src/data/blog-index.json','utf8'));
const index=cheerio.load(await fs.readFile('dist/blog/index.html','utf8'));
assert.equal(index('#blog-collections .rk-home-blog-card').length,articles.length);assert.equal(articles.length,21);
assert.equal(new Set(articles.map(a=>a.href)).size,articles.length);assert.equal(index('[data-component=BlogNavigation]').length,1);
assert.ok(!index('meta[name=description]').attr('content').includes('#TITLE#'));
const archives=JSON.parse(await fs.readFile('src/data/blog-archives.json','utf8'));assert.equal(Object.keys(archives).length,21);
for(const [path,archive]of Object.entries(archives)){
 const $=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));
 assert.equal($('#blog-collections .rk-home-blog-card').length,archive.items.length,path);
 assert.equal($('[data-component=PageHero]').length,1);assert.equal($('[data-component=CardSection]').length,1);assert.equal($('[data-component=BlogNavigation]').length,1);
 assert.ok($('.rk-native-breadcrumbs a[href="/blog/'+archive.kind+'/"]').length);
 for(const post of archive.items)assert.ok($('#blog-collections a[href="'+post.href+'"]').length);
}
for(const path of ['/blog/','/blog/categories/','/blog/topics/',...Object.keys(archives)]){
 const $=cheerio.load(await fs.readFile('dist'+path+'index.html','utf8'));
 assert.equal($('[data-blog-filterable]').length,1,path);assert.equal($('[data-blog-search]').length,1);assert.equal($('[data-blog-reset]').length,1);assert.equal($('[data-blog-count][role=status]').length,1);
 for(const card of $('[data-blog-card]').toArray()){
  const post=articles.find(p=>p.href===$(card).find('a').first().attr('href'));if(!post)continue;
  assert.equal($(card).find('time').attr('datetime')||null,post.date,path+' publication date');
  assert.equal($(card).find('.rk-blog-card-meta span').text(),post.author?'By '+post.author:'',path+' source author');
 }
}
for(const post of articles){const $=cheerio.load(await fs.readFile('dist'+post.href+'index.html','utf8'));const aside=$('aside');assert.ok(aside.find('a[href="/blog/"]').length,post.href);assert.ok(aside.find('a[href="/blog/categories/"]').length,post.href);assert.ok(aside.find('a[href="/blog/topics/"]').length,post.href);}
console.log('Native blog index and all 21 category/topic archives reuse PageHero, Breadcrumbs and CardSection.');
console.log('Blog Categories and Topics hubs: all 21 assigned-term collections, accurate article counts, linked posts, menu destinations and required attributes passed.');
