import shutil
import os
from pathlib import PurePath

banned_dirs = [
    'Dynamics',
    'Solid_Mechanics',
    'Statics',
    'mathjax',
    'static',
    '_astro'
]

home = os.path.join(os.getcwd(), 'dist')

def explore_dir_and_move(home, dir):
    #print(os.path.join(home, dir))
    dirs = [d for d in os.listdir(os.path.join(home, dir)) if (os.path.isdir(os.path.join(os.path.join(home, dir), d)) and d not in banned_dirs)]
    htmls = [d for d in os.listdir(os.path.join(home, dir)) if (d == 'index.html')]
    js = [d for d in os.listdir(os.path.join(home, dir)) if (d[-3:] == '.js')]
    #print(dirs, htmls, js)
    if dir != '':
        for h in htmls:
            try:
                
                ppth = PurePath(os.path.join(os.path.join(home, dir), h))
                file_name = ppth.parts[-2]+'.html'
                #print(os.path.join("/".join(ppth.parts[:-2]), file_name))
                shutil.move(os.path.join(os.path.join(home, dir), h), os.path.join("/".join(ppth.parts[:-2]), file_name))
            except Exception as e:
                print(e)
                pass

        for j in js:
            try:
                
                ppth = PurePath(os.path.join(os.path.join(home, dir), j))
                file_name = ppth.parts[-2]+'.js'
                
                if j == 'canvases.js':
                    #print(os.path.join("/".join(ppth.parts[:-2]), file_name))
                    shutil.move(os.path.join(os.path.join(home, dir), j), os.path.join("/".join(ppth.parts[:-2]), file_name))
                else:
                    #print(os.path.join("/".join(ppth.parts[:-2]), j))
                    shutil.move(os.path.join(os.path.join(home, dir), j), os.path.join("/".join(ppth.parts[:-2]), j))
            except Exception as e:
                print(e)
                pass
        
    for d in dirs:
        explore_dir_and_move(home, os.path.join(dir, d))
    return dirs

explore_dir_and_move(home, '')

## PAGES WITH CONTENT

links_to_replace = {
    "href=\"/favicon2.png\"":"href=\"../favicon2.png\"",
    "href=\"/bootstrap.min.css\"": "href=\"../bootstrap.min.css\"",
    "src=\"/bootstrap.min.js\"": "src=\"../bootstrap.min.js\"",
    "src=\"/mathjax/tex-chtml.js\"": "src=\"../mathjax/tex-chtml.js\"",
    "src=\"/jquery-2.1.4.min.js\"": "src=\"../jquery-2.1.4.min.js\"",
    "src=\"/PrairieDraw.js\"": "src=\"../PrairieDraw.js\"",
    "src=\"/PrairieGeom.js\"": "src=\"../PrairieGeom.js\"",
    "src=\"/sha1.js\"": "src=\"../sha1.js\"",
    "src=\"/sylvester.js\"": "src=\"../sylvester.js\"",
    "src=\"/static/js/simplified_view.js\"": "src=\"../static/js/simplified_view.js\"",
    "href=\"/static/css/main.css\"": "href=\"../static/css/main.css\"",
    "href=\"/static/css/sidebar.css\"": "href=\"../static/css/sidebar.css\"",
    'href="/"': 'href="../index.html"',
    "href=\"/sta\"": "href=\"../sta.html\"",
    "href=\"/sol\"": "href=\"../sol.html\"",
    "href=\"/dyn\"": "href=\"../dyn.html\"",
    "href=\"/sta/": "href=\"../sta/",
    "href=\"/sol/": "href=\"../sol/",
    "href=\"/dyn/": "href=\"../dyn/",
    "src=\"/sta/": "src=\"../sta/",
    "src=\"/sol/": "src=\"../sol/",
    "src=\"/dyn/": "src=\"../dyn/",
    "src=\"/Statics/": "src=\"../Statics/",
    "src=\"/Solid_Mechanics/": "src=\"../Solid_Mechanics/",
    "src=\"/Dynamics/": "src=\"../Dynamics/"
}

