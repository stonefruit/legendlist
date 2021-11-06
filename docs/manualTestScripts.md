# Manual Test Scripts

## Tasks Section

Visibility of "Show Completed"

- "Show Completed" text should not appear if no completed tasks for the folder are available.
- "Show Completed" text should disappear when last remaining completed task is made uncompleted.
  - Create new folder
  - Add 1 task
  - Complete the Task
  - [VERIFY] "Show Completed (1)" appears
  - Click "Show Completed (1)"
  - [VERIFY] "Completed" appears
  - Un-complete the task
  - [VERIFY] "Completed" disappears
