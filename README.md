# 🔖 Bookmark Saver

A modern, lightweight, and fully responsive **Bookmark Saver** web application that helps you save, organize, search, and manage your favorite website links effortlessly.

Built entirely with **HTML5, CSS3, and Vanilla JavaScript**, Bookmark Saver provides a polished, premium-style user experience while keeping the application fast, simple, and dependency-free.

<p align="center">
  <a href="https://bookmark-saver-12.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20Site-brightgreen?style=for-the-badge&logo=netlify" alt="Live Demo" />
  </a>
  <a href="https://github.com/razazaheer12/Bookmark-Saver" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github" alt="GitHub Repo" />
  </a>
</p>

---

## 📸 Preview

> 🚀 A redesigned premium bookmark management experience with a modern dashboard, responsive layout, search, favorites, categories, and local data persistence.

<!-- Add your latest screenshot here -->

<img width="947" height="433" alt="image" src="https://github.com/user-attachments/assets/b586dc7c-1551-459d-aec3-6252f755bb99" />


> **Live URL:** [https://bookmark-saver-12.netlify.app/](https://bookmark-saver-12.netlify.app/)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ➕ **Add Bookmarks** | Save websites with a custom title and URL. |
| ✏️ **Edit Bookmarks** | Update bookmark details whenever needed. |
| 🗑️ **Delete Bookmarks** | Remove unwanted bookmarks easily with confirmation. |
| ↩️ **Undo Delete** | Restore a recently deleted bookmark without re-adding it manually. |
| 🔗 **Quick Access** | Open saved websites instantly in a new browser tab. |
| 📋 **Copy URL** | Copy any bookmark URL directly to the clipboard. |
| ⭐ **Favorites** | Mark important bookmarks as favorites for quick access. |
| 📁 **Categories** | Organize bookmarks into custom collections. |
| 🏷️ **Tags** | Add tags to make bookmarks easier to identify and search. |
| 📝 **Notes** | Add optional notes to provide additional context for bookmarks. |
| 🔎 **Instant Search** | Search bookmarks by title, URL, domain, category, tags, or notes. |
| ↕️ **Smart Sorting** | Sort bookmarks by newest, oldest, A–Z, Z–A, or favorites first. |
| ▦ **Grid View** | Browse bookmarks using a clean responsive card layout. |
| ☰ **List View** | Switch to a compact list layout when preferred. |
| 🌐 **Website Favicons** | Display website icons automatically when available. |
| 🌓 **Dark & Light Mode** | Switch between modern light and dark themes. |
| 🔔 **Toast Notifications** | Get instant visual feedback for important actions. |
| 💾 **Local Storage** | Persist bookmarks directly inside the browser. |
| 📤 **JSON Export** | Back up your bookmarks as a JSON file. |
| 📥 **JSON Import** | Restore bookmarks from a previously exported JSON file. |
| 🧹 **Clear All Data** | Remove all locally stored bookmark data when required. |
| ⌨️ **Keyboard Shortcuts** | Quickly access search and bookmark creation using keyboard shortcuts. |
| 📱 **Fully Responsive** | Designed for mobile, tablet, laptop, desktop, and large screens. |
| ⚡ **Lightweight** | No frontend framework or large dependency required. |
| 🔒 **Privacy Friendly** | No account or backend database is required. |

---

## 🛠️ Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
</p>

- **HTML5** — Semantic application structure and accessible markup
- **CSS3** — Responsive layouts, themes, animations, cards, modals, and visual styling
- **Vanilla JavaScript** — DOM manipulation, application state, validation, search, sorting, and interactions
- **LocalStorage API** — Persistent client-side bookmark storage
- **Clipboard API** — Copy bookmark URLs directly to the clipboard
- **File API** — Import and export bookmark backups
- **SVG Icons** — Lightweight interface icons without a heavy icon library
- **Google Fonts** — Inter typography for a modern UI
- **Netlify** — Static deployment and hosting

---

## 🚫 No Frameworks

This project intentionally uses only the fundamentals of web development.

```text
HTML5
CSS3
Vanilla JavaScript
Browser APIs
```

No:

```text
React
Next.js
Vue
Angular
Tailwind CSS
Bootstrap
Node.js
Express
MongoDB
Firebase
```

The goal is to demonstrate how far a polished web application can be taken using **HTML, CSS, and JavaScript alone**.

---

## 🚀 Getting Started

### Prerequisites

You only need a modern web browser to run this project.

No:

- Build tools
- Package manager
- Node.js
- Framework
- Database
- Backend server

are required.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/razazaheer12/Bookmark-Saver.git
   ```

2. **Navigate to the project folder**

   ```bash
   cd Bookmark-Saver
   ```

3. **Open the project**

   Open `index.html` directly in your browser.

   Or use **Live Server** in VS Code for development.

---

## 📖 How to Use

### ➕ Add a Bookmark

Enter the following information:

- Bookmark title
- Website URL
- Optional category
- Optional tags
- Optional notes
- Favorite status if required

Then save the bookmark.

### 🔗 Open a Bookmark

Click the bookmark's **Open** action to launch the website in a new browser tab.

### ⭐ Favorite a Bookmark

Use the favorite action to mark important websites for faster access.

### ✏️ Edit a Bookmark

Open the bookmark's edit action, update its information, and save the changes.

### 🗑️ Delete a Bookmark

Use the delete action to remove a bookmark.

The application provides confirmation before permanent removal and supports undoing a recent deletion.

### 🔎 Search

Use the search field to instantly filter bookmarks.

Search can match:

```text
Title
URL
Domain
Category
Tags
Notes
```

### ↕️ Sort

Bookmarks can be sorted using options such as:

```text
Newest
Oldest
A → Z
Z → A
Favorites First
```

### 🌓 Change Theme

Use the theme toggle to switch between:

```text
Light Mode
Dark Mode
```

Your selected preference is stored locally.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Focus bookmark search |
| `Ctrl + N` | Open Add Bookmark modal |
| `Escape` | Close active modal or navigation |

---

## 💾 Data Storage

Bookmark Saver uses the browser's **LocalStorage API** to persist data.

Your bookmarks remain available after:

- Refreshing the page
- Closing the browser
- Reopening the application

No account is required.

### Example Bookmark Object

```javascript
{
  id: "unique-id",
  title: "Google",
  url: "https://google.com",
  category: "General",
  tags: ["search", "web"],
  notes: "My favorite search engine",
  favorite: false,
  createdAt: 1720000000000,
  updatedAt: 1720000000000
}
```

The application also supports the original simple bookmark structure:

```javascript
{
  name: "Google",
  url: "https://google.com"
}
```

This helps maintain compatibility with bookmarks created by the original version.

---

## 📤 Export & Import

### Export

You can export your bookmark collection as a JSON backup file.

Example:

```text
markly-bookmarks-2026-09-15.json
```

### Import

Previously exported bookmark files can be imported back into the application.

The application validates imported data before adding it to the bookmark collection.

---

## 🔒 Privacy

Bookmark Saver is a client-side application.

There is:

```text
No Backend
No Database
No Authentication
No User Account
No Server-side Bookmark Storage
```

Your bookmarks are stored locally in your browser.

> ⚠️ Clearing browser storage may remove locally saved bookmarks. It is recommended to periodically use the **Export** feature to create a backup.

---

## 📱 Responsive Design

Bookmark Saver is designed to provide a consistent experience across different screen sizes.

### 📱 Mobile

Optimized for:

- Small smartphones
- iPhone SE-class screens
- iPhone XR-class screens
- Android phones
- Older mobile devices

The interface adapts by:

- Collapsing navigation
- Stacking content vertically
- Wrapping controls
- Making buttons touch-friendly
- Preventing horizontal overflow
- Adapting cards to smaller widths

### 📲 Tablet

The layout automatically adjusts:

- Sidebar behavior
- Card columns
- Toolbar controls
- Search width
- Modal dimensions

### 💻 Desktop

Larger screens receive:

- Full sidebar navigation
- Spacious dashboard layout
- Multi-column bookmark grid
- Expanded toolbar controls
- Better use of available screen space

---

## 🎨 Design System

The redesigned interface follows a modern **premium SaaS / productivity dashboard** design direction.

### Typography

The application uses:

**Inter**

Chosen for:

- Excellent readability
- Clean appearance
- Modern SaaS aesthetic
- Strong UI hierarchy
- Good mobile readability

### Design Principles

The interface focuses on:

- Clean visual hierarchy
- Spacious layouts
- Soft borders
- Subtle shadows
- Rounded surfaces
- Minimal visual noise
- Smooth micro-interactions
- Consistent spacing
- Touch-friendly controls
- Responsive behavior

### Theme

The visual system uses an indigo/violet-inspired primary palette with neutral surfaces and dedicated dark-mode colors.

---

## ♿ Accessibility

Accessibility has been considered throughout the interface.

Features include:

- Semantic HTML
- Accessible buttons
- ARIA labels where required
- Keyboard navigation
- Visible focus states
- Reduced-motion support
- Accessible forms
- Responsive text
- Touch-friendly controls
- Modal interaction handling

---

## ⚡ Performance

Bookmark Saver is intentionally lightweight.

Performance-focused decisions include:

- No frontend framework
- No heavy component library
- Minimal dependencies
- Browser-native APIs
- Inline SVG icons
- CSS-based animations
- Efficient DOM updates
- Client-side storage
- Static hosting compatibility

This makes the application suitable for lightweight deployment through services such as **Netlify** or **GitHub Pages**.

---

## 📁 Project Structure

```text
Bookmark-Saver/
│
├── index.html          # Main HTML structure and application layout
├── style.css           # Complete styling, themes and responsive design
├── script.js           # Application logic and localStorage handling
└── README.md           # Project documentation
```

### File Overview

| File | Purpose |
|------|---------|
| `index.html` | Defines the application structure, navigation, dashboard, forms, modals, bookmark areas, and interface elements. |
| `style.css` | Contains the complete visual system, responsive layouts, light/dark themes, animations, cards, buttons, and component styling. |
| `script.js` | Handles bookmark management, search, sorting, favorites, categories, tags, editing, deletion, import/export, localStorage, and UI interactions. |
| `README.md` | Contains project documentation, setup instructions, features, technologies, and usage information. |

---

## 🌐 Deployment

Bookmark Saver is a static web application and can be deployed without a backend.

### Netlify

The project can be deployed directly through Netlify.

**Live Demo:**

[https://bookmark-saver-12.netlify.app/](https://bookmark-saver-12.netlify.app/)

### GitHub Pages

The project can also be hosted using GitHub Pages.

### Other Static Hosting

It can also be deployed to any static hosting provider that supports HTML, CSS, and JavaScript.

---

## 🌍 Browser Compatibility

Bookmark Saver is designed for modern browsers supporting HTML5, CSS3, ES6+ JavaScript, and standard browser APIs.

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari
- Chromium-based browsers

Some advanced browser features, such as Clipboard and File APIs, may have limited support in very old browsers.

---

## 🔮 Future Improvements

Possible future improvements include:

- 🖱️ Drag-and-drop bookmark ordering
- 🎨 Custom collection colors
- 🖼️ Bookmark website previews
- 🌐 Automatic metadata extraction
- 🔍 Advanced filtering
- 🔗 Broken-link detection
- ♻️ Duplicate bookmark detection
- ☑️ Bulk bookmark selection
- 📦 Bulk import/export
- 🕐 Recently opened bookmarks
- 📌 Pinned bookmarks
- ⌨️ Custom keyboard shortcuts
- 📱 Progressive Web App support
- 📴 Offline-first experience
- 📂 Browser bookmark file import

---

## 🎯 Project Goal

Bookmark Saver originally started as a simple learning project focused on:

```text
HTML
CSS
JavaScript
DOM Manipulation
LocalStorage
```

The project has now been redesigned to demonstrate how the same fundamentals can be used to create a polished, responsive, and production-style frontend experience.

> **The main goal:** Build a premium-feeling bookmark manager without relying on a frontend framework.

---

## 👨‍💻 Author

### Raza Zaheer

Frontend Web Developer

<p align="left">
  <a href="https://github.com/razazaheer12" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-razazaheer12-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/raza-zaheer-416745340/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-Raza%20Zaheer-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

Your support is appreciated!

---

## 📄 License

This project is created as a personal learning and portfolio project.

Feel free to explore the source code and use it for learning purposes.

---

<p align="center">
  <strong>🔖 Bookmark Saver — Save it. Organize it. Find it.</strong>
</p>
