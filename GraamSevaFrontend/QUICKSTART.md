# GraamSeva Frontend - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git
- Basic React knowledge

### Step 1: Clone & Install

```bash
cd GraamSevaFrontend
npm install
```

### Step 2: Run Development Server

```bash
npm run dev
```

Open `http://localhost:5174` in your browser. The app will auto-reload when you make changes.

### Step 3: Explore the App

**Try this flow**:
1. 🏠 **Home Page**: Select "हिन्दी" (Hindi) or any language
2. 🎤 **Voice Input**: Enter a name and mobile number, then click "आगे बढ़ें"
3. 📋 **Services**: View scheme details and click on "PM-KISAN"
4. ✅ **Eligibility**: Click "मेरी योग्यता जांचें" to check eligibility
5. 📝 **Application**: Fill the 3-step form and submit
6. ✨ **Success**: See your reference number!

---

## 📁 File Structure

```
GraamSevaFrontend/
├── src/
│   ├── pages/              # 6 main pages
│   │   ├── HomePage.jsx
│   │   ├── VoiceInputPage.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── EligibilityPage.jsx
│   │   ├── ApplicationPage.jsx
│   │   └── DashboardPage.jsx
│   │
│   ├── styles/             # Component-specific CSS
│   │   ├── HomePage.css
│   │   ├── VoiceInputPage.css
│   │   ├── ServicesPage.css
│   │   ├── EligibilityPage.css
│   │   ├── ApplicationPage.css
│   │   └── DashboardPage.css
│   │
│   ├── App.jsx             # Main router & state
│   ├── App.css
│   ├── main.jsx
│   └── index.css
│
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README files
    ├── FRONTEND_README.md   # Feature overview
    ├── FEATURES.md          # Detailed feature list
    └── ARCHITECTURE.md      # Integration guide
```

---

## 🎯 Common Development Tasks

### Adding a New Page

1. **Create the page component**:
```jsx
// src/pages/NewPage.jsx
export default function NewPage({ onNavigate }) {
  return (
    <div className="new-page">
      <h1>New Page</h1>
      <button onClick={() => onNavigate('home')}>Back Home</button>
    </div>
  );
}
```

2. **Create styling**:
```css
/* src/styles/NewPage.css */
.new-page {
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

3. **Import in App.jsx**:
```jsx
import NewPage from './pages/NewPage'

// Add case in renderPage()
case 'new-page':
  return <NewPage onNavigate={handleNavigateTo} />
```

### Modifying a Page

1. Open the specific page file in `src/pages/`
2. Edit the JSX structure or state
3. Save - hot reload will refresh the browser automatically

### Updating Styles

1. Open the corresponding CSS file in `src/styles/`
2. Make changes to CSS classes
3. Browser will auto-refresh

### Changing Language Support

Edit `LANGUAGES` array in [HomePage.jsx](src/pages/HomePage.jsx):

```jsx
const LANGUAGES = [
  { code: 'new', name: 'नயी भाषा', nativeName: 'New Language' },
  // ... existing languages
]
```

---

## 🧭 Navigation Flow

```javascript
// In App.jsx - handleNavigateTo() controls navigation
handleNavigateTo(page) {
  setCurrentPage(page);
}

// Navigate from any component
<button onClick={() => handleNavigateTo('home')}>
  Go Home
</button>
```

**Available pages**:
- `'home'` - Language selection
- `'voice-input'` - Voice recording
- `'services'` - Scheme listing
- `'eligibility'` - Eligibility checker
- `'application'` - Application form
- `'dashboard'` - CSC Dashboard

---

## 🎨 Design System Cheat Sheet

### Colors
```javascript
// Use these CSS variables
--primary: '#667eea'           // Main purple
--primary-dark: '#764ba2'      // Dark purple
--success: '#06D6A0'           // Green
--warning: '#FFB703'           // Orange
--danger: '#E63946'            // Red
--light: '#F7F7F7'             // Light background
```

### Common Button Styles
```jsx
// Primary Button
<button className="apply-button">Click Me</button>

// Secondary Button
<button className="prev-button">Back</button>

// Language Button
<button className="language-button">हिन्दी</button>

// Back Button
<button className="back-button">← वापस</button>
```

### Common Container Classes
```jsx
// Page Container
<div className="home-page"> ... </div>

