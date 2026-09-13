#!/usr/bin/env python3
"""Build docs/ HTML pages from skills/**/*.md. Re-run after editing any skill file."""
import os, re, html, glob
ROOT=os.path.dirname(os.path.abspath(__file__)); SRC=os.path.join(ROOT,"skills"); OUT=os.path.join(ROOT,"docs")
DRIVE="https://drive.google.com/drive/folders/1dFT7MjtyhgtvzreVf7q7cBSNPoV-V-qR"
NAV=[("index.html","Home"),("working-with-me.html","Method"),("process-walkthrough.html","Deck"),("skill-library.html","Skills"),("pathfinder-case-study.html","Case study"),("intake.html","Intake"),("docs/index.html","Docs"),(DRIVE,"Files ↗")]
def nav(prefix,current):
    out=[]
    for href,label in NAV:
        cur=' aria-current="page"' if href==current else ''
        ext=' target="_blank" rel="noopener"' if href.startswith("http") else ''
        h=href if href.startswith("http") else prefix+href
        out.append(f'<a href="{h}"{cur}{ext}>{label}</a>')
    return '<div class="pill">'+"".join(out)+'</div>'

def esc(s): return html.escape(s,quote=False)
def inline(s):
    s=esc(s)
    s=re.sub(r"`([^`]+)`",lambda m:"<code>"+m.group(1)+"</code>",s)
    s=re.sub(r"\*\*(.+?)\*\*",r"<strong>\1</strong>",s)
    s=re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?!\w)",r"<em>\1</em>",s)
    s=re.sub(r"(?<![\w_])_(?!\s)(.+?)(?<!\s)_(?!\w)",r"<em>\1</em>",s)
    def link(m):
        t,u=m.group(1),m.group(2)
        if u.endswith(".md") and not u.startswith("http"): u=u[:-3]+".html"
        ext=' target="_blank" rel="noopener"' if u.startswith("http") else ''
        return f'<a href="{u}"{ext}>{t}</a>'
    s=re.sub(r"\[([^\]]+)\]\(([^)]+)\)",link,s)
    return s

def convert(md):
    lines=md.split("\n"); i=0; out=[]; fm={}
    if lines and lines[0].strip()=="---":
        j=1; buf=[]
        while j<len(lines) and lines[j].strip()!="---": buf.append(lines[j]); j+=1
        for l in buf:
            m=re.match(r"^(\w+):\s*(.*)$",l)
            if m: fm[m.group(1)]=m.group(2).strip(); key=m.group(1)
            elif l.startswith("  ") and buf: fm[key]=(fm.get(key,"")+" "+l.strip()).strip()
        i=j+1
    title=None
    def flush_para(p):
        if p: out.append("<p>"+inline(" ".join(x.strip() for x in p))+"</p>")
    para=[]
    while i<len(lines):
        l=lines[i]
        if l.startswith("```"):
            flush_para(para); para=[]; j=i+1; code=[]
            while j<len(lines) and not lines[j].startswith("```"): code.append(lines[j]); j+=1
            out.append("<pre><code>"+esc("\n".join(code))+"</code></pre>"); i=j+1; continue
        m=re.match(r"^(#{1,4})\s+(.*)$",l)
        if m:
            flush_para(para); para=[]; lvl=len(m.group(1)); txt=m.group(2).strip()
            if lvl==1 and title is None: title=txt; i+=1; continue
            hid=re.sub(r"[^a-z0-9]+","-",txt.lower()).strip("-")
            out.append(f'<h{lvl} id="{hid}">{inline(txt)}</h{lvl}>'); i+=1; continue
        if l.startswith("|"):
            flush_para(para); para=[]; rows=[]
            while i<len(lines) and lines[i].startswith("|"): rows.append(lines[i]); i+=1
            cells=lambda r:[c.strip() for c in r.strip().strip("|").split("|")]
            head=cells(rows[0]); body=[cells(r) for r in rows[1:] if not re.match(r"^\|?\s*:?-{2,}",r)]
            t='<div class="tbl"><table><thead><tr>'+"".join(f"<th>{inline(c)}</th>" for c in head)+"</tr></thead><tbody>"
            for r in body: t+="<tr>"+"".join(f"<td>{inline(c)}</td>" for c in r)+"</tr>"
            out.append(t+"</tbody></table></div>"); continue
        if l.startswith(">"):
            flush_para(para); para=[]; q=[]
            while i<len(lines) and lines[i].startswith(">"): q.append(lines[i][1:].strip()); i+=1
            paras=[]; cur=[]
            for x in q:
                if x=="" : paras.append(cur); cur=[]
                else: cur.append(x)
            paras.append(cur)
            out.append("<blockquote>"+"".join("<p>"+inline(" ".join(p))+"</p>" for p in paras if p)+"</blockquote>"); continue
        m=re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$",l)
        if m:
            flush_para(para); para=[]; stack=[]; h=""
            while i<len(lines):
                m=re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$",lines[i])
                if not m:
                    if lines[i].strip()=="" and i+1<len(lines) and re.match(r"^\s*([-*]|\d+\.)\s+",lines[i+1]): i+=1; continue
                    if lines[i].startswith("  ") and lines[i].strip() and stack: h+=" "+inline(lines[i].strip()); i+=1; continue
                    break
                ind=len(m.group(1)); tag="ol" if m.group(2)[0].isdigit() else "ul"
                while stack and stack[-1][0]>ind: h+="</li></"+stack.pop()[1]+">"
                if stack and stack[-1][0]==ind: h+="</li>"
                else: stack.append((ind,tag)); h+=f"<{tag}>"
                h+="<li>"+inline(m.group(3)); i+=1
            while stack: h+="</li></"+stack.pop()[1]+">"
            out.append(h); continue
        if l.strip()=="" : flush_para(para); para=[]; i+=1; continue
        para.append(l); i+=1
    flush_para(para)
    return fm,title,"\n".join(out)

