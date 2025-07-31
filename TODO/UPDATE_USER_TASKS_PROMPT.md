# Prompt for Updating USER_TASKS.md

## Goal
To generate a list of small, educational tasks for a developer to perform manually on the codebase. These tasks should help them gain a better architectural understanding of the project. The output should be appended to the `TODO/USER_TASKS.md` file.

## Context
- **Project:** AquarianGnosis (Full-stack application)
- **Frontend:** React, TypeScript, Vite
- **Backend:** Python, FastAPI, SQLAlchemy, Alembic
- **Current Tasks File:** `/Users/admin/dev/AquarianGnosis/TODO/USER_TASKS.md`

## Instructions for the Agent

1.  **Analyze the Codebase:** Review the current file structure and key files (e.g., `client/src/App.tsx`, `server/app/main.py`, `package.json`, `requirements.txt`) to understand the current state of the application.

2.  **Review Existing Tasks:** Read the contents of `/Users/admin/dev/AquarianGnosis/TODO/USER_TASKS.md` to understand what tasks have already been suggested. Your new suggestions should complement or extend the existing ones, not repeat them.

3.  **Identify New Task Areas:** Based on your analysis, identify 2-3 new areas where the user could make minimal manual edits to learn about the system. Focus on different aspects of the codebase than previous tasks. Examples include:
    -   Styling and CSS architecture.
    -   State management (e.g., adding a new slice to a store).
    -   API interaction (e.g., adding a new endpoint and calling it).
    -   Configuration (e.g., adding a new environment variable).
    -   Testing (e.g., writing a simple unit test for a component or API endpoint).

4.  **Formulate a Task List:** For each new task, provide a clear, step-by-step guide. The instructions should be specific enough for a developer to follow without needing further assistance. Explain the *purpose* of the task (i.e., what the user will learn).

5.  **Generate the Output:** Create a markdown-formatted string containing the new tasks. This string will be appended to `TODO/USER_TASKS.md`. The format should be consistent with the existing entries in that file.

## Example Task Format

### Task X: [Descriptive Task Title]

**Goal:** A brief explanation of what the user will learn from this task.

**Steps:**

1.  **File:** `path/to/file_to_edit.ext`
    -   **Action:** A clear, concise description of the change to make.
2.  **File:** `path/to/another_file.ext`
    -   **Action:** ...
3.  **Verification:** How to check if the change was successful (e.g., "Run the app and navigate to the new page," "Run `pytest`").

---