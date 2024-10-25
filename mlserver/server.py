from fastapi import FastAPI, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from pathlib import Path
import asyncio
import shutil
import uuid
from typing import Dict, Optional
from pydantic import BaseModel
from lectures import MediaProcessor

app = FastAPI(title="Media Processing API")

# Store active processing tasks
active_tasks: Dict[str, dict] = {}

class ProcessingResponse(BaseModel):
    task_id: str
    status: str
    message: str

class ProcessingResult(BaseModel):
    transcript_path: str
    analysis_path: str
    keyframes_dir: str

# Initialize MediaProcessor
processor = MediaProcessor(base_dir="media_storage")

async def process_video_task(task_id: str, file_path: Path):
    try:
        result = await processor.process_media(file_path)
        active_tasks[task_id] = {
            "status": "completed",
            "result": result
        }
    except Exception as e:
        active_tasks[task_id] = {
            "status": "failed",
            "error": str(e)
        }
    finally:
        # Cleanup uploaded file
        if file_path.exists():
            file_path.unlink()

async def generate_transcript_task(task_id: str, file_path: Path):
    try:
        result = await processor.generate_transcript(file_path)
        active_tasks[task_id] = {
            "status": "completed",
            "result": result
        }
    except Exception as e:
        active_tasks[task_id] = {
            "status": "failed",
            "error": str(e)
        }
    finally:
        if file_path.exists():
            file_path.unlink()

async def generate_analysis_task(task_id: str, file_path: Path):
    try:
        result = await processor.analyze_transcript(file_path)
        active_tasks[task_id] = {
            "status": "completed",
            "result": result
        }
    except Exception as e:
        active_tasks[task_id] = {
            "status": "failed",
            "error": str(e)
        }
    finally:
        if file_path.exists():
            file_path.unlink()

async def get_images_task(task_id: str, file_path: Path, analysis_path):
    try:
        result = await processor.extract_keyframes(file_path, analysis_path=analysis_path)
        active_tasks[task_id] = {
            "status": "completed",
            "result": result
        }
    except Exception as e:
        active_tasks[task_id] = {
            "status": "failed",
            "error": str(e)
        }
    finally:
        if file_path.exists():
            file_path.unlink()

@app.post("/generate-transcript", response_model=ProcessingResponse)
async def genereate_transcript(
    background_tasks: BackgroundTasks,
    file: UploadFile
):
    if not file.filename.endswith('.mp4'):
        raise HTTPException(status_code=400, detail="Only MP4 files are supported")

    # Create unique task ID
    task_id = str(uuid.uuid4())
    
    # Save uploaded file
    file_path = Path(f"media_storage/temp/{task_id}_{file.filename}")
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Initialize task status
    active_tasks[task_id] = {"status": "processing"}
    
    # Start processing in background
    background_tasks.add_task(generate_transcript_task, task_id, file_path)

    return ProcessingResponse(
        task_id=task_id,
        status="processing",
        message="File uploaded successfully"
    )

@app.post("/generate-analysis", response_model=ProcessingResponse)
async def generate_analysis(background_tasks: BackgroundTasks, file: UploadFile): 
    if not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Only .txt files are supported for analysis generation")
    
    task_id = str(uuid.uuid4())
    file_path = Path(f"media_storage/analysis/{task_id}_{file.filename}")
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    active_tasks[task_id] = {"status": "processing"}
    background_tasks.add_task(generate_analysis_task, task_id, file_path)

    return ProcessingResponse(task_id=task_id, status="processing", message="Analysis generation started")

@app.post("/generate-key-images", response_model=ProcessingResponse)
async def generate_key_images(
    background_tasks: BackgroundTasks, 
    file: UploadFile, 
    analysis: Optional[UploadFile] = None
):
    # Check if the file is an MP4 video
    if not file.filename.endswith('.mp4'):
        raise HTTPException(status_code=400, detail="Only MP4 files are supported for keyframe extraction")

    # Generate a unique task ID
    task_id = str(uuid.uuid4())
    
    # Save the MP4 file
    file_path = Path(f"media_storage/temp/{task_id}_{file.filename}")
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video file: {str(e)}")

    # If an analysis JSON file is provided, save it as well
    analysis_path = None
    if analysis:
        if not analysis.filename.endswith('.json'):
            raise HTTPException(status_code=400, detail="Only .json files are supported for analysis")
        
        analysis_path = Path(f"media_storage/analysis/{task_id}_{analysis.filename}")
        analysis_path.parent.mkdir(parents=True, exist_ok=True)
        
        try:
            with analysis_path.open("wb") as buffer:
                shutil.copyfileobj(analysis.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save analysis file: {str(e)}")

    # Initialize task status
    active_tasks[task_id] = {"status": "processing"}

    # Start the background task
    background_tasks.add_task(get_images_task, task_id, file_path, analysis_path)

    return ProcessingResponse(
        task_id=task_id,
        status="processing",
        message="Keyframe extraction started"
    )

@app.post("/upload", response_model=ProcessingResponse)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile
):
    if not file.filename.endswith('.mp4'):
        raise HTTPException(status_code=400, detail="Only MP4 files are supported")

    # Create unique task ID
    task_id = str(uuid.uuid4())
    
    # Save uploaded file
    file_path = Path(f"media_storage/temp/{task_id}_{file.filename}")
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Initialize task status
    active_tasks[task_id] = {"status": "processing"}
    
    # Start processing in background
    background_tasks.add_task(process_video_task, task_id, file_path)

    return ProcessingResponse(
        task_id=task_id,
        status="processing",
        message="Video upload successful. Processing started."
    )

@app.get("/status/{task_id}", response_model=ProcessingResponse)
async def get_status(task_id: str):
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_info = active_tasks[task_id]
    status = task_info["status"]
    
    message = "Processing in progress"
    if status == "completed":
        message = "Processing completed successfully"
    elif status == "failed":
        message = f"Processing failed: {task_info.get('error', 'Unknown error')}"
    
    return ProcessingResponse(
        task_id=task_id,
        status=status,
        message=message
    )

@app.get("/result/{task_id}")
async def get_result(task_id: str):
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_info = active_tasks[task_id]
    if task_info["status"] != "completed":
        raise HTTPException(
            status_code=400, 
            detail=f"Task is not completed. Current status: {task_info['status']}"
        )
    
    return JSONResponse(content=task_info["result"])

@app.get("/analysis/{task_id}")
async def get_analysis(task_id: str):
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_info = active_tasks[task_id]
    if task_info["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Task is not completed. Current status: {task_info['status']}"
        )
    
    analysis_path = Path(task_info["result"]["analysis"]) / f"ai_lecture_analysis.json"
    if not analysis_path.exists():
        raise HTTPException(status_code=404, detail="Analysis file not found")
    
    return FileResponse(analysis_path)

@app.get("/keyframe/{task_id}/{frame_number}")
async def get_keyframe(task_id: str, frame_number: int):
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_info = active_tasks[task_id]
    if task_info["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Task is not completed. Current status: {task_info['status']}"
        )
    
    keyframes_dir = Path(task_info["result"]["keyframes_dir"])
    frames = list(keyframes_dir.glob("frame_*.jpg"))
    
    if not frames or frame_number >= len(frames):
        raise HTTPException(status_code=404, detail="Keyframe not found")
    
    return FileResponse(frames[frame_number])

@app.get("/transcript/{task_id}")
async def get_transcript(task_id: str):
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_info = active_tasks[task_id]
    if task_info["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Task is not completed. Current status: {task_info['status']}"
        )
    
    transcript_path = Path(task_info["result"]["transcript_path"])
    if not transcript_path.exists():
        raise HTTPException(status_code=404, detail="Transcript file not found")
    
    return FileResponse(transcript_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)