SHELL="""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<title>{title}, Mikel Rosenthal</title>
<link rel="stylesheet" href="{prefix}process.css">
<link rel="stylesheet" href="{prefix}docs/docs.css">
</head>
<body>
<div class="ftl" aria-hidden="true"><video autoplay muted loop playsinline poster="{prefix}assets/follow-the-leader.jpg" src="{prefix}assets/follow-the-leader.mp4"></video></div>
<div class="wrap">
  <nav class="top" aria-label="Sections">
    <a href="{prefix}index.html" class="kick">← Main · Mikel Rosenthal</a>
    {nav}
  </nav>
  <main id="main">
{body}
  </main>
  <section class="foot">
    <h2 class="disp">The method, written down</h2>
    <p>Every page here is one file from the skill library. The folder is loadable as a Claude project as-is.</p>
    <div class="links"><a href="{drive}" target="_blank" rel="noopener" class="em">Files on Google Drive ↗</a><a href="{prefix}skill-library.html">Skill library</a><a href="{prefix}working-with-me.html">The method</a></div>
  </section>
</div>
</body>
</html>
"""
CSS="""/* docs pages */
body{margin:0;background:#e5e5e5;color:#000;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-size:16px;line-height:1.25;letter-spacing:-0.011em;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}a:hover{background:#d1ffca}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px 96px;position:relative;z-index:1}
.kick{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:-0.03em;text-transform:uppercase;color:#444}
.disp{font-family:"Archivo",sans-serif;font-variation-settings:'wdth' 62;font-weight:700;text-transform:uppercase;letter-spacing:-0.03em;line-height:0.9;margin:0}
nav.top{min-height:8rem;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:16px 0}
.pill{background:#fff;border-radius:48px;padding:12px 20px;display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.pill a{font-size:16px;font-weight:500;color:#444;padding:8px 14px;border-radius:64px}
.pill a[aria-current="page"]{background:#000;color:#fff}
.ftl{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none;background:#e5e5e5}
.ftl video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:invert(1);mix-blend-mode:multiply;opacity:.14}
@media (prefers-reduced-motion:reduce){.ftl video{display:none}}
.dochead{background:var(--p-tint,#dcd6ff);border-radius:40px;padding:clamp(28px,5vw,56px);margin-bottom:24px}
.dochead .chip{display:inline-block;background:#000;color:#fff;padding:8px 14px;border-radius:64px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;letter-spacing:-0.03em;text-transform:uppercase}
.dochead h1{font-size:clamp(40px,7vw,96px);margin:24px 0 16px}
.dochead p.desc{font-size:clamp(18px,2.2vw,24px);line-height:1.2;max-width:60ch;margin:0}
.doclayout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,280px);gap:24px;align-items:start}
@media (max-width:900px){.doclayout{grid-template-columns:1fr}}
article.doc{background:#fff;border-radius:32px;padding:clamp(28px,4vw,48px);font-size:17px;line-height:1.5;letter-spacing:-0.005em;min-width:0}
.doc h2{font-family:"Archivo",sans-serif;font-variation-settings:'wdth' 62;font-weight:700;text-transform:uppercase;letter-spacing:-0.03em;line-height:0.95;font-size:clamp(28px,3.4vw,40px);margin:40px 0 14px;padding-top:24px;border-top:1px solid #c6c6c6}
.doc h2:first-child{margin-top:0;padding-top:0;border-top:0}
.doc h3{font-size:20px;line-height:1.2;letter-spacing:-0.02em;margin:28px 0 10px}
.doc h4{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;text-transform:uppercase;letter-spacing:-0.03em;color:#444;margin:24px 0 8px;font-weight:400}
.doc p{margin:0 0 14px;max-width:72ch}
.doc ul,.doc ol{margin:0 0 16px;padding-left:24px;max-width:72ch}.doc li{margin:0 0 6px}.doc li>ul,.doc li>ol{margin-top:6px}
.doc code{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.88em;background:#f3f3f3;padding:2px 6px;border-radius:6px}
.doc pre{background:#000;color:#fff;border-radius:16px;padding:20px 24px;overflow-x:auto;font-size:14px;line-height:1.5;margin:0 0 18px}.doc pre code{background:none;padding:0;color:inherit;font-size:inherit}
.doc blockquote{margin:0 0 18px;padding:16px 20px;background:#fff100;border-radius:16px;max-width:72ch}.doc blockquote p:last-child{margin:0}
.doc .tbl{overflow-x:auto;margin:0 0 18px}.doc table{border-collapse:collapse;width:100%;font-size:15px;line-height:1.35}
.doc th{text-align:left;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;text-transform:uppercase;letter-spacing:-0.03em;color:#444;font-weight:400;padding:8px 10px;border-bottom:1px solid #c6c6c6;white-space:nowrap}
.doc td{padding:10px;border-bottom:1px solid #f3f3f3;vertical-align:top}
.doc a{text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:3px}
.doc strong{font-weight:600}
aside.side{position:sticky;top:24px;display:flex;flex-direction:column;gap:16px}
.side .box{background:#fff;border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:8px}
.side .box h3{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;text-transform:uppercase;letter-spacing:-0.03em;color:#444;font-weight:400;margin:0 0 6px}
.side .box a{display:block;padding:8px 10px;border-radius:10px;font-size:15px;font-weight:500;color:#444}
.side .box a[aria-current="page"]{background:#000;color:#fff}
.side .box a.raw{background:#fff100;color:#000;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:13px;text-align:center;padding:12px;border-radius:64px;margin-top:6px}
.side .box a.raw:hover{background:#d1ffca}
/* docs index */
.group{border-radius:40px;padding:clamp(28px,5vw,56px);margin-bottom:24px}
.group h2{font-size:clamp(32px,5vw,64px);margin:16px 0 8px}
.group p.lede{color:#444;max-width:60ch;margin:0 0 28px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px}
.cards a{background:#fff;border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:8px;min-height:120px}
.cards a:hover{background:#000;color:#fff}.cards a:hover .kick,.cards a:hover .sub{color:#c6c6c6}
.cards a .t{font-size:18px;line-height:1.25;font-weight:500}
.cards a .sub{font-size:14px;color:#444;line-height:1.3}
.foot{background:#000;color:#fff;border-radius:64px 64px 32px 32px;padding:clamp(40px,7vw,96px) clamp(28px,5vw,64px);margin-top:80px}
.foot h2{font-size:clamp(40px,8vw,104px);margin:0 0 24px}
.foot p{color:#979797;font-size:clamp(18px,2.4vw,28px);line-height:1.2;max-width:46ch;margin:0 0 32px}
.foot .links{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:14px;display:flex;gap:16px;flex-wrap:wrap;align-items:center}
.foot .links a{color:#fff}.foot .links a.em{background:#fff100;color:#000;padding:12px 18px;border-radius:64px}
"""
TINTS=["#dcd6ff","#cfe4ff","#ffd9c2","#d1ffca"]
GROUP_LABEL={"":"Guides","examples":"Worked examples"}
files=sorted(glob.glob(os.path.join(SRC,"**","*.md"),recursive=True))
docs=[]
for p in files:
    rel=os.path.relpath(p,SRC); fm,title,body=convert(open(p,encoding="utf-8").read())
    d=os.path.dirname(rel); top=d.split(os.sep)[0] if d else ""
    docs.append(dict(src=p,rel=rel,out=rel[:-3]+".html",dir=d,top=top,fm=fm,title=title or os.path.basename(rel)[:-3],body=body))
