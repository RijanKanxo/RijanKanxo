import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Mail,
  MapPin,
  Phone,
  X
} from "lucide-react";

type SkillItem = {
  label: string;
  note: string;
};

type SkillGroup = {
  id: string;
  title: string;
  items: SkillItem[];
};

type ProjectRow = {
  key: string;
  number: string;
  title: string;
  subtitle: string;
  chips: string[];
};

type JourneyItem = {
  year: string;
  role: string;
  org: string;
  text: string;
  tag: string;
};

type RepoItem = {
  link?: string;
  name: string;
  description: string;
  footer: string;
};

const skillGroups: SkillGroup[] = [
  {
    id: "sk-design",
    title: "Design",
    items: [
      { label: "UI / UX Design", note: "Core strength" },
      { label: "Visual Identity & Branding", note: "Client work" },
      { label: "Social Media Design", note: "Active" },
      { label: "Figma", note: "Daily driver" },
      { label: "Photoshop / Illustrator", note: "Freelance" },
      { label: "Typography Systems", note: "Obsession" }
    ]
  },
  {
    id: "sk-frontend",
    title: "Frontend",
    items: [
      { label: "HTML / CSS", note: "Very comfortable" },
      { label: "JavaScript", note: "Daily" },
      { label: "React", note: "Projects" },
      { label: "Next.js", note: "Projects" },
      { label: "Canvas API", note: "Growing interest" },
      { label: "Tailwind CSS", note: "Active" }
    ]
  },
  {
    id: "sk-other",
    title: "Other & Learning",
    items: [
      { label: "Git / GitHub", note: "Daily" },
      { label: "Python", note: "Learning" },
      { label: "Linux", note: "Comfortable" },
      { label: "AI / ML", note: "Exploring" },
      { label: "Backend Dev", note: "Next goal" },
      { label: "Design Systems", note: "Interest" }
    ]
  }
];

const projectRows: ProjectRow[] = [
  {
    key: "uno",
    number: "01",
    title: "UNO Card Game",
    subtitle: "Browser game - Vanilla JavaScript - 2024",
    chips: ["JS", "DOM", "Game Logic"]
  },
  {
    key: "email",
    number: "02",
    title: "Email Client",
    subtitle: "Next.js - React - API integration - 2024",
    chips: ["Next.js", "React", "API"]
  },
  {
    key: "unsent",
    number: "03",
    title: "Unsent Poems",
    subtitle: "Poetry web experience - Next.js - 2025",
    chips: ["Next.js", "Writing", "UI"]
  },
  {
    key: "cashiro",
    number: "04",
    title: "Cashiro - Open Source",
    subtitle: "Nepali banking support - GitHub PR merged - 2024",
    chips: ["OSS", "JS"]
  },
  {
    key: "wearecars",
    number: "05",
    title: "WeAreCars Rental System",
    subtitle: "Tkinter desktop app - booking and rental management",
    chips: ["Python", "Tkinter", "System Design"]
  },
  {
    key: "minnano",
    number: "06",
    title: "Minnano Education",
    subtitle: "Visual identity - Social media design - Client work",
    chips: ["Branding", "Figma"]
  },
  {
    key: "sacco",
    number: "07",
    title: "SACCO Promotional Design",
    subtitle: "Print - Brochures - Promotional materials - Nepal",
    chips: ["Print", "Identity"]
  },
  {
    key: "consult",
    number: "08",
    title: "Consultancy Branding",
    subtitle: "Logo - Visiting cards - Brand collateral",
    chips: ["Identity", "Print"]
  }
];

