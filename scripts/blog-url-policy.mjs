export function termSlug(term){return term.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
export function chooseBlogTerm(categories=[],tags=[]){
 const category=categories.find(name=>name.trim()&&!/^uncategori[sz]ed$/i.test(name.trim()));
 if(category)return {kind:'category',name:category,slug:termSlug(category)};
 const tag=tags.find(name=>name.trim());
 return tag?{kind:'tag',name:tag,slug:termSlug(tag)}:null;
}