// Card
<div className="card"> ... </div>

// Section
<div className="info-section"> ... </div>

// Form Group
<div className="form-group">
  <label>Label</label>
  <input className="form-input" />
</div>
```

---

## 🧪 Testing

### Run Linter
```bash
npm run lint
```

### Run Tests (when configured)
```bash
npm test
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 🐛 Debugging Tips

### 1. Check Browser Console
Open DevTools (F12) → Console tab to see errors

### 2. React DevTools Extension
Install React DevTools browser extension for component inspection

### 3. Console Logs
```javascript
// Add debug logs in components
console.log('User Profile:', userProfile);
console.log('Service:', selectedService);
```

### 4. Break on State Changes
```javascript
// Watch specific state
const [count, setCount] = useState(0);
useEffect(() => {
  console.log('Count changed to:', count);
}, [count]);
```

---

## 📚 Important Variables & Data

### User Profile Object
```javascript
{
  name: String,           // e.g., "राम कुमार"
  mobileNumber: String,   // e.g., "9876543210"
  language: String,       // e.g., "hi"
  transcript: String,     // Voice input text
  timestamp: ISO DateTime
}
```

### Service Object
```javascript
{
  id: Number,
  name: String,           // e.g., "PM-KISAN"
  icon: String Emoji,
  desc: String,
  details: String,
  eligible: Boolean
}
```

### Form Data Object
```javascript
{
  landArea: String,       // e.g., "2"
  landType: String,       // e.g., "owned"
  bankName: String,
  accountNumber: String,
  ifscCode: String,
  familyMembers: String,
  annualIncome: String
}
```

---

## 🔗 Useful Links

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **CSS Grid**: https://css-tricks.com/snippets/css/complete-guide-grid/
- **CSS Flexbox**: https://css-tricks.com/snippets/css/a-guide-to-flexbox/

---

## 🚨 Common Issues & Solutions

### Issue: Port already in use
```bash
# Kill the process using port 5174
# On Linux/Mac:
lsof -i :5174 | grep LISTEN | awk '{print $2}' | xargs kill -9

# On Windows:
netstat -ano | findstr :5174
taskkill /PID <PID> /F
```

### Issue: Styles not updating
- Clear browser cache (Ctrl+Shift+Delete)
- Force browser refresh (Ctrl+F5)
- Restart dev server

### Issue: Hot reload not working
- Check file is saved (Ctrl+S)
- Restart dev server: `npm run dev`

### Issue: Import errors
- Check file path is correct (case-sensitive)
- Verify `.jsx` extension is included
- Ensure file exists in the directory

---

## ✅ Development Checklist

Before submitting changes:

- [ ] No ESLint errors: `npm run lint`
- [ ] All pages render correctly
- [ ] All buttons navigate properly
- [ ] Forms validate correctly
- [ ] Responsive design works (test mobile view)
- [ ] Language loading works
- [ ] No console errors (F12)
- [ ] Color contrast is accessible
- [ ] Code is readable and commented

---

## 📞 Getting Help

**Team Members**:
- **Stuti** (Frontend): stuti_j@cy.iitr.ac.in (Frontend & UX Lead)
- **Bhavy** (Backend): Backend support needed?

**Documentation**:
1. [FRONTEND_README.md](./FRONTEND_README.md) - Overview
2. [FEATURES.md](./FEATURES.md) - Detailed features
3. [ARCHITECTURE.md](./ARCHITECTURE.md) - Backend integration

**Quick Reference**:
- React Docs: https://react.dev
- CSS Grid: https://css-tricks.com/snippets/css/complete-guide-grid/

---

## 🎓 Learning Path for New Contributors

### Week 1: Setup & Basics
- Day 1-2: Install, run dev server, explore pages
- Day 3-4: Understand component structure
- Day 5: Make a small style change

### Week 2: Component Development
- Day 1-2: Extend an existing page
- Day 3-4: Create a new simple component
- Day 5: Write CSS for it

### Week 3: Feature Development
- Day 1-2: Implement a new feature
- Day 3-4: Test across devices
- Day 5: Code review & refinement

---

**Happy Coding! 🚀** 

For the **Bada Pikachu** team building GraamSeva for the **AI Unlocked Hackathon**