# group → tint
tops=[]
for d in docs:
    if d["top"] not in tops: tops.append(d["top"])
tint={t:TINTS[i%4] for i,t in enumerate(tops)}
os.makedirs(OUT,exist_ok=True); open(os.path.join(OUT,"docs.css"),"w").write(CSS)
for d in docs:
    depth=d["out"].count("/")+1; prefix="../"*depth
    sib=[x for x in docs if x["top"]==d["top"]]
    side='<aside class="side"><div class="box"><h3>'+esc(GROUP_LABEL.get(d["top"],d["top"]))+'</h3>'
    for x in sib:
        cur=' aria-current="page"' if x is d else ''
        href=os.path.relpath(x["out"],os.path.dirname(d["out"]) or ".")
        side+=f'<a href="{href}"{cur}>{esc(x["title"])}</a>'
    raw=prefix+"skills/"+d["rel"]
    side+=f'<a class="raw" href="{raw}" target="_blank" rel="noopener">Raw markdown ↗</a></div>'
    side+=f'<div class="box"><h3>Library</h3><a href="{prefix}docs/index.html">All documents</a><a href="{prefix}skill-library.html">Skill library page</a><a href="{prefix}intake.html">Intake form</a></div></aside>'
    kicker="Docs · skills/"+d["rel"]
    desc=d["fm"].get("description","")
    head=f'<header class="dochead" style="--p-tint:{tint[d["top"]]}"><span class="chip">{esc(kicker)}</span><h1 class="disp">{esc(d["title"])}</h1>'+(f'<p class="desc">{esc(desc)}</p>' if desc else '')+'</header>'
    body=head+'<div class="doclayout"><article class="doc">'+d["body"]+'</article>'+side+'</div>'
    outp=os.path.join(OUT,d["out"]); os.makedirs(os.path.dirname(outp),exist_ok=True)
    open(outp,"w",encoding="utf-8").write(SHELL.format(title=esc(d["title"]),prefix=prefix,nav=nav(prefix,None),body=body,drive=DRIVE))
