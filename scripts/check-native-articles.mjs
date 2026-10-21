import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
const audit=JSON.parse(await fs.readFile('migration/blog-article-components.json','utf8'));
const articles=JSON.parse(await fs.readFile('src/data/blog-articles.json','utf8'));
const normalize=text=>text.replace(/\u200b/g,'').replace(/\s+/g,' ').trim();
assert.equal(audit.articles.length,21);const failures=[];
for(const source of audit.articles){
 const html=await fs.readFile('dist'+source.path+'index.html','utf8'),$=cheerio.load(html),article=articles[source.path];
 const reading=$('.rk-article-reading');const text=normalize(reading.text());
 assert.equal($('[data-component=NativeArticle]').length,1,source.path);
 assert.equal($('[data-component=PageHero]').length,1);assert.equal($('[data-component=BlogNavigation]').length,1);
 assert.equal($('h1').length,1);assert.equal($('h1').text(),article.title);assert.equal($('main').length,1);
 assert.equal($('.rk-blog-single,.rk-blog-component-section,.rk-blog-component-card,.rk-blog-sidebar').length,0,'No legacy article containers');
 for(const paragraph of source.paragraphs)if(!text.includes(paragraph))failures.push({path:source.path,kind:'missing source block',text:paragraph});
 for(const link of source.links)if(!reading.find('a').toArray().some(a=>$(a).attr('href')===link.href&&normalize($(a).text())===link.label))failures.push({path:source.path,kind:'missing source link',...link});
 assert.equal($('[data-component=ArticleChecklist]>li').length,source.checklistItems,'All source checklist items: '+source.path);
 assert.equal(reading.find('[data-component=ArticleImage]').length,source.images.length,'Restored source images: '+source.path);
 const groups=reading.find('[data-component=ArticleChecklist]').toArray().map(ul=>$(ul).children('li').toArray().map(li=>normalize($(li).text())));
 assert.deepEqual(groups,source.checklistGroups,'Original list groups and ordering: '+source.path);
 assert.equal(reading.find('[data-component=FAQSection] details').length,source.faqs);
 assert.equal(reading.find('[data-component=ArticleSection]').length,source.sections);
 assert.ok(reading.find('[data-component=ContentSection]').length>0);
 const hero=$('[data-component=PageHero]>img');assert.ok(hero.attr('srcset'));assert.ok(hero.attr('width')&&hero.attr('height'));assert.equal(hero.attr('loading'),'eager');
 assert.equal(hero.attr('srcset').includes(article.hero.src),true,'Selected original first image is the hero');
 if(source.originalImageCount)assert.equal(article.hero.generated,false);
 if(source.path.includes('/columbus-roofs-face-wind-')){
  const section=reading.find('[data-component=ArticleSection]').filter((_,n)=>$(n).find('h2').first().text().includes('Before vs. After'));
  assert.deepEqual(section.find('[data-component=ArticleChecklist]').toArray().map(n=>$(n).children('li').length),[5,4]);
  const before=section.text().indexOf('Before the Windstorm:');const first=section.text().indexOf('Look for curling');const after=section.text().indexOf('After the Windstorm:');const last=section.text().indexOf('Scan the yard');assert.ok(before<first&&first<after&&after<last);
 }
 if(article.hero.generated)assert.equal($('.rk-service-hero-credit').length,1);
 const headers=$('main h1,main h2,main h3,main h4').toArray();let previous=0;
 for(const h of headers){const level=Number(h.tagName[1]);assert.ok(level<=previous+1,'Heading order: '+source.path+' '+$(h).text());previous=level;}
 for(const href of $('link[rel=stylesheet]').toArray().map(n=>$(n).attr('href')).filter(href=>href.startsWith('/'))){const css=await fs.readFile('dist'+href,'utf8');assert.ok(!css.includes('.rk-blog-single'),'No WordPress article CSS: '+source.path);}
}
assert.deepEqual(failures,[],JSON.stringify(failures,null,2));
const media=JSON.parse(await fs.readFile('src/data/blog-article-media.json','utf8'));
for(const image of Object.values(media))for(const variant of image.variants){assert.ok(variant.width<=image.width);assert.ok((await fs.stat('public'+variant.src)).size<300000,'Hero WebP budget '+variant.src);}
console.log('All 21 native articles preserve every source block, checklist item, FAQ and contextual link; shared components, heading hierarchy, responsive heroes and absence of legacy WordPress CSS passed.');
