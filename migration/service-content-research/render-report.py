"""Render the approved research data into a navigable review PDF; no website writes."""
from pathlib import Path
import json, math, re, sys, unicodedata
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Spacer

ROOT = Path(__file__).resolve().parents[2]
DATA = json.loads((ROOT/'migration/service-content-research/report-data.json').read_text(encoding='utf-8'))
OUTPUT = ROOT/'output/pdf/roof-king-service-content-review.pdf'
W,H=A4
M=42
CW=W-2*M
GUTTER=20
COL=(CW-GUTTER)/2
GREEN=HexColor('#183e30')
ORANGE=HexColor('#d45b19')
INK=HexColor('#192c27')
GRAY=HexColor('#52615b')
LINE=HexColor('#d8ded6')
CREAM=HexColor('#f5f3ed')

for name,file in [('Body','arial.ttf'),('BodyBold','arialbd.ttf'),('Display','georgia.ttf'),('DisplayBold','georgiab.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(Path('C:/Windows/Fonts')/file)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='BodyBold',italic='Body',boldItalic='BodyBold')

def clean(text):
    text=str(text)
    for c in '\u2010\u2011\u2012\u2013\u2014\u2212':text=text.replace(c,'-')
    return text.replace('\u2018',"'").replace('\u2019',"'").replace('\u201c','"').replace('\u201d','"').replace('\u00a0',' ')

def e(text):return escape(clean(text))
def style(size=9.5,bold=False,color=INK,leading=None,spaceAfter=5):
    return ParagraphStyle('p',fontName='BodyBold' if bold else 'Body',fontSize=size,leading=leading or size*1.34,textColor=color,spaceAfter=spaceAfter,allowWidows=0,allowOrphans=0)
def p(text,size=9.5,**kw):return Paragraph(text,style(size,**kw))
def section(title,size):return p(e(title.upper()),size+0.2,bold=True,color=ORANGE,spaceAfter=6)
def link(label,url):return '<link href="'+escape(url,{'"':'&quot;'})+'" color="#183e30"><u>'+e(label)+'</u></link>'
def bullet(text,size):return p('- '+e(text),size,spaceAfter=7)
def height(items,width):
    return sum(it.wrap(width,10000)[1]+it.getSpaceAfter() for it in items)
def draw_items(c,items,x,y,width):
    for it in items:
        _,h=it.wrap(width,10000)
        it.drawOn(c,x,y-h)
        y-=h+it.getSpaceAfter()
    return y

def header(c,kicker,title,page,subtitle=None):
    c.setFillColor(GREEN)
    c.rect(0,H-8,W,8,fill=1,stroke=0)
    c.setFillColor(ORANGE)
    c.setFont('BodyBold',8)
    c.drawString(M,H-33,e(kicker).replace('&amp;','&'))
    titlep=Paragraph(e(title),ParagraphStyle('title',fontName='DisplayBold',fontSize=18.5,leading=23,textColor=GREEN))
    _,th=titlep.wrap(CW,150)
    titlep.drawOn(c,M,H-48-th)
    y=H-48-th-12
    if subtitle:
        sp=p(subtitle,8.6,color=GRAY,spaceAfter=0)
        _,sh=sp.wrap(CW,200);sp.drawOn(c,M,y-sh);y-=sh+13
    c.setStrokeColor(LINE);c.line(M,y,W-M,y)
    footer(c,page)
    return y-18

def footer(c,page):
    c.setStrokeColor(LINE);c.line(M,34,W-M,34)
    c.setFillColor(GRAY);c.setFont('Body',7.4)
    c.drawString(M,21,'ROOF KING & RESTORATION  |  CONTENT REVIEW  |  18 OCT 2026')
    c.drawRightString(W-M,21,str(page))

def columns(r,size):
    left=[section('Current page coverage',size),p(e(r['existing']),size),p('<b>Current topics:</b> '+e('; '.join(r['currentHeadings'])),size-0.4,color=GRAY),Spacer(1,5),section('Competitor content reviewed',size)]
    for comp in r['competitors']:
        domain=re.sub(r'^https?://(www\.)?','',comp['url']).split('/')[0]
        left.append(p('<b>'+link(comp['name'],comp['url'])+'</b><br/>'+e(comp['observed'])+'<br/><font size="7.6" color="#52615b">'+e(domain)+'</font>',size,spaceAfter=8))
    left.extend([Spacer(1,2),section('Prioritized gaps',size)])
    for i,gap in enumerate(r['gaps'],1):left.append(p('<b>'+str(i)+'.</b> '+e(gap),size,spaceAfter=8))
    if r.get('cityFocus'):
        left.extend([section('Direction for '+r['city'],size),p(e(r['cityFocus']),size)])
    left.extend([Spacer(1,3),section('Search phrases',size)])
    for q in r['queries']:left.append(p(e(q),size-0.6,color=GRAY,spaceAfter=4))
    right=[section('Page role',size),p(e(r['role']),size,spaceAfter=9),section('Proposed section outline',size)]
    for i,row in enumerate(r['outline'],1):
        title,sep,body=row.partition(':')
        right.append(p('<b>'+str(i)+'. '+e(title)+'</b>'+(': '+e(body.strip()) if sep else ''),size,spaceAfter=7))
    right.extend([section('Questions to answer',size),p('<br/>'.join('- '+e(q) for q in r['faq']),size),section('Proof / business input needed',size),p(e(r['proof']),size),section('Internal links',size)])
    right.append(p(' · '.join(link(path,'https://www.roofkingco.com'+path) for path in r['links']),size-0.6,spaceAfter=4))
    return left,right

def page_plan(r):
    # Measure title exactly before placing body. Keep a stable readable body size.
    tp=Paragraph(e(r['h1']),ParagraphStyle('t',fontName='DisplayBold',fontSize=18.5,leading=23))
    _,th=tp.wrap(CW,150)
    route=p(e(r['path'])+'  |  '+e(r['priority']),8.6)
    _,sh=route.wrap(CW,200)
    top=H-48-th-12-sh-13-18
    available=top-58
    for size in [9.5,9.3,9.1,8.9]:
        left,right=columns(r,size)
        if max(height(left,COL),height(right,COL))<=available:
            return size,top,left,right
    raise ValueError('Review sheet overflow: '+r['path']+' '+str((height(left,COL),height(right,COL),available)))

plans={r['id']:page_plan(r) for r in DATA['records']}
if '--check' in sys.argv:
    print(json.dumps({'pages':len(plans),'bodyFontSizes':{str(s):sum(v[0]==s for v in plans.values()) for s in [9.5,9.3,9.1,8.9]},'output':str(OUTPUT)},indent=2))
    sys.exit(0)

OUTPUT.parent.mkdir(parents=True,exist_ok=True)
c=canvas.Canvas(str(OUTPUT),pagesize=A4,pageCompression=1)
c.setTitle('Roof King - Service Content Master Review - October 18, 2026')
c.setAuthor('TheWebGuy - Roof King website project')
c.setSubject('83 page outlines with competitor findings, gaps and evidence requests')
c.setKeywords('Roof King, service content, competitor research, editorial outline')
c.setViewerPreference('DisplayDocTitle','true')
page=1

# Cover
c.setFillColor(CREAM);c.rect(0,0,W,H,fill=1,stroke=0)
c.setFillColor(GREEN)
path=c.beginPath();path.moveTo(0,H);path.lineTo(W,H);path.lineTo(W,H-258);path.lineTo(0,H-295);path.close()
c.drawPath(path,fill=1,stroke=0)
c.setFillColor(ORANGE);c.rect(M,H-75,40,4,fill=1,stroke=0)
c.setFillColor(white);c.setFont('BodyBold',10);c.drawString(M,H-105,'ROOF KING & RESTORATION')
cover=Paragraph('Service Content<br/>Master Review',ParagraphStyle('cover',fontName='DisplayBold',fontSize=32,leading=40,textColor=white))
_,hh=cover.wrap(CW,200);cover.drawOn(c,M,H-128-hh)
c.setFillColor(INK);c.setFont('Body',11);c.drawString(M,H-340,'Research and proposed page outlines - October 18, 2026')
stats=DATA['stats']
for x,n,label in [(M,'83','service-page outlines'),(M+175,'166','competitor comparisons'),(M+350,'152','distinct pages reviewed')]:
    c.setFillColor(GREEN);c.setFont('DisplayBold',30);c.drawString(x,H-406,n)
    c.setFillColor(GRAY);c.setFont('Body',8.5);c.drawString(x,H-425,label)
draw_items(c,[p('A page-by-page plan to replace thin service copy with useful explanations, meaningful comparisons and first-hand evidence.',13,leading=19,spaceAfter=18),p('<b>For review, before writing.</b> Each page includes two competitor sources, current coverage, three prioritized gaps, an outline, questions, required proof and internal links.',11,leading=16,spaceAfter=14),p('The approved /roofing/ page is excluded. No website content, URLs, redirects or forms have been changed by this research.',10.5,color=GRAY,leading=16),p('Use the clickable contents on pages 5-7. Competitor names open the exact reviewed pages.',10.5,color=GRAY,leading=16)],M,H-477,CW)
footer(c,page);c.bookmarkPage('cover');c.addOutlineEntry('Cover','cover',0);c.showPage();page+=1

# Method
y=header(c,'RESEARCH RECORD','What this review covers',page)
c.bookmarkPage('method');c.addOutlineEntry('Research method','method',0)
methoditems=[p(f"<b>{stats['pages']} pages checked · {stats['families']} service-intent families · {stats['cityHubs']} city hubs · {stats['searches']} searches</b>",11,spaceAfter=15)]
for i,row in enumerate(DATA['method'],1):methoditems.append(p('<b>'+str(i)+'.</b> '+e(row),10.5,leading=15,spaceAfter=12))
end=draw_items(c,methoditems,M,y,CW)
if end<47:raise ValueError('Method overflow')
c.showPage();page+=1

# Executive findings
y=header(c,'MAIN FINDINGS','Where the depth is missing',page)
c.bookmarkPage('findings');c.addOutlineEntry('Main findings','findings',0)
items=[]
for row in DATA['executive']:
    items.extend([p(e(row['title']),12,bold=True,color=GREEN,spaceAfter=5),p(e(row['text']),10.8,leading=15.5,spaceAfter=16)])
if draw_items(c,items,M,y,CW)<47:raise ValueError('Executive overflow')
c.showPage();page+=1

# Evidence and decisions
y=header(c,'BEFORE CONTENT WRITING','The facts and proof we need',page)
c.bookmarkPage('decisions');c.addOutlineEntry('Business decisions and writing order','decisions',0)
items=[bullet(row,10.5) for row in DATA['decisions']]
items.extend([Spacer(1,12),section('Recommended writing order',11),p('1. Confirm facts and deepen the commercial, siding, gutter, deck and storm hubs.<br/>2. Write specialist repair, replacement, material and installation explanations.<br/>3. Approve cost examples and the estimator walkthroughs.<br/>4. Add genuine local projects and finish each city page.',10.5,leading=15,spaceAfter=14),section('Reuse components, not interchangeable copy',11),p('Parent service pages can introduce actual children with the approved selector. Leaf pages should use visible topic-specific rows and media. Keep exact product specifications in Products. Preserve every existing URL and avoid generic three-link closing sections.',10.5,leading=15,spaceAfter=14),p('A page is complete when the customer can understand the decision and the work, supported by accurate examples. The priority labels describe content need, not forecast traffic or a word-count quota.',10.5,leading=15,color=GRAY)])
if draw_items(c,items,M,y,CW)<47:raise ValueError('Decisions overflow')
c.showPage();page+=1

# Three linked contents pages. Review sheet N is physical PDF page N+7.
for group in range(3):
    subset=DATA['records'][group*28:(group+1)*28]
    y=header(c,'CLICKABLE PAGE INDEX',f'Page outlines {subset[0]["id"]:02d}-{subset[-1]["id"]:02d}',page)
    if group==0:c.bookmarkPage('contents');c.addOutlineEntry('Page-by-page review','contents',0)
    for r in subset:
        target='service-'+str(r['id'])
        if (r['id']-1)%2==0:c.setFillColor(CREAM);c.rect(M-5,y-21,CW+10,25,fill=1,stroke=0)
        c.setFillColor(ORANGE);c.setFont('BodyBold',9);c.drawString(M,y-7,f"{r['id']:02d}")
        c.setFillColor(GREEN);c.setFont('BodyBold',8.8);c.drawString(M+26,y-7,r['path'])
        c.setFillColor(GRAY);c.setFont('Body',7.7)
        name=clean(r['h1'])
        while pdfmetrics.stringWidth(name,'Body',7.7)>CW-65:name=name[:-2]
        c.drawString(M+26,y-17,name)
        c.setFont('Body',9);c.drawRightString(W-M,y-8,str(r['id']+7))
        c.linkRect('',target,(M,y-22,W-M,y+4),relative=0,thickness=0)
        y-=24
    if y<42:raise ValueError('Contents overflow')
    c.showPage();page+=1

# Review sheets
for r in DATA['records']:
    if page!=r['id']+7:raise ValueError('Index page mismatch')
    subtitle=link(r['path'],'https://www.roofkingco.com'+r['path'])+'  |  '+e(r['priority'])
    y=header(c,f"PAGE {r['id']:02d} / 83  -  {r['city'].upper()}",r['h1'],page,subtitle)
    c.bookmarkPage('service-'+str(r['id']))
    c.addOutlineEntry(f"{r['id']:02d} {clean(r['path'])}",'service-'+str(r['id']),1)
    size,planned,left,right=plans[r['id']]
    # The linked subtitle uses the same metrics as its measurement counterpart.
    end1=draw_items(c,left,M,y,COL)
    end2=draw_items(c,right,M+COL+GUTTER,y,COL)
    c.setStrokeColor(LINE);c.line(M+COL+GUTTER/2,y+3,M+COL+GUTTER/2,54)
    if min(end1,end2)<54:raise ValueError('Rendered review overflow '+r['path'])
    c.setFont('Body',8);c.setFillColor(GRAY)
    c.drawString(M,44,'[ ] Approve outline     [ ] Revise direction     [ ] Supply/verify proof     Notes: __________________')
    c.showPage();page+=1

c.save()
print(json.dumps({'pdf':str(OUTPUT),'pages':page-1,'reviewSheets':len(plans),'minimumBodyFont':min(x[0] for x in plans.values())},indent=2))
