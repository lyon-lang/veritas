import os
import glob

pages = [
    "src/app/contact/page.tsx",
    "src/app/privacy/page.tsx",
    "src/app/terms/page.tsx",
    "src/app/status/page.tsx",
    "src/app/docs/page.tsx",
    "src/app/blog/page.tsx",
    "src/app/careers/page.tsx",
    "src/app/cookies/page.tsx",
    "src/app/help/page.tsx"
]

for page in pages:
    if not os.path.exists(page):
        continue
    
    with open(page, 'r') as f:
        content = f.read()
    
    if "import { Footer }" in content or "<Footer />" in content:
        continue
        
    lines = content.split('\n')
    
    # 1. Insert import
    for i, line in enumerate(lines):
        if "export default function" in line:
            lines.insert(i, "import { Footer } from '@/components/footer';")
            break
            
    # 2. Insert <Footer /> before the outermost container closing tag
    # The structure usually ends with `    </div>\n  );\n}`
    # We will search from the bottom to find `  );\n}` or `    </div>\n  );\n}`
    
    new_content = '\n'.join(lines)
    
    # Simple regex or string replace for the end
    # Typically, the component returns a top level <div className="min-h-screen bg-white">
    # We want <Footer /> right before the closing </div> of that min-h-screen div.
    
    if "      </main>\n    </div>\n  );\n}" in new_content:
        new_content = new_content.replace("      </main>\n    </div>\n  );\n}", "      </main>\n      <Footer />\n    </div>\n  );\n}")
    elif "          </main>\n        </div>\n      </div>\n    </div>\n  );\n}" in new_content:
        new_content = new_content.replace("          </main>\n        </div>\n      </div>\n    </div>\n  );\n}", "          </main>\n        </div>\n      </div>\n      <Footer />\n    </div>\n  );\n}")
    elif "      </main>\n    </div>\n  );\n}" in new_content:
        pass
    else:
        # Fallback: look for the last </div> before );
        parts = new_content.rsplit("</div>\n  );\n}", 1)
        if len(parts) == 2:
            new_content = parts[0] + "<Footer />\n    </div>\n  );\n}" + parts[1]

    with open(page, 'w') as f:
        f.write(new_content)

print("Done")
