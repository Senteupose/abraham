# 📝 Todo List App - Local Storage

A modern, fully functional todo list application with **local storage** functionality. Your tasks are automatically saved to your browser's local storage and persist between sessions.

## ✨ Features

- ✅ **Add Tasks** - Create new tasks with ease
- 🎯 **Priority Levels** - Assign high, medium, or low priority to tasks
- ✓ **Mark Complete** - Check off completed tasks
- 🗑️ **Delete Tasks** - Remove individual tasks
- 🔍 **Filter Tasks** - View all, active, or completed tasks
- 💾 **Local Storage** - Tasks persist in browser storage
- 📊 **Statistics** - View total, active, and completed task counts
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Clean, beautiful interface with smooth animations
- ⚡ **Fast & Lightweight** - No dependencies, pure JavaScript

## 🚀 Usage

### Opening the App
1. Open `index.html` in your web browser
2. Or navigate to the app URL if deployed

### Adding a Task
1. Type your task in the input field
2. Click **"+ Add Task"** or press **Enter**
3. Your task appears in the list

### Managing Tasks
- **Check a task** to mark it as completed
- **Delete** removes a task immediately
- **Clear Completed** removes all completed tasks at once
- **Delete All Tasks** removes all tasks (with confirmation)

### Filtering Tasks
- **All** - Show all tasks
- **Active** - Show only incomplete tasks
- **Completed** - Show only completed tasks

## 💾 Local Storage

- All tasks are automatically saved to browser local storage
- Tasks persist even after closing the browser
- Each browser has its own separate storage
- Storage limit is typically 5-10MB per domain

## 🎨 Customization

Edit `styles.css` to customize:
- Colors and theme
- Fonts and text sizes
- Animations and transitions
- Button styles
- Background gradients

## 📋 File Structure

```
todo/
├── index.html      # Main HTML file
├── styles.css      # Styling and layout
├── script.js       # JavaScript functionality
└── README.md       # Documentation
```

## 🛠️ Technical Details

- **Storage Method**: Browser LocalStorage API
- **Data Format**: JSON
- **Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **No Server Required**: Fully client-side application

## 💡 How Local Storage Works

```javascript
// Saving data
localStorage.setItem('todos', JSON.stringify(todos));

// Loading data
const todos = JSON.parse(localStorage.getItem('todos'));
```

## 🔒 Security

- XSS protection with HTML escaping
- Input validation
- No sensitive data stored
- Private to your browser

## 🌐 Deployment

### GitHub Pages
1. Create a GitHub repo
2. Push the `todo` folder
3. Enable GitHub Pages in repo settings
4. Access via `https://username.github.io/repo-name/todo/`

### Other Hosting
- Netlify
- Vercel
- Firebase Hosting
- Any static file host

## 📱 Browser Support

| Browser | Support |
|---------|----------|
| Chrome  | ✅ Yes |
| Firefox | ✅ Yes |
| Safari  | ✅ Yes |
| Edge    | ✅ Yes |
| IE11    | ❌ No |

## 🎯 Future Enhancements

- [ ] Task categories/tags
- [ ] Due dates and reminders
- [ ] Task search/filter by text
- [ ] Dark mode toggle
- [ ] Export/Import tasks
- [ ] Cloud sync option
- [ ] Recurring tasks
- [ ] Task notes/descriptions

## 📝 License

Free to use and modify.

## 🤝 Contributing

Feel free to fork, modify, and improve!

---

**Made with ❤️ using vanilla JavaScript**