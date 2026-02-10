# 🚀 Aditya's Portfolio

A stunning, modern portfolio website built with cutting-edge web technologies, featuring 3D animations, glassmorphism effects, and smooth interactions.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-success)
![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20Three.js%20%7C%20Tailwind-blue)

🌐 **Live Demo**: [https://aditya-0156.github.io/portfolio/](https://aditya-0156.github.io/portfolio/)

## ✨ Features

- **3D Animated Background** - Interactive particle system using Three.js and React Three Fiber
- **Glassmorphism UI** - Modern frosted-glass card designs throughout
- **Smooth Animations** - Powered by Framer Motion and GSAP
- **Fully Responsive** - Optimized for all devices from mobile to desktop
- **Dynamic Project Showcase** - Expandable project cards with detailed information
- **Interactive Skills Section** - Animated progress bars and category filtering
- **Contact Form** - Integrated contact section with social links
- **Dark Theme** - Eye-friendly dark mode with vibrant accent colors

## 🎨 Design Highlights

- **Color Palette**:
  - Primary: Warm Gold (#fbbf24)
  - Accents: Cyan (#00f5ff), Purple (#a855f7), Pink (#ec4899)
  - Background: Deep Dark (#1a1a1a)
- **Typography**: Inter, Space Grotesk, JetBrains Mono
- **Effects**: Glassmorphism, floating animations, gradient text, glow effects

## 🛠️ Tech Stack

### Core
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework

### 3D & Animations
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Framer Motion** - React animation library
- **GSAP** - Professional-grade animation platform

### UI Components
- **Lucide React** - Beautiful icons
- **React Icons** - Icon library

## 📂 Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── Background/        # 3D animated background
│   │   ├── Navbar/            # Navigation component
│   │   ├── Hero/              # Hero section
│   │   ├── Projects/          # Project showcase
│   │   ├── Skills/            # Skills section
│   │   └── Contact/           # Contact form
│   ├── data/
│   │   ├── projectsData.js    # Project information
│   │   └── skillsData.js      # Skills and highlights
│   ├── App.jsx                # Main app component
│   ├── index.css              # Global styles
│   └── main.jsx               # Entry point
├── public/                     # Static assets
└── dist/                       # Build output
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Aditya-0156/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Deploying to GitHub Pages

```bash
npm run deploy
```

## 📝 Adding New Projects

To add a new project to your portfolio:

1. Open `src/data/projectsData.js`
2. Add a new project object to the `projects` array:

```javascript
{
  id: 2,
  title: "Your Project Name",
  subtitle: "Brief tagline",
  description: "Short description for card view",
  longDescription: "Detailed description",
  technologies: [
    { name: "Tech1", icon: "🔧", color: "#color" },
    // ...
  ],
  features: [
    "Feature 1",
    "Feature 2",
  ],
  github: "https://github.com/yourusername/project",
  demo: "https://project-demo.com",
  category: "AI/ML", // or "Web Development", "Full-Stack", etc.
  date: "2025-02",
  featured: false,
  stats: {
    stars: "⭐",
    tech: "X Technologies",
    type: "Frontend/Backend/Full-Stack"
  }
}
```

## 🎨 Customization

### Colors
Edit the color theme in `src/index.css` under the `@theme` section:

```css
@theme {
  --color-primary-500: #f59e0b;  /* Change primary color */
  --color-accent-cyan: #00f5ff;   /* Change accent colors */
  /* ... */
}
```

### Personal Information
Update the following files:
- `src/components/Hero/Hero.jsx` - Name and introduction
- `src/components/Navbar/Navbar.jsx` - Social links
- `src/components/Contact/Contact.jsx` - Contact information
- `src/data/skillsData.js` - Your skills and highlights

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🌟 Featured Projects

Currently showcasing:
- **RAG Knowledge Base** - AI-powered document Q&A system using LangChain, ChromaDB, and Google Gemini

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Aditya-0156/portfolio/issues).

## 👨‍💻 Author

**Aditya**
- GitHub: [@Aditya-0156](https://github.com/Aditya-0156)
- Portfolio: [https://aditya-0156.github.io/portfolio/](https://aditya-0156.github.io/portfolio/)

## 🙏 Acknowledgments

- Built with ❤️ using React, Three.js, and Tailwind CSS
- Inspired by modern web design trends and glassmorphism aesthetics
- Icons from Lucide and React Icons

---

**⭐ If you like this portfolio template, please consider giving it a star!**
