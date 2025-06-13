import re
import os


#Usage: Run this file to convert a .tex file into a .astro file
#tex files are read from tex/course/page.tex
#astro files are written to Astro/coursetags[course]/page.astro

coursetags = {
    'md':'Machine Design',
}

course = 'md'
page='vw'

tex_files = list(sorted([file[:-4] for file in os.listdir(f'tex/{course}') if file[-4:] == '.tex' and (file != 'main.tex')]))

print(tex_files)

if not os.path.exists(f'Astro/{coursetags[course]}'):
     os.mkdir(f'Astro/{coursetags[course]}')


replacements = {
    'section': 'Section',
    'subsection': 'SubSection',
    'subsubsection': 'SubSubSection',
    'blue': 'BlueText',
    'red': 'RedText',
    'textit': 'em',
    'textbf': 'strong',
    "caption": "em"
}

for filename in tex_files:
    required_modules = ['Image']

    tex_path = f"tex/{course}/{filename}.tex"

    astro_path = f"astro/{coursetags[course]}/{filename.lower().replace(' ', '_')}.astro"

    with open(tex_path, 'r+') as file:
        raw = file.read()

        # Remove preamble LaTeX
        raw = re.sub(r'\\documentclass\{.*?\}', '', raw)
        raw = re.sub(r'\\usepackage\{.*?\}', '', raw)
        raw = re.sub(r'%.*', '', raw)
        raw = re.sub(r'\\title\{.*?\}', '', raw)
        raw = re.sub(r'\\author\{.*?\}', '', raw)
        raw = re.sub(r'\\date\{.*?\}', '', raw)
        raw = re.sub(r'\\begin\{document\}', '', raw)
        raw = re.sub(r'\\maketitle', '', raw)
        raw = re.sub(r'\\newenvironment\{callout\}\s*\{[^}]*\}\s*\{[^}]*\}','',raw,flags=re.DOTALL)
        raw = re.sub(r'\n\s*\n+', '\n', raw)

        # -=-=-=- Start of Section/subsection/subsubsection structure -=-=-=- 
        section_regex = re.compile(r'\\(section|subsection|subsubsection)\{([^}]+)\}')

        # Split raw into tokens: section commands and in-between content
        tokens = []
        last_pos = 0
        for match in section_regex.finditer(raw):
            start, end = match.span()
            cmd_type, title = match.group(1), match.group(2)
            # Save text before this heading
            if start > last_pos:
                tokens.append(('text', raw[last_pos:start].strip()))

            tokens.append((cmd_type, title.strip()))
            last_pos = end
        if last_pos < len(raw):
            tokens.append(('text', raw[last_pos:].strip()))

        #Map commands to astro components
        tag_map = {
            'section': ('SubSection', 1, ''),  
            'subsection': ('SubSubSection', 2, ''),
            'subsubsection': ('SubSubSubSection', 3, '')
        }

        # -=-=-=- Build Output HTML and NavTree -=-=-=- 
        output = []
        stack = []
        navtree_entries = []

        for token in tokens:
            if token[0] in tag_map:
                # Close previous section if needed
                if stack:
                    output.append(f'</{stack[-1]}>')
                    stack.pop()
                cmd_type, title = token
                tag, level, _ = tag_map[cmd_type]
                navtree_entries.append((level, title))
                output.append(f'<{tag} title="{title}" id="{title}">')
                stack.append(tag)
            elif token[0] == 'text' and token[1]:
                output.append(token[1])

        # Close any open sections at the end
        while stack:
            output.append(f'</{stack.pop()}>')

        raw = "\n".join(output)

        # -=-=- Wrap all adjacent <CalloutCard> blocks into a single <CalloutContainer> -=-=- 
        raw = re.sub(r'((<CalloutCard[\s\S]*?</CalloutCard>\s*)+)',
            lambda m: f"<CalloutContainer slot=\"cards\">\n{m.group(1)}</CalloutContainer>",
            raw
        )
        required_modules.append("CalloutContainer")

        # -=-=-=- Generate the navtree -=-=-=-=- 
        def generate_navtree(entries):
            nav_html = '<div slot="navtree">\n<ul class="list-group list-group-flush py-0">\n'
            prev_level = 1
            for i, (level, title) in enumerate(entries):
                if level > prev_level:
                    nav_html += "<ul>\n" * (level - prev_level)
                elif level < prev_level:
                    nav_html += "</ul>\n</li>\n" * (prev_level - level)
                elif i != 0:
                    nav_html += "</li>\n"
                nav_html += f"<li class='list-group-item py-0'><a class='text-decoration-none subsection' href='#{title}'>{title}</a>"
                prev_level = level
            nav_html += "</li>\n" + "</ul>\n" * prev_level + "</div>"
            return nav_html

        navtree_html = generate_navtree(navtree_entries)
        raw = navtree_html + '\n' + raw
        required_modules += ['Section', 'SubSection', 'SubSubSection', 'SubSubSubSection']

        # -=-=- Handle \paragraph{} Commands -=-=-=- 
        paragraph_regex = [
            r"\\paragraph\{([^}]*)\}\s*(.*?)(?=(\\[a-zA-Z]+|\Z))",
            r"\\paragraph\{([^}]*)\}\s*([^\\]*)"
        ]


        # Function to process each match
        def replace_paragraph(match):
            title = match.group(1).strip()
            text = match.group(2).strip()
            # Example transformation: Wrap title and text in a custom format
            return f"<h4><strong>{title}</strong></h4>\n<p>{text}</p> \n\n"


        # Use re.sub to replace all matches
        for p in paragraph_regex:
            raw = re.sub(p, replace_paragraph, raw)

        eregex = r"\\emph\{([^}]*)\}"

        # Use re.sub to replace \emph{} with <strong>
        raw = re.sub(eregex, r"<strong>\1</strong>", raw)

        uregex = r"\\underline\{([^}]*)\}"

        # Use re.sub to replace \emph{} with <strong>
        raw = re.sub(uregex, r"<u>\1</u>", raw)

        refregex = r"\\ref\{([^}]*)\}"

        # Use re.sub to replace \emph{} with <strong>
        raw = re.sub(refregex, r"<OrangeText>\1</OrangeText>", raw)

        eqrefregex = r"~\\eqref\{([^}]*)\}"

        # Use re.sub to replace \emph{} with <strong>
        raw = re.sub(eqrefregex, r"<OrangeText>\1</OrangeText>", raw)

        tealregex = r"\\teal\{([^}]*)\}"

        # Use re.sub to replace \emph{} with <strong>
        raw = re.sub(tealregex, r"<TealText>\1</TealText>", raw)

        blueregex = r"\\blue\{([^}]*)\}"

        # Use re.sub to replace \emph{} with <strong>
        raw = re.sub(blueregex, r"<BlueText>\1</BlueText>", raw)


        def transform_itemize(match):
            items = match.group(1)  # Capture the content inside the environment
            # Replace \item with <Item></Item>
            items_transformed = re.sub(r"\\item\s+(.*)", r"<Item>\1</Item>", items)
            # Wrap the environment content with <Itemize>
            return f"<Itemize>\n{items_transformed}\n</Itemize>"


        # Function to transform \enumerate environments
        def transform_enumerate(match):
            items = match.group(1)  # Capture the content inside the environment
            # Replace \item with <Item></Item>
            items_transformed = re.sub(r"\\item\s+(.*)", r"<Item>\1</Item>", items)
            # Wrap the environment content with <Enumerate>
            return f"<Enumerate>\n{items_transformed}\n</Enumerate>"


        # Regex to match \itemize environments
        itemize_regex = r"\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}"

        # Regex to match \enumerate environments
        enumerate_regex = r"\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}"

        # Apply the transformations
        raw = re.sub(itemize_regex, transform_itemize, raw)
        raw = re.sub(enumerate_regex, transform_enumerate, raw)

        # Regex to match \vspace{} and remove it
        vregex = r"\\vspace\{[^}]*\}"

        # Use re.sub to remove all \vspace commands
        raw = re.sub(vregex, "", raw)

        # -=-=-=- Handle LATEX Callout -=-=-=- 
        callout_regex = r"\\begin\{callout\}([\s\S]*?)\\end\{callout\}"
        def transform_callout(match):
            content = match.group(1).strip()
            required_modules.append("CalloutCard")
            return (
                "<CalloutContainer slot=\"cards\">\n"
                f"    <CalloutCard title=\"Extra!\">\n"
                "        <p class=\"m-0\"><u>Callout Card</u></p>\n"
                f"        {content}\n"
                "    </CalloutCard>\n"
                "</CalloutContainer>"
            )
        raw = re.sub(callout_regex, transform_callout, raw)
        # -=-=-=- End LATEX Callout -=-=-=-=-

        # ADDITIONAL CLEANUP

        # print([e for e in data.subsection.descendants])

        required_modules.append('OrangeText')
        required_modules.append('TealText')

        raw = raw.replace(r'\noindent', '')

        required_modules.append('Enumerate')
        required_modules.append('Item')
        required_modules.append('Itemize')

        patterns = [
            r'\\begin\{equation\}(.*?)\\end\{equation\}',
            r'\\begin\{equation\*\}(.*?)\\end\{equation\*\}',
            r'\\begin\{align\*\}(.*?)\\end\{align\*\}'
        ]

        # Replacement function
        def replace_equation(match):

            content = match.group(1).strip()
            # Extract label if present
            label_match = re.search(r'\\label\{(.*?)\}', content)
            label = label_match.group(1) if label_match else ""
            # Remove the label from the content
            content = re.sub(r'\\label\{.*?\}', '', content).strip()
            # Return the replacement string
            # if "<InlineEquation equation='" in content:
            #    print(1)
            content = content.replace("' />", "\\)")
            content = content.replace('<p>', '').replace('</p>', '').replace('\"', '\'')
            content = content.replace('\\', '\\\\').replace('\n', '')
            return f"<DisplayEquation equation='{content}' title=\"{label}\" />"


        table_regex = r"\\begin{tabular\*}{[^}]*}([\s\S]*?)\\end{tabular\*}"


        def latex_to_html_table(match):
            latex_table = match.group(1).replace("\n", '').replace('\t', '')

            # Split rows by \\ (escaping backslash for regex)
            rows = [row.strip() for row in latex_table.split(r"\\") if row.strip()]

            # Separate the header and content rows
            header_row = None
            content_rows = []
            for row in rows:
                if r"\hline" in row:
                    continue  # Skip \hline rows
                if header_row is None:  # First valid row is treated as the header
                    header_row = row
                else:
                    content_rows.append(row)

            # Convert header row to <thead>
            if header_row:
                header_cols = [col.strip() for col in header_row.split("&")]
                thead = "<thead>\n<tr>\n" + "".join(f"<th>{col}</th>" for col in header_cols) + "\n</tr>\n</thead>"
            else:
                thead = ""

            # Convert content rows to <tbody>
            tbody_rows = []
            for row in content_rows:
                cols = [col.strip() for col in row.split("&")]
                tbody_row = "<tr>\n" + "".join(f"<td>{col}</td>" for col in cols) + "\n</tr>"
                tbody_rows.append(tbody_row)
            tbody = "<tbody>\n" + "\n".join(tbody_rows) + "\n</tbody>"

            # Combine <thead> and <tbody> into <table>
            html_table = "<table border='1'>\n" + thead + "\n" + tbody + "\n</table>"
            return html_table.replace('<p>', '').replace('</p>', '')


        # Replace LaTeX tables with HTML tables
        raw = re.sub(table_regex, latex_to_html_table, raw)

        # Regex to match the entire table* block
        table_star_regex = r"\\begin\{table\*\}[\s\S]*?\\end\{table\*\}"


        # Function to process and remove \label within the matched table* block
        def remove_table_star_and_labels(match):
            table_content = match.group(0)
            # Remove any \label inside the table* block
            table_content = re.sub(r"\\label\{[^}]*\}", "", table_content)
            # Remove \begin{table*} and \end{table*}
            table_content = re.sub(r"\\begin\{table\*\}|\\end\{table\*\}", "", table_content)
            return table_content.strip().replace('[h]', '').replace(r'\small', '')


        # Apply the regex to transform the content
        raw = re.sub(table_star_regex, remove_table_star_and_labels, raw)

        # Perform the replacement
        for pattern in patterns:
            raw = re.sub(pattern, replace_equation, raw, flags=re.DOTALL)

        # -=-=-=- Start LATEX Math Conversion -=-=-=- 

        # Protect escaped dollar signs in the case use of literal dollar signs
        raw = raw.replace(r'\$', '__DOLLAR__')

        required_modules.append("InlineEquation")
        required_modules.append("DisplayEquation")

        # \begin{equation}...\end{equation}
        def transform_equation_env(match):
            content = match.group(1).strip()
            content = re.sub(r'\\label\{.*?\}', '', content).strip()
            content = content.replace('\\', '\\\\').replace('"', '\\"')
            return '\n<DisplayEquation equation="{}" title="" />\n'.format(content)
        raw = re.sub(r'\\begin\{equation\}([\s\S]*?)\\end\{equation\}', transform_equation_env, raw)

        # $$...$$
        raw = re.sub(
            r'\$\$([\s\S]*?)\$\$',
            lambda m: '\n<DisplayEquation equation="{}" title="" />\n'.format(
                m.group(1).strip().replace('\\', '\\\\').replace('"', '\\"')
            ),
            raw
        )
        # \[...\]
        raw = re.sub(
            r'\\\[(.*?)\\\]',
            lambda m: '\n<DisplayEquation equation="{}" title="" />\n'.format(
                re.sub(r'\s+', ' ', m.group(1).strip()).replace('\\', '\\\\').replace('"', '\\"')
            ),
            raw,
            flags=re.DOTALL
        )
        # Inline math: $...$
        raw = re.sub(
            r'\$(.+?)\$',
            lambda m: '<InlineEquation equation="{}" />'.format(
                m.group(1).strip().replace('\\', '\\\\').replace('"', '\\"')
            ),
            raw
        )
        # Wrap plain text if not already wrapped
        raw = re.sub(
            r'(?<![<\w])\n([^\n<>]+?)\n(?!\s*<)',
            lambda m: '\n<p>{}</p>\n'.format(m.group(1).strip()),
            raw
        )

        # Remove <p> wrapping around equations
        raw = re.sub(r'<p>\s*(<DisplayEquation .*?/>)\s*</p>', r'\1', raw)
        raw = re.sub(r'<p>\s*(<InlineEquation .*?/>)\s*</p>', r'\1', raw)

        # Restore escaped dollar signs
        raw = raw.replace('__DOLLAR__', '$')

        # -=-=-=-  End LATEX Math -=-=-=- 

        # -=-=- Remove \section* and wrap manually -=-=- 
        raw = re.sub(r'\\section\*\{([^}]*)\}', lambda m: f"<Section title=\"{m.group(1)}\">", raw)
        raw = re.sub(r'\\subsection\*\{([^}]*)\}', lambda m: f"<SubSection title=\"{m.group(1)}\">", raw)
        raw = re.sub(r'\\subsubsection\*\{([^}]*)\}', lambda m: f"<SubSubSection title=\"{m.group(1)}\">", raw)

        #Paragraph-wrapping regex update
        def safe_wrap_paragraphs(text):
            lines = text.split("\n")
            result = []
            for line in lines:
                stripped = line.strip()
                if not stripped:
                    result.append("")
                elif re.match(r'^\s*</?\w+.*?>\s*$', stripped): 
                    result.append(line)
                elif stripped.startswith("<") and stripped.endswith(">"):
                    result.append(line)
                else:
                    result.append(f"<p>{stripped}</p>")
            return "\n".join(result)
        raw = safe_wrap_paragraphs(raw)
        # -=-=-=- End of Sectioning -=-=-=-=- 

        imports = 'import Layout from "../../layouts/Layout.astro" \n'

        #Organized imports and no more than one import
        required_modules = list(dict.fromkeys(required_modules)) 
        for comp in required_modules:
            imports += f'import {comp} from "../../components/{comp}.astro" \n'

        figregex = r"\\begin\{figure\}.*?\\end\{figure\}"

        # Use re.sub to remove all figure environments
        raw = re.sub(figregex, "", raw, flags=re.DOTALL)

        # print(imports)

        #Removes \end{document} add greater checks later?
        raw = re.sub(r'\\end\{document\}', '', raw)
        
        raw = '---\n' + imports + '---\n' + f'<Layout title="{filename}">' + '\n' + raw + '\n' + '</Layout>'

        raw = raw.replace("<p></p>", "")

        astro_file = open(astro_path, mode='w+')

        astro_file.write(raw)

        astro_file.close()
