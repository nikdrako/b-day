import os
from PIL import Image

# Папка з твоїми оригінальними зображеннями
INPUT_DIR = "images_webp"
# Куди зберігати результати
OUTPUT_DIR = "output"

# Які ширини тобі потрібні
SIZES = [480, 768, 1080]

# Переконайся, що вихідна папка існує
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Пройти по всіх файлах у вхідній папці
for filename in os.listdir(INPUT_DIR):
    if filename.endswith(".webp") or filename.endswith(".jpg") or filename.endswith(".png"):
        img_path = os.path.join(INPUT_DIR, filename)
        with Image.open(img_path) as img:
            for width in SIZES:
                # Обчислити висоту, зберігаючи співвідношення сторін
                aspect_ratio = img.height / img.width
                height = int(width * aspect_ratio)
                resized_img = img.resize((width, height), Image.LANCZOS)

                # Зберегти з новим іменем
                base_name, ext = os.path.splitext(filename)
                new_filename = f"{base_name}_{width}w.webp"
                output_path = os.path.join(OUTPUT_DIR, new_filename)
                resized_img.save(output_path, "WEBP", quality=80)

                print(f"✔ Saved: {output_path}")

print("✅ Усі зображення оброблено й збережено у 'output/'")
