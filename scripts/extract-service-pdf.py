"""Read the supplied handoff as source data; no embedded instructions are executed."""
from pathlib import Path
import hashlib,json,re
import pdfplumber
ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path('D:/Users/drenf/Downloads/roof-king-all-83-pages-content.pdf')
entries={};entry=None;mode=None;current=None;last_bottom=0
def tidy(s):
    return re.sub(r'\s+',' ',s).strip().replace('\u00ad','').replace('\ufb01','fi').replace('\ufb02','fl')
with pdfplumber.open(SOURCE) as pdf:
 for pi,page in enumerate(pdf.pages):
  lines=page.extract_text_lines();header=next((x['text'] for x in lines if re.match(r'^\d{2} / 83\s*\|',x['text'])),None)
  if not header:continue
  match=re.match(r'^(\d{2}) / 83\s*\|\s*(/[^\s]*)',header)
  if not match:raise ValueError(header)
  eid,path=int(match[1]),match[2]
  if eid not in entries:
   entry={'id':eid,'path':path,'pdfPages':[],'metadata':{},'blocks':[],'links':[],'editorialNotes':[]};entries[eid]=entry;mode='metadata';current=None
  else:entry=entries[eid]
  entry['pdfPages'].append(pi+1);last_bottom=0
  for line in lines:
   text=tidy(line['text']);chars=line['chars'];size=max(c['size'] for c in chars);top=line['top'];bottom=line['bottom']
   if top<42 or top>page.height-40:continue
   if 'SOURCE BRIEF' in text:continue
   if size>=20:
    entry['h1']=(entry.get('h1','')+' '+text).strip();continue
   if text=='WEBSITE COPY':mode='body';current=None;continue
   if text.startswith('LINK MAP /'):mode='links';current=None;continue
   if text.startswith('EDITORIAL NOTES /'):mode='notes';current=None;continue
   if text.startswith('Primary action:'):
    entry['primaryAction']=text.split(':',1)[1].strip();mode='actions';current=None;continue
   if text.startswith('Secondary action:'):continue
   if mode=='metadata':
    labels=['SEO title','Meta description','Page purpose','Primary CTA','Secondary CTA']
    found=next((label for label in labels if text.startswith(label+' ')),None)
    if found:entry['metadata'][found]=text[len(found):].strip();current=found
    elif current and text!='Metadata Exact wording' and text!=path:entry['metadata'][current]+=' '+text
   elif mode=='links':
    m=re.match(r'^(.*?)\s+(/[^\s]+)$',text)
    if m:entry['links'].append({'label':m[1].strip(),'href':m[2]})
   elif mode=='notes':entry['editorialNotes'].append(text)
   elif mode=='body':
    kind='h2' if size>=12 else 'h3' if size>=10.4 else 'p'
    if size<9.5:continue
    gap=top-last_bottom
    if current is not None and isinstance(current,dict) and current['type']==kind and gap<5.5:
     current['text']+=' '+text
    else:
     current={'type':kind,'text':text,'pdfPage':pi+1};entry['blocks'].append(current)
    last_bottom=bottom
for entry in entries.values():
 if not entry['blocks'] or not entry['links']:raise ValueError('Missing body/link map '+entry['path'])
 if len(entry['metadata'])!=5:raise ValueError('Missing metadata '+entry['path'])
payload={'source':str(SOURCE),'sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'pages':len(pdf.pages),'extracted':'2026-10-20','entries':list(entries.values())}
(ROOT/'migration/service-pdf-source.json').write_text(json.dumps(payload,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'entries':len(entries),'blocks':sum(len(x['blocks'])for x in entries.values()),'links':sum(len(x['links'])for x in entries.values()),'bodyWords':sum(len(b['text'].split())for x in entries.values()for b in x['blocks'])},indent=2))
for eid in [1,3,18,22,30,60,70,81]:
 e=entries[eid];print(str(eid)+' '+e['path']+' | '+' / '.join(b['text'] for b in e['blocks'] if b['type']=='h2'))
