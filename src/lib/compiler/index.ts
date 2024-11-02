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

// Define types for head elements
interface ScriptElement {
    src?: string;
    content?: string;
}

interface LinkElement {
    href: string;
}

interface MetaElement {
    name: string;
    content: string;
}

interface HeadElements {
    scripts: ScriptElement[];
    links: LinkElement[];
    metas: MetaElement[];
}

function sanitizeHTML(dirtyHTML: string): string {
    return DOMPurify.sanitize(dirtyHTML, {
        ALLOWED_TAGS: ['a', 'b', 'i', 'u', 'p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
        FORBID_ATTR: ['style'],
        KEEP_CONTENT: false
    });
}

function extractAndSanitize(html: string): { headElements: HeadElements; sanitizedBody: string } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Initialize head elements structure
    const headElements: HeadElements = {
        scripts: [],
        links: [],
        metas: []
    };

    // Extract <script> tags
    const scripts = doc.head.getElementsByTagName('script');
    for (const script of scripts) {
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
            headElements.links.push({ href: link.href });
        }
    }

    // Extract <meta> tags
    const metas = doc.head.getElementsByTagName('meta');
    for (const meta of metas) {
        if (meta.name) {
            headElements.metas.push({ name: meta.name, content: meta.content });
        }
    }

    // Extract and sanitize body content
    const bodyContent = doc.body.innerHTML;
    const sanitizedBody = sanitizeHTML(bodyContent);

    return {
        headElements,
        sanitizedBody
    };
}

export const test = () => {
    const { headElements, sanitizedBody } = extractAndSanitize(exampleHtml);

    console.log('Head Elements:', headElements);
    console.log('Sanitized Body:', sanitizedBody);
};
