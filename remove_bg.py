from PIL import Image
import os

def remove_white_bg(input_path, output_path, tolerance=240):
    if not os.path.exists(input_path):
        print(f"Skipping {input_path} (not found)")
        return
        
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # If pixel is close to white, make it transparent
        if item[0] > tolerance and item[1] > tolerance and item[2] > tolerance:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Optional: crop to bounding box to remove excess transparent space
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved transparent PNG to {output_path}")

base_dir = r"C:\Users\naman\.gemini\antigravity\brain\58abeb10-e75e-49a8-bf74-39b147d62184"
out_dir = r"D:\midnight-radio\public"

tasks = [
    ("neon_bike_1786556973859.jpg", "neon_bike.png"),
    ("train_window_1786557003457.jpg", "train_window.png"),
    ("ocean_sunset_1786557024408.jpg", "ocean_sunset.png"),
    ("city_balcony_1786557303186.jpg", "city_balcony.png"),
]

for in_file, out_file in tasks:
    input_path = os.path.join(base_dir, in_file)
    output_path = os.path.join(out_dir, out_file)
    remove_white_bg(input_path, output_path)