const journeyItems: JourneyItem[] = [
  {
    year: "2022",
    role: "Joined STEM Club",
    org: "Aroma English Secondary School",
    text: "First exposure to systematic problem-solving, collaborative projects, and engineering thinking. This is where curiosity became direction.",
    tag: "STEM"
  },
  {
    year: "2023",
    role: "Theater & Performance",
    org: "School Production",
    text: "Playing characters taught me to think about pacing, audience attention, and emotional design. I still apply this to every interface I build.",
    tag: "Arts"
  },
  {
    year: "2023",
    role: "First Design Client",
    org: "Self-started freelance",
    text: "Created my first real branding project - logo, color system, business cards. A local client used it. That feedback loop changed everything.",
    tag: "Design"
  },
  {
    year: "2024",
    role: "Freelance Designer",
    org: "Minnano Education, SACCO, Consultancies",
    text: "Delivered branding, social media systems, and print collateral for multiple Nepali organisations. Learned to manage client expectations, revisions, and real deadlines.",
    tag: "Client work"
  },
  {
    year: "2024",
    role: "Open Source - Cashiro",
    org: "GitHub PR merged",
    text: "First real open-source contribution. Added Nepali banking support. Went through code review, revision, and merge. Felt like joining something bigger.",
    tag: "OSS"
  },
  {
    year: "2024 ->",
    role: "BSc CSIT - ISMT College, Chitwan",
    org: "Currently enrolled",
    text: "Studying Computer Science while continuing to build. The goal: become the kind of developer who understands both the design and the system behind it.",
    tag: "Active"
  }
];

const repos: RepoItem[] = [
  {
    name: "uno-card-game",
    link: "https://uno-wheat-ten.vercel.app",
    description:
      "Browser-based UNO with full game logic, card validation, and turn management. Zero dependencies.",
    footer: "JS"
  },
  {
    name: "email-client",
    link: "https://fe-mail.vercel.app",
    description:
      "Next.js email client with async state management, API integration, and component library.",
    footer: "TypeScript"
  },
  {
    name: "Unsent-Poems",
    link: "https://unsentpoems.vercel.app",
    description:
      "A public poetry experience built for reading mood, atmosphere, and emotional pacing on the web.",
    footer: "Next.js"
  },
  {
    name: "cashiro (contrib)",
    link: "https://github.com/rijan-poudel/Cashiro",
    description:
      "Open-source finance app. Added Nepali banking support. PR reviewed and merged.",
    footer: "Merged"
  },
  {
    name: "WeAreCarsRentalSystem_Tkinter",
    link: "https://github.com/rijan-poudel/WeAreCarsRentalSystem_Tkinter",
    description:
      "Desktop rental management system with staff login, bookings, returns, and car status tracking.",
    footer: "Python"
  }
];

