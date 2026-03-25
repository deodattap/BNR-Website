import re, os, glob

BASE = r'c:\Users\pdeod\OneDrive\Desktop\BNR-Website'

# The canonical footer from index.html — dark, 4-column
CANONICAL_FOOTER = '''<footer class="site-footer reveal">
<div class="container">
<div class="footer-grid">
<div class="footer-logo-wrap">
<div class="footer-logo">
<img src="assets/logo/bnr-logo.jpg" alt="BNR Infrastructure Logo" style="max-height: 40px; width: auto; filter: brightness(0) invert(1);">
</div>
<p style="font-size: 0.875rem; line-height: 1.6; margin-bottom: 1.5rem;">Defining structural engineering excellence since 1974. Headquartered in Chennai, operating Pan-India.</p>
<div class="social-links">
<a class="social-btn" href="#"><span class="material-symbols-outlined">share</span></a>
<a class="social-btn" href="#"><span class="material-symbols-outlined">public</span></a>
</div>
</div>
<div>
<h5 class="footer-heading">Quick Links</h5>
<ul class="footer-links">
<li><a href="about.html">Our Story</a></li>
<li><a href="policy.html">Safety Policy</a></li>
<li><a href="projects.html">Project Portfolio</a></li>
<li><a href="clients.html">Our Clients</a></li>
</ul>
</div>
<div>
<h5 class="footer-heading">Expertise</h5>
<ul class="footer-links">
<li><a href="services.html">Highway Development</a></li>
<li><a href="services.html">Bridge Engineering</a></li>
<li><a href="services.html">Urban Transit</a></li>
<li><a href="services.html">Foundation Work</a></li>
</ul>
</div>
<div>
<h5 class="footer-heading">Headquarters</h5>
<div class="contact-info">
1018, 42nd Street TVS Colony,<br/>Anna Nagar West Extn, Chennai \u2013 600101
<span class="contact-bold">T: (044) \u2013 43838511</span>
<span class="contact-bold">E: mail@bnrinfra.com</span>
</div>
</div>
</div>
<div class="footer-bottom">
<p>\u00a9 2024 BNR Infrastructure Excellence. All rights reserved.</p>
<div class="bottom-links">
<a href="policy.html">Privacy Policy</a>
<a href="policy.html">Terms of Service</a>
<a href="#">Sitemap</a>
</div>
</div>
</div>
</footer>'''

# Required CSS for the dark footer — injected if not present
FOOTER_CSS = '''
        /* ── SITE FOOTER (canonical) ── */
        .site-footer {
            background-color: #0f172a;
            color: #94a3b8;
            padding: 4rem 1.5rem;
        }
        .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;
        }
        @media (min-width: 768px) {
            .footer-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .footer-logo-wrap { grid-column: span 1; }
        .footer-logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: white;
            font-weight: 800;
            font-size: 1.125rem;
            margin-bottom: 1.5rem;
        }
        .social-links { display: flex; gap: 1rem; margin-top: 1.5rem; }
        .social-btn {
            width: 40px; height: 40px;
            border-radius: 9999px;
            border: 1px solid #1e293b;
            display: flex; align-items: center; justify-content: center;
            color: inherit; text-decoration: none;
            transition: all 0.3s;
        }
        .social-btn:hover { background-color: #144bb8; border-color: #144bb8; color: white; }
        .footer-heading { color: white; font-weight: 700; margin-bottom: 1.5rem; }
        .footer-links { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: 1rem; }
        .footer-links a { color: inherit; text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
        .footer-links a:hover { color: #144bb8; }
        .contact-info { font-size: 0.875rem; line-height: 1.6; }
        .contact-bold { color: white; font-weight: 700; display: block; margin-top: 1rem; }
        .footer-bottom {
            margin-top: 4rem; padding-top: 2rem;
            border-top: 1px solid #1e293b;
            display: flex; flex-direction: column; gap: 1rem; font-size: 0.75rem;
        }
        @media (min-width: 768px) {
            .footer-bottom { flex-direction: row; justify-content: space-between; }
        }
        .bottom-links { display: flex; gap: 1.5rem; }
        .bottom-links a { color: inherit; text-decoration: none; }
        .bottom-links a:hover { color: white; }'''

# Pages to update (skip index.html which is the reference)
SKIP = {'index.html', 'admin-login.html', 'admin-dashboard.html'}

files = glob.glob(os.path.join(BASE, '*.html'))
updated = []
skipped = []

for f in files:
    name = os.path.basename(f)
    if name in SKIP:
        skipped.append(name)
        continue

    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()

    # Replace footer block (everything between <footer ...> and </footer>)
    new_content = re.sub(
        r'<footer[^>]*>.*?</footer>',
        CANONICAL_FOOTER,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    # Inject footer CSS if this page doesn't have .footer-grid defined
    if '.footer-grid' not in new_content and 'SITE FOOTER (canonical)' not in new_content:
        # Insert before </style> (first occurrence)
        new_content = new_content.replace('</style>', FOOTER_CSS + '\n        </style>', 1)

    if new_content != content:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(new_content)
        updated.append(name)
    else:
        skipped.append(name + ' (no change)')

print('Updated:', updated)
print('Skipped:', skipped)
