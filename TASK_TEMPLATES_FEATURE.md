# 📋 Task Templates Feature

## Overview
The Task Templates feature allows you to create reusable task layouts with prefilled information, saving time when creating similar tasks repeatedly.

## Features

### 1. **Create Task Templates**
Save commonly used task configurations:
- Template name and description
- Task title template
- Task description template
- Default priority level
- Pre-assigned labels
- Default due date (relative days)

### 2. **Use Templates**
Create tasks instantly from templates:
- One-click task creation
- Auto-populated fields
- Consistent task structure
- Save time on repetitive work

### 3. **Manage Templates**
Full lifecycle management:
- Create new templates
- Edit existing templates
- Delete templates
- Search and filter templates
- Template descriptions for organization

### 4. **Template Library**
- View all templates in grid layout
- Organize by name
- Display template metadata
- Quick actions (Use, Edit, Delete)

---

## How to Use

### Accessing Task Templates

**From Sidebar:**
1. Click **"Task Templates"** in the Tools section of the sidebar
2. Templates modal opens showing all your templates

### Creating a Template

**Method 1: From Scratch**
1. Click **"Task Templates"** in sidebar
2. Click **"+ New Template"** button
3. Fill in template details:
   - **Template Name**: Unique identifier for the template
   - **Description**: What this template is for (optional)
   - **Task Title**: The title template for tasks
   - **Task Description**: Default description text
   - **Priority**: Default priority level (Low, Medium, High)
   - **Labels**: Comma-separated labels
   - **Due Date**: Days from now (0 = today, 7 = next week)
4. Click **"Save Template"**

**Example Templates:**

**Bug Report Template:**
- Name: "Bug Report"
- Title: "[Bug] {Issue Description}"
- Priority: "High"
- Labels: "bug, urgent"
- Due Date: 3 days

**Feature Request Template:**
- Name: "Feature Request"
- Title: "[Feature] {Feature Name}"
- Description: "User Story:\nAs a [user],\nI want [feature],\nSo that [benefit]"
- Priority: "Medium"
- Labels: "feature, enhancement"
- Due Date: 7 days

**Documentation Template:**
- Name: "Documentation"
- Title: "Document: {Topic}"
- Description: "Write documentation for...\n\nKey points to cover:\n- \n- "
- Priority: "Low"
- Labels: "documentation"
- Due Date: 5 days

### Using a Template

1. Click **"Task Templates"** in sidebar
2. Find the template you want to use
3. Click the **arrow button** (→) on the template card
4. Task is created instantly in your current board
5. You'll see a confirmation message

The task appears in the **To Do column** with all template information pre-filled.

### Editing a Template

1. Open **"Task Templates"**
2. Find the template to edit
3. Click the **edit button** (pencil icon)
4. Update the template details
5. Click **"Save Template"**

### Deleting a Template

1. Open **"Task Templates"**
2. Find the template to delete
3. Click the **delete button** (trash icon)
4. Confirm deletion

### Searching Templates

1. Open **"Task Templates"**
2. Type in the search box
3. Templates filter by name and description in real-time

---

## Template Metadata

Each template displays:
- **Title**: Template name
- **Description**: What the template is for
- **Task Title Badge**: Shows the task title template
- **Priority Badge**: Shows the default priority
- **Labels Badge**: Shows number of labels (if any)

---

## Template Syntax

### Title and Description
- Use plain text or variables (as notes)
- Keep titles concise
- Descriptions can have line breaks

**Example:**
```
Title: [Bug] User cannot login
Description: 
Steps to reproduce:
1. 
2. 

Expected behavior:


Actual behavior:


Error messages:
```

### Labels
- Comma-separated list
- Each label becomes a separate tag on the task
- Example: `bug, urgent, frontend, high-priority`

### Due Date
- Relative to creation date
- 0 = Today
- 7 = One week from now
- 365 = One year from now

---

## Use Cases

### Software Development
**Templates:**
1. **Bug Report** - Priority: High, Labels: bug, Labels: fix needed
2. **Feature Request** - Priority: Medium, Labels: feature, enhancement
3. **Code Review** - Priority: Medium, Labels: review, code
4. **Refactoring** - Priority: Low, Labels: technical-debt

### Marketing
**Templates:**
1. **Blog Post** - Labels: content, marketing, due 5 days
2. **Social Media** - Labels: social, marketing, due 1 day
3. **Campaign** - Priority: High, Labels: campaign, marketing, due 7 days

### Content Creation
**Templates:**
1. **Article Draft** - Labels: writing, review, due 3 days
2. **Video Script** - Labels: video, content, due 5 days
3. **Design Asset** - Labels: design, visual, due 7 days

