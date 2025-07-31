# User Tasks for Codebase Understanding

This file contains a list of small, manageable tasks you can perform by hand to better understand the architecture and workflow of the AquarianGnosis project. Completing these will help you feel more comfortable making manual edits without an AI agent.

---

### Task 1: Add a New Frontend Page

**Goal:** Understand frontend routing, page creation, and component structure in the React application.

**Steps:**

1.  **Create the page component:**
    -   Create a new file: `/Users/admin/dev/AquarianGnosis/client/src/pages/AboutPage.tsx`
    -   Add the following content to it:
        ```tsx
        import React from 'react';

        const AboutPage: React.FC = () => {
          return (
            <div>
              <h1>About Us</h1>
              <p>This is the about page for Aquarian Gnosis.</p>
            </div>
          );
        };

        export default AboutPage;
        ```

2.  **Add the route:**
    -   **File:** `/Users/admin/dev/AquarianGnosis/client/src/App.tsx`
    -   **Action:** Import the new `AboutPage` and add a new `<Route>` for it within the `<Routes>` component. You'll also want to add a `<Link>` to it in the main navigation area so you can click to it.
    -   **Example change:**
        ```tsx
        // At the top with other imports
        import AboutPage from './pages/AboutPage';

        // Inside the <Routes> component
        <Route path="/about" element={<AboutPage />} />

        // Somewhere in your main layout/navigation
        <Link to="/about">About</Link>
        ```

3.  **Verification:**
    -   Run the client development server (likely `npm run dev` inside the `client` directory).
    -   Open your browser to the application, find the "About" link, and click it. You should see the new page.

---

### Task 2: Add a Simple API Endpoint

**Goal:** Understand how to create a new API endpoint using FastAPI.

**Steps:**

1.  **Edit the API router:**
    -   **File:** `/Users/admin/dev/AquarianGnosis/server/app/api/users.py` (or you could create a new file in `server/app/api/` for general-purpose endpoints).
    -   **Action:** Add a new GET endpoint.
    -   **Example code:**
        ```python
        from fastapi import APIRouter

        router = APIRouter()

        # ... existing user routes

        @router.get("/hello")
        def read_root():
            return {"message": "Hello from the API"}
        ```
        *(Note: If you add this to `users.py`, it will be available at `/api/v1/users/hello` based on typical FastAPI project structure. You may need to adjust the prefix.)*

2.  **Verification:**
    -   Run the backend server (see `server/start_backend.sh` or `server/run.py`).
    -   Open your browser or use `curl` to access `http://127.0.0.1:8000/api/v1/users/hello` (the exact URL may vary based on the API prefix configuration in `server/app/main.py`). You should see the JSON response.

---

### Task 3: Connect Frontend to the New API Endpoint

**Goal:** Understand how the frontend makes API calls to the backend and displays the data.

**Steps:**

1.  **Update the API service:**
    -   **File:** `/Users/admin/dev/AquarianGnosis/client/src/services/api.ts`
    -   **Action:** Add a new function to fetch data from your `/hello` endpoint.
    -   **Example code:**
        ```ts
        import axios from 'axios';

        const apiClient = axios.create({
          baseURL: 'http://localhost:8000/api/v1', // Or your actual API base URL
          // ... other config
        });

        // ... existing functions

        export const getHelloMessage = async () => {
          const response = await apiClient.get('/users/hello'); // Adjust path if needed
          return response.data;
        };
        ```

2.  **Call the service from your component:**
    -   **File:** `/Users/admin/dev/AquarianGnosis/client/src/pages/AboutPage.tsx`
    -   **Action:** Use `useEffect` and `useState` to call the new API function and display its message.
    -   **Example change:**
        ```tsx
        import React, { useState, useEffect } from 'react';
        import { getHelloMessage } from '../services/api';

        const AboutPage: React.FC = () => {
          const [message, setMessage] = useState('');

          useEffect(() => {
            getHelloMessage()
              .then(data => setMessage(data.message))
              .catch(err => console.error(err));
          }, []);

          return (
            <div>
              <h1>About Us</h1>
              <p>This is the about page for Aquarian Gnosis.</p>
              <p><strong>Message from API:</strong> {message}</p>
            </div>
          );
        };

        export default AboutPage;
        ```

3.  **Verification:**
    -   With both client and server running, navigate to the `/about` page. You should see the message "Hello from the API" displayed.