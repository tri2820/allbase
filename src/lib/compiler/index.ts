import DOMPurify from "dompurify";

const exampleHtml = `
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="This is an example page." />
        <title>Example Page</title>
        <link rel="stylesheet" href="/assets/styles.css" onload="alert('CSS Loaded')" />
        <link rel="stylesheet" href="another-style.css" />
        <script src="script.js"></script>
        <script>alert('Malicious Script #1');</script>
        <script type="text/javascript">
            document.body.innerHTML = 'Malicious Script #2 - Content Replaced';
        </script>
    </head>
    <body onload="alert('Body loaded')" onmouseover="alert('Mouse Over')" onscroll="alert('Scrolling')">
        <div id="app" onclick="alert('App Clicked')" style="background: url(javascript:alert('Injected URL'));">
            Welcome to the app! <iframe src="javascript:alert('Embedded JS iframe')" style="display:none"></iframe>
        </div>
        <p onmouseover="alert('Hovered over text')">This should not be allowed.</p>
        <a href="javascript:alert('JavaScript Link Clicked')">Click Me</a>
        <button onclick="alert('Button Clicked')">Malicious Button</button>
        <img src="invalid-image.png" onerror="alert('Image Failed to Load - Trigger JS')" />
        <form action="javascript:alert('Form Submission Executed')" method="post">
            <input type="text" name="maliciousInput" value="Malicious Value" />
            <input type="submit" value="Submit Malicious Form" />
        </form>
    </body>
    </html>`;

// Define types for head and body elements
interface ScriptElement {
    src?: string;
    content?: string;
}

interface StylesheetElement {
    href: string;
}

interface MetaElement {
    name: string;
    content: string;
}

interface HeadElements {
    scripts: ScriptElement[];
    stylesheets: StylesheetElement[];
    metas: MetaElement[];
}

interface ExtractedHTML {
    body: {
        scripts: ScriptElement[];
        content: string; // To hold the sanitized body content
    };
    head: HeadElements;
}

function sanitizeHTML(dirtyHTML: string): string {
    return DOMPurify.sanitize(dirtyHTML, {
        ALLOWED_TAGS: ['a', 'b', 'i', 'u', 'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
        FORBID_ATTR: ['style'],
        KEEP_CONTENT: false
    });
}

export function extractAndSanitize(html: string): ExtractedHTML {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Initialize head elements structure
    const headElements: HeadElements = {
        scripts: [],
        stylesheets: [],
        metas: []
    };

    // Extract <script> tags from head
    const headScripts = doc.head.getElementsByTagName('script');
    for (const script of headScripts) {
        if (script.src) {
            headElements.scripts.push({ src: script.src });
        } else {
            headElements.scripts.push({ content: script.innerHTML.trim() });
        }
    }

    // Extract <link> tags (CSS)
    const links = doc.head.getElementsByTagName('link');
    for (const link of links) {
        if (link.rel === 'stylesheet') {
            headElements.stylesheets.push({ href: link.href });
        }
    }

    // Extract <meta> tags
    const metas = doc.head.getElementsByTagName('meta');
    for (const meta of metas) {
        if (meta.name) {
            headElements.metas.push({ name: meta.name, content: meta.content });
        }
    }

    // Extract <script> tags from body
    const bodyScripts: ScriptElement[] = [];
    const bodyScriptsElements = doc.body.getElementsByTagName('script');
    for (const script of bodyScriptsElements) {
        if (script.src) {
            bodyScripts.push({ src: script.src });
        } else {
            bodyScripts.push({ content: script.innerHTML.trim() });
        }
        script.remove(); // Remove script from the body to prevent execution
    }

    // Extract and sanitize body content
    const bodyContent = doc.body.innerHTML;
    const sanitizedBody = sanitizeHTML(bodyContent);

    return {
        body: {
            scripts: bodyScripts,
            content: sanitizedBody
        },
        head: headElements
    };
}

export const test = () => {
    const { head, body } = extractAndSanitize(exampleHtml);

    console.log('Head Elements:', head);
    console.log('Body Scripts:', body.scripts);
    console.log('Sanitized Body:', body.content);
};
