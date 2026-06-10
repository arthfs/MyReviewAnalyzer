# 🎓 Professor Review Analyzer

A full-stack web application that aggregates **RateMyProfessor** reviews and uses **Google Gemini AI** to generate concise sentiment summaries — helping students quickly understand a professor's strengths and weaknesses before enrolling.

🔗 **Live Demo**: [main.diaa8k2av4mc2.amplifyapp.com](https://main.diaa8k2av4mc2.amplifyapp.com)

---

## ✨ Features

- 🔍 **Search any professor** by first and last name
- 🤖 **AI-powered summaries** — Gemini generates 5 positive and 5 negative takeaways from student reviews
- 📚 **Course filtering** — filter reviews and sentiment analysis by specific courses
- ⚡ **Fast & scalable** — containerized backend deployed on AWS ECS Fargate behind a load balancer
- 🔄 **Auto-deploys** — frontend CI/CD pipeline triggered automatically on every GitHub push

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        User Browser                      │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              AWS Amplify (Next.js Frontend)              │
│         Auto-deploys from GitHub on every push          │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API calls
                      ▼
┌─────────────────────────────────────────────────────────┐
│         Application Load Balancer (AWS ALB)             │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│           AWS ECS Fargate (FastAPI Backend)             │
│              Docker container via ECR                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              AWS RDS (MySQL Database)                   │
│         Professor reviews stored via SQLAlchemy         │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
MyReviewAnalyzer/
├── review_analyzer/          # Next.js frontend
│   ├── app/
│   │   ├── page.tsx          # Main search page
│   │   ├── components/       # UI components (cards, search button, select)
│   │   └── contexts/         # React context (loading state)
│   ├── public/
│   └── package.json
│
└── my-fastapi-project/       # FastAPI backend
    ├── main.py               # API routes
    ├── database.py           # SQLAlchemy models & DB logic
    ├── Dockerfile
    └── requirements.txt
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Material UI |
| Backend | FastAPI, Python, SQLAlchemy |
| Database | MySQL (AWS RDS) |
| AI | Google Gemini API |
| Containerization | Docker, AWS ECR |
| Hosting (Backend) | AWS ECS Fargate + Application Load Balancer |
| Hosting (Frontend) | AWS Amplify |
| CI/CD | AWS Amplify (auto-deploy on push) |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (for backend containerization)
- MySQL (local) or AWS RDS instance

---

### Backend Setup

```bash
cd my-fastapi-project

# Install dependencies
pip install -r requirements.txt

# Create a .env file
cp .env.example .env
```

Configure your `.env`:

```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/reviews
GEMINI_API_KEY=your_gemini_api_key
```

```bash
# Run the development server
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

---

### Frontend Setup

```bash
cd review_analyzer

# Install dependencies
npm install

# Create a .env.local file
cp .env.example .env.local
```

Configure your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
# Run the development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/reviews/{first_name}/{last_name}` | Get reviews + AI sentiment summary for a professor |

### Example Response

```json
{
  "reviews": ["...", "..."],
  "positive": [
    "Clear and organized lectures",
    "Very approachable during office hours",
    ...
  ],
  "negative": [
    "Inconsistent grading standards",
    "Exams are harder than practice material",
    ...
  ]
}
```

---

## ☁️ AWS Deployment

### Backend (ECS Fargate)

```bash
# Build and push Docker image to ECR
docker build -t fastapi-backend .
docker tag fastapi-backend:latest <your-ecr-uri>:latest
docker push <your-ecr-uri>:latest

# Force new ECS deployment
aws ecs update-service --cluster <cluster-name> \
  --service fastapi-backend-service \
  --force-new-deployment
```

### Frontend (Amplify)

Amplify auto-deploys on every push to `main`. To trigger manually:

```bash
git push origin main
```

Configure the following environment variable in the Amplify console:

```
NEXT_PUBLIC_API_URL = http://<your-alb-dns-name>
```

---

## 🔑 Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Backend (ECS Task Definition) | Full MySQL connection string |
| `GEMINI_API_KEY` | Backend (ECS Task Definition) | Google Gemini API key |
| `NEXT_PUBLIC_API_URL` | Frontend (Amplify Console) | Backend ALB URL |

> ⚠️ Never commit `.env` or `.env.local` files. They are listed in `.gitignore`.

---

## 📸 Screenshots

> _Coming soon_

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
