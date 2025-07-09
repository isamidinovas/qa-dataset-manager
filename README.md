# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/1ab2c92b-395a-4b91-a9c5-46dbd1534061

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1ab2c92b-395a-4b91-a9c5-46dbd1534061) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Redux Toolkit
- Axios for API communication

## API Configuration

This frontend is configured to connect to a backend API running on port 5005. The API configuration is set up in `src/lib/api.ts`.

### Environment Variables

You can configure the API base URL using the environment variable:

```
VITE_API_BASE_URL=http://localhost:5005/api
```

If not set, it defaults to `http://localhost:5005/api`.

### API Endpoints

The application expects the following API endpoints:

- `GET /api/files` - Get list of files
- `GET /api/files/{fileId}/dialogues` - Get dialogues for a file
- `POST /api/files/{fileId}/dialogues` - Create a new dialogue
- `PUT /api/files/{fileId}/dialogues/{dialogueIndex}` - Update a dialogue
- `DELETE /api/files/{fileId}/dialogues/{dialogueIndex}` - Delete a dialogue
- `GET /api/datasets/{datasetId}/conversations` - Get conversations for a dataset

### Testing API Connection

The application includes an API test component that you can use to verify the connection to your backend. Look for the "Test API Connection" button in the header.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1ab2c92b-395a-4b91-a9c5-46dbd1534061) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