all_content_pages = os.listdir(os.path.join(home, 'sta')) + os.listdir(os.path.join(home, 'sol')) + os.listdir(os.path.join(home, 'dyn'))

all_content_pages = [p for p in all_content_pages if p[-5:] == '.html']

hrefs ={'/'+p.replace('.html', ''): '/'+p for p in all_content_pages}

for dir in ['dyn', 'sta', 'sol']:
    pages = [p for p in os.listdir(os.path.join(home, dir)) if p[-5:] == '.html']
    for page in pages:
        print(page)
        with open(os.path.join(home, os.path.join(dir, page)), 'r') as file:
            data = file.read()

        for wrong, correct in links_to_replace.items():
            data = data.replace(wrong, correct)

        for wrong, correct in hrefs.items():
            data = data.replace(wrong, correct)

        data = data.replace('.html/canvases', '')
        data = data.replace("../dyn/particle_kinetics.html/particle_kinetics.html.js", "../dyn/particle_kinetics.js")
        data = data.replace("../dyn/vectors.html/worldCoastlineCompressed.js", './worldCoastlineCompressed.js')
        data = data.replace("../dyn/vectors.html/py_triples.js", "./py_triples.js",)
        with open(os.path.join(home, os.path.join(dir, page)), 'w') as file:
            file.write(data)

## COURSE HOME PAGES

links_to_replace = {
    "href=\"/favicon2.png\"":"href=\"./favicon2.png\"",
    "href=\"/bootstrap.min.css\"": "href=\"./bootstrap.min.css\"",
    "src=\"/bootstrap.min.js\"": "src=\"./bootstrap.min.js\"",
    "src=\"/mathjax/tex-chtml.js\"": "src=\"./mathjax/tex-chtml.js\"",
    "src=\"/jquery-2.1.4.min.js\"": "src=\"./jquery-2.1.4.min.js\"",
    "src=\"/PrairieDraw.js\"": "src=\"./PrairieDraw.js\"",
    "src=\"/PrairieGeom.js\"": "src=\"./PrairieGeom.js\"",
    "src=\"/sha1.js\"": "src=\"./sha1.js\"",
    "src=\"/sylvester.js\"": "src=\"./sylvester.js\"",
    "src=\"/static/js/simplified_view.js\"": "src=\"./static/js/simplified_view.js\"",
    "href=\"/static/css/main.css\"": "href=\"./static/css/main.css\"",
    "href=\"/static/css/sidebar.css\"": "href=\"./static/css/sidebar.css\"",
    'href="/"': 'href="./index.html"',
    "href=\"/sta\"": "href=\"./sta.html\"",
    "href=\"/sol\"": "href=\"./sol.html\"",
    "href=\"/dyn\"": "href=\"./dyn.html\"",
    "href=\"/sta/": "href=\"./sta/",
    "href=\"/sol/": "href=\"./sol/",
    "href=\"/dyn/": "href=\"./dyn/",
    "src=\"/Statics/": "src=\"./Statics/",
    "src=\"/Solid_Mechanics/": "src=\"./Solid_Mechanics/",
    "src=\"/Dynamics/": "src=\"./Dynamics/"
}

all_content_pages = os.listdir(os.path.join(home, 'sta')) + os.listdir(os.path.join(home, 'sol')) + os.listdir(os.path.join(home, 'dyn'))

all_content_pages = [p for p in all_content_pages if p[-5:] == '.html']

hrefs ={'/'+p.replace('.html', ''): '/'+p for p in all_content_pages}

for page in ['index.html', 'dyn.html', 'sta.html', 'sol.html']:
    print(page)
    with open(os.path.join(home, page), 'r') as file:
        data = file.read()

    for wrong, correct in links_to_replace.items():
        data = data.replace(wrong, correct)

    for wrong, correct in hrefs.items():
        data = data.replace(wrong, correct)
    
    with open(os.path.join(home, page), 'w') as file:
        file.write(data)
        
        