document.addEventListener('DOMContentLoaded', () => {
    // --- Recent blog posts (RSS) ---
    const rssUrl = 'https://blog.carlospanganiban.com/index.xml';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const container = document.getElementById('blog-posts-container');

    if (container) {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.status === 'ok') {
                    container.innerHTML = '';

                    const posts = data.items.slice(0, 5);

                    posts.forEach(post => {
                        const pubDate = new Date(post.pubDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });

                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = post.description;
                        let cleanDescription = tempDiv.textContent || tempDiv.innerText || '';
                        if (cleanDescription.length > 150) {
                            cleanDescription = cleanDescription.substring(0, 150) + '...';
                        }

                        const articleHtml = `
                            <article class="item-card edu-card" style="margin-bottom: 1.5rem;">
                                <div class="edu-dot"></div>
                                <div class="company-content">
                                    <h3 class="org-name" style="margin-bottom: 0.25rem;">
                                        <a href="${post.link}" class="link-yellow text-decoration-none" target="_blank" rel="noopener noreferrer">
                                            ${post.title}
                                        </a>
                                    </h3>
                                    <p class="text-secondary" style="font-size: 0.95rem; margin-bottom: 0.5rem; line-height: 1.4;">
                                        ${cleanDescription}
                                    </p>
                                    <div class="role-group">
                                        <span class="date-text">${pubDate}</span>
                                    </div>
                                </div>
                            </article>
                        `;
                        container.insertAdjacentHTML('beforeend', articleHtml);
                    });
                } else {
                    throw new Error('RSS parsing failed');
                }
            })
            .catch(error => {
                console.error('Error fetching RSS feed:', error);
                container.innerHTML = '<p class="text-danger">Failed to load recent blog posts. Please check back later.</p>';
            });
    }

    // --- Footer year and rolling subtitle ---
    const y = new Date().getFullYear();
    const el = document.getElementById('footer-year');
    if (el) el.innerText = y;

    const subtitleEl = document.getElementById('roll-subtitle');
    const subtitleContainer = document.getElementById('subtitle-container');
    const iconEl = document.getElementById('roll-icon');

    if (subtitleEl && subtitleContainer && iconEl) {
        const funnyTitles = [
            "Coffee-to-Code Converter",
            "Professional Stack Overflow Explorer",
            "TypeScript Type-Safety Extremist",
            "PostgreSQL Query Whisperer",
            "Gunpla Weathering Enthusiast",
            "Docker Container Wrangler",
            "Shipwreck Diver (Code & Maritime)",
            "Git Commit Over-Thinker",
            "Ctrl+Z Power User",
            "Localhost 3000 Celebrity",
            "Vim Exit Strategy Consultant",
            "Merge Conflict Arbitrator",
            "Legacy Code Archaeologist",
            "AWS Billing Alert Ignorer",
            "`console.log('here')` Senior Architect",
            "Tabs vs. Spaces Diplomat",
            "Browser Tab Hoarder",
            "Rubber Duck Therapist",
            "Regex Trial-and-Error Specialist",
            "Variable Naming Overthinker",
            "Detached HEAD State Survivor",
            "Pull Request Novelist",
            "Print Statement Debugging Purist",
            "Weekend Side-Project Abandoner",
            "Bug Relocation Engineer",
            "Keyboard Shortcut Memorizer",
            "Production Deployment Daredevil",
            "Casual Linting Rule Ignorer",
            "Git Rebase Coward",
            "Stack Trace Speed Reader",
            "Caffeine-to-Sarcasm Synthesizer",
            "Deprecated Systems Necromancer",
            "Sprint Planning Skeptic",
            "Browser Cache Purging Expert",
            "WIP Commit Message Spammer",
            "Timezone Logic Hater",
            "Date-String Formatting Victim",
            "Monorepo Maze Navigator",
            "Spaghetti Code Chef",
            "Asynchronous Race Condition Spectator",
            "Code Review Nitpicker",
            "3 AM Idea Implementer",
            "Mock Data Architect",
            "Tech Debt Investor",
            "Ctrl+C / Ctrl+V Pipeline Engineer",
            "Metronome-Ignoring Pianist",
            "Sight-Reading Roulette Gambler",
            "Violin Rosin Inhalation Specialist",
            "Accidental Avant-Garde Violinist",
            "Suzuki Method Nostalgia Tripper",
            "Fortissimo-Only Dynamics Expert",
            "Unsynchronized Duet Partner",
            "Baroque Ornamentation Improviser",
            "Loud Kapampangan Conversationalist",
            "Tibok-Tibok Texture Evaluator",
            "In-Game Spreadsheet Operations Manager",
            "Factorio Main Bus Driver",
            "Train Signal Chaos Creator",
            "Crusader Kings Family Tree Untangler",
            "Conveyor Belt Balancer Plagiarist",
            "Mana Point Hoarder",
            "'One More Turn' Victim",
            "GregTech New Horizons Survivor",
            "Electric Blast Furnace Babysitter",
            "Chemical Reactor Pipe-Weaving Artist",
            "Multi-Block Structure Alignment Checker",
            "Applied Energistics Channel Starver",
            "Ender IO Fluid Tank Stack-Watcher",
            "Chunk Loading Budget Allocator",
            "CMAS One-Star Air-Guzzler",
            "Wreck Penetration Line Tangler",
            "Mask Clearing Reflex Champion",
            "Buoyancy Control Perfectionist",
            "Marine Life Staring Competition Contestant",
            "Weight Belt Micro-Adjuster",
            "Safety Stop Drift Passenger",
            "Valsalva Equalization Survivor",
            "Faceplant-to-Wake Specialist",
            "Rope Tension Miscalculator",
            "Dock Start Slip-and-Slider",
            "Premium Nippers Dulling Specialist",
            "Seam-Line Sanding Perfectionist",
            "Airbrush Needle Clogging Victim",
            "Water-Slide Decal Tearing Expert",
            "Panel Line Wash Over-Wiper",
            "Backlog Accumulation Grandmaster",
            "Master Grade Manual Misreader",
            "Tamiya Extra Thin Cement Sniffer",
            "Nub-Mark Camouflage Specialist",
            "Custom Weathering Mud Slapper",
            "Dry-Brushing Edge Highlighter",
            "Polystyrene Modification Experimenter",
            "Kitbashing Chaosmancer",
            "Zaku Mono-Eye Realignment Expert",
            "Styrene Dust Inhaler",
            "Decal Placement Geometry Critic",
        ];

        let currentRoll = 0;
        const maxRolls = 4;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

        function scrambleText(targetText, targetColor, callback) {
            let iterations = 0;
            subtitleContainer.style.color = targetColor;

            const interval = setInterval(() => {
                subtitleEl.innerText = targetText
                    .split("")
                    .map((char, index) => {
                        if (index < iterations || char === " ") {
                            return targetText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");

                if (iterations >= targetText.length) {
                    clearInterval(interval);
                    if (callback) callback();
                }
                iterations += 2;
            }, 30);
        }

        function executeRoll() {
            currentRoll++;

            if (currentRoll < maxRolls) {
                iconEl.className = "loader";

                const randomTitle = funnyTitles[Math.floor(Math.random() * funnyTitles.length)];

                scrambleText(randomTitle, "var(--magenta)");

                setTimeout(executeRoll, 3000);
            } else {
                scrambleText("Software Engineer", "var(--yellow)", () => {
                    iconEl.className = "check";

                    setTimeout(() => {
                        iconEl.classList.add("hide-icon");
                        subtitleContainer.style.gap = "0px";
                    }, 2000);
                });
            }
        }

        // Fire off the first loop immediate sequence
        executeRoll();
    }
});