### Project Management
**Templates:**
1. **Planning Session** - Labels: planning, meeting, due 1 day
2. **Status Report** - Labels: reporting, status, due 1 day
3. **Sprint Review** - Labels: sprint, review, due 0 days

---

## Template Best Practices

### ✅ Do's
- Keep template names short and descriptive
- Use consistent naming conventions
- Create templates for recurring task types
- Include descriptions for clarity
- Use labels to categorize work
- Set appropriate default priorities

### ❌ Don'ts
- Don't create too many similar templates
- Don't leave descriptions empty if templates are complex
- Don't use overly specific titles
- Don't forget to set due dates when relevant

---

## Data Storage

Templates are stored in browser localStorage:
- **Key**: `kanbanTaskTemplates`
- **Format**: JSON array
- **Persistence**: Across browser sessions
- **Export**: Available through board settings

**Template Structure:**
```javascript
{
  id: "unique-id",
  name: "Template Name",
  description: "Brief description",
  title: "Task title template",
  description: "Task description template",
  priority: "medium",
  labels: ["label1", "label2"],
  dueDateDays: 7,
  createdAt: "2025-12-20T..."
}
```

---

## Task Creation from Template

When you use a template, a new task is created with:
- ✅ Title from template
- ✅ Description from template
- ✅ Priority from template
- ✅ Labels from template
- ✅ Due date (template days + today)
- ✅ Status: To Do (first column)
- ✅ Empty assignee (you can assign later)
- ✅ Current timestamp

**You can then:**
- Edit any field
- Add assignee
- Add subtasks
- Add comments
- Move between columns
- Adjust due date

---

## Keyboard Shortcuts
*(Coming in future updates)*

---

## Troubleshooting

### Template not saving?
- Check that Template Name and Task Title are filled
- Verify browser allows localStorage
- Try creating with minimal data first

### Tasks not inheriting template data?
- Confirm labels are comma-separated
- Check template has been saved
- Verify due date days are numeric

### Can't find template?
- Use search box to filter
- Check if template was actually saved
- Clear browser cache if needed

### Labels not appearing on created task?
- Ensure labels are comma-separated
- Check for extra spaces in label names
- Verify labels format in template

---

## Integration with Other Features

Templates work seamlessly with:
- ✅ Multiple boards (create tasks in any board)
- ✅ Task filters (filter created tasks)
- ✅ Task labels (templates include labels)
- ✅ Priority levels (templates set priority)
- ✅ Due dates (templates set relative dates)
- ✅ Team assignments (add assignees after creation)

---

## Performance

- **Storage**: Minimal (each template ~500 bytes)
- **Load time**: Instant
- **Search**: Real-time filtering
- **Creation**: Instant task generation
- **Limits**: Browser localStorage typically 5-10MB

---

## Privacy & Data

- ✅ All templates stored locally in browser
- ✅ No server/cloud storage
- ✅ Cleared when browser data is cleared
- ✅ Export templates via board backup

---

## Future Enhancements

Planned features for Task Templates:
- Shared template library
- Cloud backup and sync
- Template versioning
- Template categories
- Bulk task creation from templates
- Template statistics
- Template import/export
- Team template sharing
- Template scheduling
- AI-powered template suggestions

---

## Tips & Tricks

### 1. **Create a Master Template**
Create a general template as a starting point:
- Name: "Basic Task"
- Title: "Task: {Description}"
- Description: "Created from template"
- Priority: Medium

### 2. **Use Descriptive Names**
Instead of: "Template 1"
Use: "Bug Report - Frontend Issue"

### 3. **Include Context in Descriptions**
Add section headers to help users fill in the template:
```
Description:
### Problem
[User describes the issue]

### Steps to Reproduce
1. 
2. 

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]
```

### 4. **Consistent Labeling**
Create a labeling convention:
- Use: `status-active`, `priority-high`, `type-bug`
- Not: `active`, `high`, `bug issue` (inconsistent)

### 5. **Due Date Strategy**
- **Urgent**: 1 day
- **High Priority**: 3 days
- **Medium**: 7 days
- **Low**: 14 days

---

## Summary

Task Templates streamline task creation by:
1. 📋 Storing reusable task configurations
2. ⚡ Creating tasks in seconds
3. 🎯 Ensuring consistency across similar tasks
4. 💡 Reducing manual data entry
5. 🗂️ Organizing work by type

**Start creating templates today to save time tomorrow!** 🚀

---

*Last Updated: 2025-12-20*
*Kanban Board v2.1 - Task Templates*
