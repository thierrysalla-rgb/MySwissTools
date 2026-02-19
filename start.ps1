$backendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\uvicorn main:app --reload --port 8000" -PassThru
$frontendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -PassThru

Write-Host "Both servers started."
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
