import uvicorn
import os
from app.main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5040))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )