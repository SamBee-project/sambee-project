import os
import shutil
from art import tprint
from ultralytics import YOLO
from roboflow import Roboflow


def print_logo(text):
    """Print logo"""
    tprint("text")
        
def download_test_data(api_key, workspace, project_name, version_number):
    """Download dataset"""
    print(f"[+] downloading dataset... {project_name}")
    
    rf = Roboflow(api_key=api_key)
    project = rf.workspace(workspace).project(project_name)
    dataset = project.version(version_number).download("yolov11")
    
    return os.path.join(dataset.location, "test/images")

def run_inference(model_path, source_path, output_project, conf_threshold=0.25):
    """Run detection and save results"""
    print(f"[+] Starting detection... (Model: {model_path})")
    model = YOLO(model_path)
    
    results = model.predict(
        source=source_path,
        conf=conf_threshold,
        save=True,
        project=output_project,
        name="presentation_results",
        exist_ok=True
    )
    
    save_dir = results[0].save_dir
    print(f"[+] Results saved to: {save_dir}")
    
    return save_dir

def create_archive(source_folder, output_filename):
    """Create archive for downloading"""
    print(f"[+] Creating archive... {output_filename}.zip ---")
    
    base_name = output_filename.replace('.zip', '')
    shutil.make_archive(base_name, 'zip', source_folder)
    print(f"[+] The archive is ready for download: {base_name}.zip")


API_KEY = "Your API key"
MY_MODEL = "Path to your model"
OUTPUT_PATH = "Your output_path"

try:
    print_logo("SAMBEE 67")
    
    test_path = download_test_data(API_KEY, "varroa-j8231", "varroa-bxxhd", 1) #There can be your datasets and ws`s

    results_folder = run_inference(MY_MODEL, test_path, OUTPUT_PATH, conf_threshold=0.3)

    create_archive(results_folder, "Varroa_Test")

    print("\n [+] Your archive successfully instaled")

except Exception as e:
    print(f"\n [!] Somethig else wrong: {e}")
