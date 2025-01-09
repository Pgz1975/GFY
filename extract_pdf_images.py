import fitz  # PyMuPDF
import os
import io
from PIL import Image

def extract_images_from_pdf(pdf_path, output_dir):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Open the PDF
    pdf_document = fitz.open(pdf_path)
    
    # Counter for unique image names
    image_count = 0

    print(f"Processing PDF: {pdf_path}")
    print(f"Saving images to: {output_dir}")

    # Iterate through each page
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        
        # Get images from page
        images = page.get_images()
        
        # Iterate through images on the page
        for img_index, img in enumerate(images):
            # Get image data
            xref = img[0]
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
            
            # Get image extension and color space
            ext = base_image["ext"]
            colorspace = base_image.get("colorspace", 0)
            
            try:
                # Open image with PIL
                image = Image.open(io.BytesIO(image_bytes))
                
                # Skip small images (likely icons or decorations)
                if image.width < 100 or image.height < 100:
                    continue
                
                # Handle PNG with transparency
                if ext.lower() == "png":
                    # Convert to RGBA if it's not already
                    if image.mode != 'RGBA':
                        image = image.convert('RGBA')
                    
                    # Save PNG with transparency
                    image_count += 1
                    image_filename = f"pdf_image_{image_count}.png"
                    image_path = os.path.join(output_dir, image_filename)
                    image.save(image_path, 'PNG')
                else:
                    # Save other formats as is
                    image_count += 1
                    image_filename = f"pdf_image_{image_count}.{ext}"
                    image_path = os.path.join(output_dir, image_filename)
                    with open(image_path, "wb") as f:
                        f.write(image_bytes)
                
                print(f"Saved image {image_count}: {image_filename} ({image.width}x{image.height}) - Mode: {image.mode}")
                
            except Exception as e:
                print(f"Error processing image: {e}")
                continue

    pdf_document.close()
    print(f"\nExtracted {image_count} images from PDF")

if __name__ == "__main__":
    pdf_path = r"D:\GEM\Education\MaestrAI\RD\Greenfinity\Greenfinity_Pitch_REV11.pdf"
    output_dir = r"D:\GEM\Education\MaestrAI\RD\Greenfinity\images"
    
    extract_images_from_pdf(pdf_path, output_dir)