# index
groups=[]
for t in tops:
    items=[x for x in docs if x["top"]==t]
    label=GROUP_LABEL.get(t,t); groups.append((t,label,items))
gh=""
order=[""]+[t for t in tops if t not in ("","examples")]+["examples"]
ORDER_GUIDES=["README.md","DEMO.md","LOOM.md","PROJECT-INSTRUCTIONS.md"]
for i,t in enumerate(order):
    items=[x for x in docs if x["top"]==t]
    if t=="": items.sort(key=lambda x:ORDER_GUIDES.index(x["rel"]) if x["rel"] in ORDER_GUIDES else 99)
    else: items.sort(key=lambda x:(0 if x["rel"].endswith("SKILL.md") else 1, x["rel"]))
    label=GROUP_LABEL.get(t,t); lede={"":"Start here: what the library is, how to demo it, and how to load it as a Claude project.","examples":"The nine skills run end to end on one composite project, so the output shape is visible before anyone runs a prompt."}.get(t,"")
    cards="".join(f'<a href="{x["out"]}"><span class="kick">{esc(os.path.basename(x["rel"]))}</span><span class="t">{esc(x["title"])}</span>'+(f'<span class="sub">{esc(x["fm"].get("description",""))[:140]}</span>' if x["fm"].get("description") else '')+'</a>' for x in items)
    gh+=f'<section class="group" style="background:{TINTS[i%4]}"><span class="kick" style="display:inline-block;background:#000;color:#fff;padding:8px 14px;border-radius:64px">{len(items)} file{"s" if len(items)!=1 else ""}</span><h2 class="disp">{esc(label)}</h2>'+(f'<p class="lede">{lede}</p>' if lede else '')+f'<div class="cards">{cards}</div></section>'
head='<header class="dochead" style="--p-tint:#fff;background:#000;color:#fff"><span class="chip" style="background:#d1ffca;color:#000">Docs · skills/</span><h1 class="disp">The library,<br>as pages</h1><p class="desc" style="color:#979797">Every markdown file in the skill folder, rendered with navigation. The raw files stay where they are for loading into a Claude project.</p></header>'
open(os.path.join(OUT,"index.html"),"w",encoding="utf-8").write(SHELL.format(title="Docs",prefix="../",nav=nav("../","docs/index.html"),body=head+gh,drive=DRIVE))
print("built",len(docs),"pages +",len(order),"groups")
