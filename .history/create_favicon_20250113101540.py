from PIL import Image
import os

# Open the image
img = Image.open('images/logo_white.png')

# Convert to RGBA if not already
img = img.convert('RGBA')

# Create background
background = Image.new('RGBA', img.size, (0, 0, 0, 0))

# Paste the image on the background
background.paste(img, (0, 0), img)

# Create different sizes
sizes = [(16, 16), (32, 32), (48, 48)]
icons = []

for size in sizes:
    # Resize the image with antialiasing
    resized_img = background.resize(size, Image.Resampling.LANCZOS)
    icons.append(resized_img)

# Save as ICO
icons[0].save('favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=icons[1:])