function ProjectList() {
  return (
    <div className="proj-list">
      {projectRows.map((project) => (
        <button className="proj-row rv" data-key={project.key} key={project.key} type="button">
          <div className="proj-num">{project.number}</div>
          <div className="proj-info">
            <div className="proj-title">{project.title}</div>
            <div className="proj-sub">{project.subtitle}</div>
          </div>
          <div className="proj-right">
            <div className="proj-chips">
              {project.chips.map((chip) => (
                <span className="proj-chip" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
            <div className="proj-arrow" aria-hidden="true">
              <ArrowRight size={16} strokeWidth={1.8} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <>
      <canvas id="scene" />
      <canvas id="spotlight" />
      <canvas id="trail-canvas" />
      <div id="scroll-line" />

      <div id="proj-float">
        <svg
          id="proj-float-svg"
          viewBox="0 0 300 188"
          xmlns="http://www.w3.org/2000/svg"
        />
      </div>

      <div id="modal-overlay" />
      <div id="modal" aria-modal="true" aria-labelledby="modal-title" role="dialog" tabIndex={-1}>
        <button className="modal-close" id="modal-close-btn" type="button">
          <X size={18} strokeWidth={2} />
        </button>
        <div id="modal-body" />
      </div>

      <div className="site">
        <nav id="nav">
          <div className="c nav-i">
            <a className="nav-logo" href="#top">
              Rijan Kapur Poudel
            </a>
            <div className="nav-links">
              <a href="#about">About</a>
              <a href="#skills">Skills</a>
              <a href="#projects">Work</a>
              <a href="#journey">Journey</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="nav-right">
              <div className="avail">
                <div className="green" />
                Available for work
              </div>
              <button className="hbg" id="hbg" aria-label="menu" type="button">
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </nav>

        <div id="mob-nav">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Work</a>
          <a href="#journey">Journey</a>
          <a href="#contact">Contact</a>
        </div>

        <section className="hero" id="top">
          <div className="c">
            <div className="hero-tag">Frontend Developer - Designer - Chitwan, Nepal</div>
            <h1 className="hero-h1">
              <span className="ln">
                <span>Building calmer</span>
              </span>
              <span className="ln">
                <span>interfaces for a</span>
              </span>
              <span className="ln">
                <span>louder internet.</span>
              </span>
            </h1>
            <div className="hero-rule">
              <div>
                <p className="hero-desc">
                  Frontend developer and designer from Nepal focused on minimal
                  digital experiences - design that does not shout.
                </p>
                <p className="hero-id">First-year BSc CSIT - ISMT College, Chitwan</p>
              </div>
              <div className="hero-quick">
                <a href="https://github.com/rijan-poudel" rel="noreferrer" target="_blank">
                  <Code2 size={14} strokeWidth={1.9} />
                  <span>GitHub</span>
                  <ArrowRight size={14} strokeWidth={1.9} />
                </a>
                <a
                  href="https://linkedin.com/in/rijan-poudel-708254269"
                  rel="noreferrer"
                  target="_blank"
                >
                  <BriefcaseBusiness size={14} strokeWidth={1.9} />
                  <span>LinkedIn</span>
                  <ArrowRight size={14} strokeWidth={1.9} />
                </a>
                <a href="mailto:rijankanxo111@gmail.com">
                  <Mail size={14} strokeWidth={1.9} />
                  <span>Email</span>
                  <ArrowRight size={14} strokeWidth={1.9} />
                </a>
                <a href="#projects">
                  <span>View Work</span>
                  <ArrowRight size={14} strokeWidth={1.9} />
                </a>
              </div>
              <div className="hero-right">
                <div className="big-n" id="c1">
                  0
                </div>
                <div className="big-label">Projects completed</div>
              </div>
            </div>
          </div>
        </section>

        <div className="ticker">
          <div className="ticker-t" id="tkr" />
        </div>

        <section id="about">
          <div className="c">
            <div className="s-tag rv">About</div>
            <h2 className="s-title rv">
              A designer who codes.
              <br />A coder who designs.
            </h2>
            <div className="about-grid">
              <div className="rv">
                <div className="about-body">
                  <p>
                    I&apos;m a <strong>first-year BSc CSIT student</strong> at
                    ISMT College, Chitwan. I build things that live on screens -
                    from React interfaces to visual identities for real Nepali
                    businesses.
                  </p>
                  <p>
                    My path has not been linear. I started with <strong>design</strong>
                    {" "} - branding, social media, print. Then code pulled me in. Now I
                    sit at the edge of both and I think that is where the most
                    interesting work happens.
                  </p>
                  <blockquote className="about-narrative">
                    Theater taught me pacing.
                    <br />
                    STEM taught me systems.
                    <br />
                    Design became the bridge between both.
                  </blockquote>
                  <p>
                    I contributed to <strong>Cashiro</strong>, an open-source finance
                    app, adding support for Nepali banking. I built a fully
                    playable browser UNO game. I designed branding that clients
                    actually use.
                  </p>
                  <div className="about-tags">
                    {[
                      "React / Next.js",
                      "Figma",
                      "Branding",
                      "Canvas API",
                      "Football",
                      "Theater",
                      "Volunteer",
                      "STEM"
                    ].map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="about-r rv d2">
                <div className="stat-row">
                  <div className="stat-n">6+</div>
                  <div className="stat-l">Branding &amp; design projects delivered</div>
                </div>
                <div className="stat-row">
                  <div className="stat-n">3</div>
                  <div className="stat-l">Frontend projects shipped</div>
                </div>
                <div className="stat-row">
                  <div className="stat-n">1</div>
                  <div className="stat-l">Open-source PR merged on GitHub</div>
                </div>
                <div className="stat-row">
                  <div className="stat-n">2024</div>
                  <div className="stat-l">Started building seriously</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" style={{ overflow: "hidden", position: "relative" }}>
          <canvas
            id="skills-flow"
            style={{
              height: "100%",
              inset: 0,
              opacity: 1,
              pointerEvents: "none",
              position: "absolute",
              width: "100%",
              zIndex: 0
            }}
          />
          <div className="c" style={{ position: "relative", zIndex: 1 }}>
            <div className="s-tag rv">Stack</div>
            <h2 className="s-title rv">What I work with.</h2>
            <p className="skills-note rv">
              No percentages - skills are not numbers. Here&apos;s my honest stack
              and what I&apos;m actively learning.
            </p>
            <div className="skill-cols rv">
              {skillGroups.map((group) => (
                <div className="sk-col" id={group.id} key={group.id}>
                  <div className="sk-col-h">{group.title}</div>
                  <div className="sk-items">
                    {group.items.map((item) => (
                      <div className="sk-item" key={item.label}>
                        {item.label}
                        <div className="sk-line-track">
                          <div className="sk-line-fill" />
                        </div>
                        <span>{item.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects">
          <div className="c">
            <div className="proj-head">
              <div>
                <div className="s-tag rv">Selected Work</div>
                <h2 className="s-title rv">Things I&apos;ve built.</h2>
              </div>
              <a
                className="proj-head-link"
                href="https://github.com/rijan-poudel"
                rel="noreferrer"
                target="_blank"
              >
                <Code2 size={14} strokeWidth={1.9} />
                <span>GitHub</span>
                <ArrowRight size={14} strokeWidth={1.9} />
              </a>
            </div>
            <ProjectList />
          </div>
        </section>

        <section id="journey">
          <div className="c">
            <div className="s-tag rv">Timeline</div>
            <h2 className="s-title rv">The story so far.</h2>
            <div className="jrn-rows" id="jrn-rows">
              <div className="jrn-line-fill" id="jrn-fill" />
              {journeyItems.map((item) => (
                <div className="jrn-row rv" key={`${item.year}-${item.role}`}>
                  <div className="jrn-yr">{item.year}</div>
                  <div className="jrn-body">
                    <div className="jrn-role">{item.role}</div>
                    <div className="jrn-org">{item.org}</div>
                    <div className="jrn-text">{item.text}</div>
                  </div>
                  <div className="jrn-r">
                    <span className="tag">{item.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="github">
          <div className="c">
            <div className="s-tag rv">GitHub</div>
            <h2 className="s-title rv">Activity &amp; Repositories</h2>
            <div className="gh-box rv">
              <canvas id="gh-bg" />
              <div className="gh-in">
                <div className="gh-head">
                  <div className="gh-prof">
                    <div className="gh-av">RK</div>
                    <div>
                      <div className="gh-name">Rijan Kapur Poudel</div>
                      <div className="gh-handle">@rijan-poudel - github.com/rijan-poudel</div>
                    </div>
                  </div>
                  <div className="gh-meta">
                    <div className="gh-m">
                      <div className="gh-mn">2+</div>
                      <div className="gh-ml">Repos</div>
                    </div>
                    <div className="gh-m">
                      <div className="gh-mn">1</div>
                      <div className="gh-ml">PR merged</div>
                    </div>
                    <div className="gh-m">
                      <div className="gh-mn">2024</div>
                      <div className="gh-ml">Joined</div>
                    </div>
                  </div>
                </div>
                <div className="gh-repos">
                  {repos.map((repo) => (
                    <a
                      className="repo-card"
                      href={repo.link ?? "https://github.com/rijan-poudel"}
                      key={repo.name}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <div className="repo-nm">{repo.name}</div>
                      <div className="repo-ds">{repo.description}</div>
                      <div className="repo-ft">
                        <span>{repo.footer}</span>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="contrib-head">
                  <span>Last 365 days of activity</span>
                  <div className="contrib-legend">
                    Less <div className="cl" style={{ background: "var(--dim2)" }} />
                    <div className="cl cc l1" />
                    <div className="cl cc l2" />
                    <div className="cl cc l3" />
                    <div className="cl cc l4" /> More
                  </div>
                </div>
                <div className="contrib-wrap">
                  <div className="cg" id="cg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="c">
            <div className="s-tag rv">Contact</div>
            <h2 className="s-title rv">Let&apos;s build something.</h2>
            <div className="contact-avail rv">
              <div className="green" /> Currently available for freelance &amp;
              collaboration
            </div>
            <div className="contact-grid">
              <div className="rv d1">
                <p>
                  Interested in startups, design systems, and interfaces that
                  feel inevitable. Open to frontend projects, branding work, and
                  anything that sits between design and code.
                </p>
                <p style={{ marginTop: 8 }}>
                  Based in Chitwan, Nepal. Usually replies within 24 hours.
                </p>
                <div className="c-links">
                  <a className="c-link" href="mailto:rijankanxo111@gmail.com">
                    <Mail size={14} strokeWidth={1.9} />
                    <span>rijankanxo111@gmail.com</span>
                    <small>
                      Email <ArrowRight size={12} strokeWidth={1.9} />
                    </small>
                  </a>
                  <a className="c-link" href="tel:+9779769780059">
                    <Phone size={14} strokeWidth={1.9} />
                    <span>+977 9769780059</span>
                    <small>
                      Call <ArrowRight size={12} strokeWidth={1.9} />
                    </small>
                  </a>
                  <a
                    className="c-link"
                    href="https://linkedin.com/in/rijan-poudel-708254269"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <BriefcaseBusiness size={14} strokeWidth={1.9} />
                    <span>LinkedIn</span>
                    <small>
                      <ArrowRight size={12} strokeWidth={1.9} />
                    </small>
                  </a>
                  <a
                    className="c-link"
                    href="https://github.com/rijan-poudel"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Code2 size={14} strokeWidth={1.9} />
                    <span>GitHub</span>
                    <small>
                      <ArrowRight size={12} strokeWidth={1.9} />
                    </small>
                  </a>
                  <div className="c-link" style={{ cursor: "default" }}>
                    <MapPin size={14} strokeWidth={1.9} />
                    <span>Gaindakot-05, Nawalpur, Nepal</span>
                    <small>Location</small>
                  </div>
                </div>
              </div>
              <div className="rv d2">
                <form className="c-form" id="cf">
                  <div className="f-row">
                    <div className="f-field">
                      <label className="f-label" htmlFor="fn">
                        Name
                      </label>
                      <input
                        className="f-inp"
                        id="fn"
                        placeholder="Your name"
                        required
                        type="text"
                      />
                    </div>
                    <div className="f-field">
                      <label className="f-label" htmlFor="fe">
                        Email
                      </label>
                      <input
                        className="f-inp"
                        id="fe"
                        placeholder="your@email.com"
                        required
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="f-field">
                    <label className="f-label" htmlFor="fs">
                      Subject
                    </label>
                    <input
                      className="f-inp"
                      id="fs"
                      placeholder="Freelance / Collab / Just saying hi"
                      required
                      type="text"
                    />
                  </div>
                  <div className="f-field">
                    <label className="f-label" htmlFor="fm">
                      Message
                    </label>
                    <textarea
                      className="f-inp"
                      id="fm"
                      placeholder="Tell me about your project, idea, or how I can help..."
                      required
                    />
                  </div>
                  <button className="f-btn" id="fb" type="submit">
                    Send Message <ArrowRight size={14} strokeWidth={1.9} />
                  </button>
                  <div className="f-ok" id="fok">
                    Message status appears here.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <div className="c ft">
            <div className="ft-logo">Rijan Kapur Poudel</div>
            <div className="ft-copy">Copyright 2025 - Chitwan, Nepal</div>
            <div className="ft-links">
              <a href="https://github.com/rijan-poudel" rel="noreferrer" target="_blank">
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/rijan-poudel-708254269"
                rel="noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
              <a href="mailto:rijankanxo111@gmail.com">Email</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
